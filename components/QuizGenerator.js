"use client";

import { useState } from "react";
import {
  Brain,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Trophy,
} from "lucide-react";
import toast from "react-hot-toast";

export default function QuizGenerator({ selectedPDF, uploadedPDFs = [] }) {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [showExplanations, setShowExplanations] = useState(false);

  const generateQuestions = async () => {
    if (!selectedPDF) {
      toast.error("Please select a PDF first");
      return;
    }

    setIsGenerating(true);
    setQuestions([]);
    setUserAnswers({});
    setIsSubmitted(false);
    setScore(null);
    setShowExplanations(false);

    try {
      // First extract text from PDF
      const extractResponse = await fetch("/api/extractText", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pdfName: selectedPDF,
          pdfFile: uploadedPDFs.includes(selectedPDF) ? "uploaded" : "sample",
        }),
      });

      if (!extractResponse.ok) {
        throw new Error("Failed to extract text from PDF");
      }

      const { text } = await extractResponse.json();

      // Then generate questions using OpenAI
      const quizResponse = await fetch("/api/generateQuiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, pdfName: selectedPDF }),
      });

      if (!quizResponse.ok) {
        throw new Error("Failed to generate questions");
      }

      const { questions } = await quizResponse.json();
      setQuestions(questions);
      toast.success(
        `Generated ${questions.length} questions from ${selectedPDF}!`
      );
    } catch (error) {
      console.error("Error generating questions:", error);
      toast.error("Failed to generate questions. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const submitQuiz = () => {
    if (questions.length === 0) {
      toast.error("No questions to submit");
      return;
    }

    let correctCount = 0;
    questions.forEach((question) => {
      if (userAnswers[question.id] === question.correctAnswer) {
        correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / questions.length) * 100);
    setScore(calculatedScore);
    setIsSubmitted(true);
    setShowExplanations(true);

    // Extract topics from questions
    const topics = [...new Set(questions.map((q) => q.topic))];

    // Save progress to localStorage
    const quizAttempt = {
      id: Date.now().toString(),
      pdfName: selectedPDF,
      score: calculatedScore,
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      timestamp: new Date().toISOString(),
      topics: topics,
      questions: questions.map((q) => ({
        id: q.id,
        question: q.question,
        userAnswer: userAnswers[q.id],
        correctAnswer: q.correctAnswer,
        topic: q.topic,
        difficulty: q.difficulty,
      })),
    };

    // Get existing progress
    const existingProgress = JSON.parse(
      localStorage.getItem("quizProgress") || "[]"
    );
    existingProgress.push(quizAttempt);
    localStorage.setItem("quizProgress", JSON.stringify(existingProgress));

    toast.success(`Quiz submitted! Score: ${calculatedScore}%`);
  };

  const resetQuiz = () => {
    setQuestions([]);
    setUserAnswers({});
    setIsSubmitted(false);
    setScore(null);
    setShowExplanations(false);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "text-green-600 bg-green-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "hard":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getQuestionTypeLabel = (type) => {
    switch (type) {
      case "mcq":
        return "Multiple Choice";
      case "saq":
        return "Short Answer";
      case "laq":
        return "Long Answer";
      default:
        return type.toUpperCase();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Quiz Generator
            </h2>
            <p className="text-gray-600">
              Generate personalized quizzes from your coursebook content
            </p>
          </div>
          <Brain className="h-12 w-12 text-primary-600" />
        </div>

        {selectedPDF && (
          <div className="mt-4 p-3 bg-primary-50 border border-primary-200 rounded-lg">
            <span className="text-primary-800 font-medium">Source: </span>
            <span className="text-primary-700">{selectedPDF}</span>
          </div>
        )}
      </div>

      {/* Generate Button */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Generate New Quiz
            </h3>
            <p className="text-gray-600">
              Create a new set of questions based on your selected PDF
            </p>
          </div>
          <button
            onClick={generateQuestions}
            disabled={isGenerating || !selectedPDF}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                <span>Generate Quiz</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Questions */}
      {questions.length > 0 && (
        <div className="space-y-6">
          {/* Quiz Header */}
          <div className="card">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Quiz Questions ({questions.length})
              </h3>
              <div className="flex items-center space-x-4">
                {!isSubmitted && (
                  <button onClick={submitQuiz} className="btn-primary">
                    Submit Quiz
                  </button>
                )}
                <button onClick={resetQuiz} className="btn-secondary">
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Score Display */}
          {score !== null && (
            <div className="card">
              <div className="flex items-center justify-center space-x-4">
                <Trophy className="h-8 w-8 text-yellow-500" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">
                    {score}%
                  </div>
                  <div className="text-gray-600">Quiz Score</div>
                </div>
                <div className="text-sm text-gray-500">
                  {Math.round((score / 100) * questions.length)} out of{" "}
                  {questions.length} correct
                </div>
              </div>
            </div>
          )}

          {/* Questions List */}
          {questions.map((question, index) => (
            <div key={question.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="bg-primary-100 text-primary-800 font-semibold px-3 py-1 rounded-full text-sm">
                    Q{index + 1}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                      question.difficulty
                    )}`}
                  >
                    {question.difficulty}
                  </span>
                  <span className="text-sm text-gray-500">
                    {getQuestionTypeLabel(question.type)}
                  </span>
                </div>

                {isSubmitted && (
                  <div className="flex items-center space-x-1">
                    {userAnswers[question.id] === question.correctAnswer ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                )}
              </div>

              <h4 className="text-lg font-medium text-gray-900 mb-4">
                {question.question}
              </h4>

              {/* Answer Options */}
              {question.type === "mcq" && question.options && (
                <div className="space-y-2 mb-4">
                  {question.options.map((option, optionIndex) => (
                    <label
                      key={optionIndex}
                      className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        userAnswers[question.id] === option
                          ? "border-primary-500 bg-primary-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option}
                        checked={userAnswers[question.id] === option}
                        onChange={(e) =>
                          handleAnswerChange(question.id, e.target.value)
                        }
                        disabled={isSubmitted}
                        className="text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-gray-900">{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {(question.type === "saq" || question.type === "laq") && (
                <textarea
                  value={userAnswers[question.id] || ""}
                  onChange={(e) =>
                    handleAnswerChange(question.id, e.target.value)
                  }
                  disabled={isSubmitted}
                  placeholder={`Enter your ${
                    question.type === "saq" ? "short" : "detailed"
                  } answer here...`}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50"
                  rows={question.type === "laq" ? 6 : 3}
                />
              )}

              {/* Explanation */}
              {showExplanations && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h5 className="font-medium text-blue-900 mb-2">
                    Explanation:
                  </h5>
                  <p className="text-blue-800">{question.explanation}</p>
                  <div className="mt-2">
                    <span className="text-sm font-medium text-blue-900">
                      Correct Answer:{" "}
                    </span>
                    <span className="text-sm text-blue-800">
                      {question.correctAnswer}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {questions.length === 0 && !isGenerating && (
        <div className="card text-center py-12">
          <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Questions Generated
          </h3>
          <p className="text-gray-600 mb-4">
            Click "Generate Quiz" to create questions from your selected PDF
          </p>
          {!selectedPDF && (
            <p className="text-sm text-gray-500">
              Make sure to select a PDF first
            </p>
          )}
        </div>
      )}
    </div>
  );
}
