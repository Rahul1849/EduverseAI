"use client";

import { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  Target,
  Award,
  Clock,
  BookOpen,
  Brain,
  CheckCircle,
} from "lucide-react";

export default function ProgressDashboard({ selectedPDF }) {
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    averageScore: 0,
    totalQuestions: 0,
    correctAnswers: 0,
    strongTopics: [],
    weakTopics: [],
    studyStreak: 0,
    timeSpent: 0,
  });
  const [recentAttempts, setRecentAttempts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load progress data from localStorage
    const loadProgressData = () => {
      try {
        const progressData = JSON.parse(
          localStorage.getItem("quizProgress") || "[]"
        );

        // Filter by selected PDF if specified
        const filteredData = selectedPDF
          ? progressData.filter((attempt) => attempt.pdfName === selectedPDF)
          : progressData;

        if (filteredData.length === 0) {
          setStats({
            totalQuizzes: 0,
            averageScore: 0,
            totalQuestions: 0,
            correctAnswers: 0,
            strongTopics: [],
            weakTopics: [],
            studyStreak: 0,
            timeSpent: 0,
          });
          setRecentAttempts([]);
          setIsLoading(false);
          return;
        }

        // Calculate stats
        const totalQuizzes = filteredData.length;
        const totalQuestions = filteredData.reduce(
          (sum, attempt) => sum + attempt.totalQuestions,
          0
        );
        const correctAnswers = filteredData.reduce(
          (sum, attempt) => sum + attempt.correctAnswers,
          0
        );
        const averageScore = Math.round(
          filteredData.reduce((sum, attempt) => sum + attempt.score, 0) /
            totalQuizzes
        );

        // Analyze topics
        const topicPerformance = {};
        filteredData.forEach((attempt) => {
          attempt.questions.forEach((q) => {
            if (!topicPerformance[q.topic]) {
              topicPerformance[q.topic] = { correct: 0, total: 0 };
            }
            topicPerformance[q.topic].total++;
            if (q.userAnswer === q.correctAnswer) {
              topicPerformance[q.topic].correct++;
            }
          });
        });

        const strongTopics = [];
        const weakTopics = [];
        Object.entries(topicPerformance).forEach(([topic, perf]) => {
          const accuracy = (perf.correct / perf.total) * 100;
          if (accuracy >= 70) {
            strongTopics.push(topic);
          } else if (accuracy < 50) {
            weakTopics.push(topic);
          }
        });

        setStats({
          totalQuizzes,
          averageScore,
          totalQuestions,
          correctAnswers,
          strongTopics,
          weakTopics,
          studyStreak: calculateStudyStreak(filteredData),
          timeSpent: totalQuizzes * 10, // Estimate 10 minutes per quiz
        });

        // Set recent attempts (last 5)
        setRecentAttempts(filteredData.slice(-5).reverse());
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading progress data:", error);
        setIsLoading(false);
      }
    };

    loadProgressData();
  }, [selectedPDF]);

  const calculateStudyStreak = (attempts) => {
    if (attempts.length === 0) return 0;

    const dates = attempts.map((attempt) =>
      new Date(attempt.timestamp).toDateString()
    );
    const uniqueDates = [...new Set(dates)].sort();

    let streak = 0;
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();

    if (uniqueDates.includes(today) || uniqueDates.includes(yesterday)) {
      streak = 1;
      for (let i = uniqueDates.length - 2; i >= 0; i--) {
        const currentDate = new Date(uniqueDates[i]);
        const nextDate = new Date(uniqueDates[i + 1]);
        const diffDays = (nextDate - currentDate) / (1000 * 60 * 60 * 24);

        if (diffDays <= 1) {
          streak++;
        } else {
          break;
        }
      }
    }

    return streak;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getScoreIcon = (score) => {
    if (score >= 80) return <Award className="h-5 w-5 text-green-600" />;
    if (score >= 60) return <Target className="h-5 w-5 text-yellow-600" />;
    return <TrendingUp className="h-5 w-5 text-red-600" />;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="ml-3 text-gray-600">Loading progress...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-center space-x-3">
          <BarChart3 className="h-8 w-8 text-primary-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Progress Dashboard
            </h2>
            <p className="text-gray-600">
              Track your learning journey and performance
            </p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Quizzes</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalQuizzes}
              </p>
            </div>
            <BookOpen className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Score</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.averageScore}%
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Study Streak</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.studyStreak} days
              </p>
            </div>
            <Clock className="h-8 w-8 text-orange-500" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Time Spent</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.floor(stats.timeSpent / 60)}h {stats.timeSpent % 60}m
              </p>
            </div>
            <Brain className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Performance Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strong Topics */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span>Strong Topics</span>
          </h3>
          <div className="space-y-3">
            {stats.strongTopics.length > 0 ? (
              stats.strongTopics.map((topic, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                >
                  <span className="font-medium text-green-800">{topic}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600">Mastered</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">
                Complete more quizzes to identify strong topics
              </p>
            )}
          </div>
        </div>

        {/* Weak Topics */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Target className="h-5 w-5 text-red-500" />
            <span>Areas for Improvement</span>
          </h3>
          <div className="space-y-3">
            {stats.weakTopics.length > 0 ? (
              stats.weakTopics.map((topic, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg"
                >
                  <span className="font-medium text-red-800">{topic}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-red-600">Needs Practice</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">
                Great job! No weak areas identified yet
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Quiz Attempts */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Quiz Attempts
        </h3>
        {recentAttempts.length > 0 ? (
          <div className="space-y-4">
            {recentAttempts.map((attempt) => (
              <div
                key={attempt.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">
                    {attempt.pdfName}
                  </h4>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-sm text-gray-600">
                      {attempt.correctAnswers}/{attempt.totalQuestions} correct
                    </span>
                    <span className="text-sm text-gray-600">
                      {new Date(attempt.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {(attempt.topics || []).map((topic, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(
                      attempt.score
                    )}`}
                  >
                    {attempt.score}%
                  </div>
                  {getScoreIcon(attempt.score)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>No quiz attempts yet</p>
            <p className="text-sm">
              Start taking quizzes to track your progress
            </p>
          </div>
        )}
      </div>

      {/* Study Recommendations */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Study Recommendations
        </h3>
        <div className="space-y-3">
          {stats.weakTopics.length > 0 ? (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Focus Areas</h4>
              <p className="text-blue-800 text-sm mb-2">
                Based on your performance, consider reviewing these topics:
              </p>
              <ul className="list-disc list-inside text-blue-800 text-sm space-y-1">
                {stats.weakTopics.map((topic, index) => (
                  <li key={index}>{topic}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">Keep It Up!</h4>
            <p className="text-green-800 text-sm">
              You're doing great! Continue practicing with quizzes and maintain
              your {stats.studyStreak}-day streak.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
