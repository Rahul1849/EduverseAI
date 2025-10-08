import { NextRequest, NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { text, pdfName } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.log("OpenAI API key not found, using contextual mock questions");

      // Generate contextual questions based on PDF name and content
      const generateContextualQuestions = (pdfName, text) => {
        const lowerPdfName = pdfName.toLowerCase();

        // Detect subject/topic from PDF name
        let subject = "General";
        let topicKeywords = [];

        if (
          lowerPdfName.includes("physics") ||
          lowerPdfName.includes("motion") ||
          lowerPdfName.includes("energy")
        ) {
          subject = "Physics";
          topicKeywords = [
            "motion",
            "energy",
            "force",
            "velocity",
            "acceleration",
            "work",
            "power",
          ];
        } else if (
          lowerPdfName.includes("chemistry") ||
          lowerPdfName.includes("molecule") ||
          lowerPdfName.includes("reaction")
        ) {
          subject = "Chemistry";
          topicKeywords = [
            "molecules",
            "reactions",
            "elements",
            "compounds",
            "atoms",
          ];
        } else if (
          lowerPdfName.includes("biology") ||
          lowerPdfName.includes("cell") ||
          lowerPdfName.includes("organism")
        ) {
          subject = "Biology";
          topicKeywords = [
            "cells",
            "organisms",
            "evolution",
            "genetics",
            "ecosystem",
          ];
        } else if (
          lowerPdfName.includes("math") ||
          lowerPdfName.includes("algebra") ||
          lowerPdfName.includes("calculus")
        ) {
          subject = "Mathematics";
          topicKeywords = [
            "equations",
            "functions",
            "calculus",
            "algebra",
            "geometry",
          ];
        } else if (
          lowerPdfName.includes("train") ||
          lowerPdfName.includes("booking") ||
          lowerPdfName.includes("system")
        ) {
          subject = "Computer Science";
          topicKeywords = [
            "booking system",
            "database",
            "user interface",
            "reservation",
            "ticketing",
          ];
        } else if (
          lowerPdfName.includes("history") ||
          lowerPdfName.includes("ancient") ||
          lowerPdfName.includes("war")
        ) {
          subject = "History";
          topicKeywords = [
            "historical events",
            "civilizations",
            "wars",
            "revolutions",
            "timeline",
          ];
        } else if (
          lowerPdfName.includes("literature") ||
          lowerPdfName.includes("novel") ||
          lowerPdfName.includes("poetry")
        ) {
          subject = "Literature";
          topicKeywords = [
            "characters",
            "themes",
            "plot",
            "literary devices",
            "analysis",
          ];
        }

        // Extract some keywords from the text content
        const textKeywords = text
          .toLowerCase()
          .split(/\s+/)
          .filter(
            (word) =>
              word.length > 4 &&
              ![
                "this",
                "that",
                "with",
                "from",
                "they",
                "have",
                "been",
                "were",
                "said",
                "each",
                "which",
                "their",
                "would",
                "there",
                "could",
                "other",
                "after",
                "first",
                "well",
                "also",
                "where",
                "much",
                "some",
                "time",
                "very",
                "when",
                "come",
                "here",
                "just",
                "like",
                "long",
                "make",
                "many",
                "over",
                "such",
                "take",
                "than",
                "them",
                "these",
                "think",
                "want",
                "will",
                "into",
                "more",
                "your",
                "work",
                "know",
                "only",
                "right",
                "should",
                "through",
                "water",
                "about",
                "again",
                "being",
                "before",
                "does",
                "during",
                "every",
                "great",
                "might",
                "never",
                "place",
                "since",
                "still",
                "those",
                "under",
                "while",
                "world",
              ].includes(word)
          )
          .slice(0, 5);

        const allKeywords = [...topicKeywords, ...textKeywords];

        return [
          {
            id: "1",
            type: "mcq",
            question: `What is the primary subject/topic covered in "${pdfName}"?`,
            options: [subject, "General Science", "Mathematics", "Literature"],
            correctAnswer: subject,
            explanation: `The PDF "${pdfName}" primarily covers ${subject} concepts and topics.`,
            difficulty: "easy",
            topic: subject,
          },
          {
            id: "2",
            type: "mcq",
            question: `Which of the following concepts is most likely discussed in "${pdfName}"?`,
            options: [
              allKeywords[0] || "General concepts",
              allKeywords[1] || "Basic principles",
              allKeywords[2] || "Fundamental ideas",
              "Advanced theories",
            ],
            correctAnswer: allKeywords[0] || "General concepts",
            explanation: `The PDF likely discusses ${
              allKeywords[0] || "general concepts"
            } based on its title and content.`,
            difficulty: "medium",
            topic: subject,
          },
          {
            id: "3",
            type: "saq",
            question: `Based on the title "${pdfName}", explain what this document is likely about.`,
            correctAnswer: `This document appears to be about ${pdfName
              .replace(/\.pdf$/i, "")
              .toLowerCase()}, covering related concepts and principles.`,
            explanation: `The document title suggests it covers topics related to ${pdfName
              .replace(/\.pdf$/i, "")
              .toLowerCase()}.`,
            difficulty: "medium",
            topic: subject,
          },
          {
            id: "4",
            type: "laq",
            question: `Describe how the concepts from "${pdfName}" might be applied in real-world scenarios.`,
            correctAnswer: `The concepts from ${pdfName} can be applied in various real-world situations depending on the specific subject matter, such as practical applications, problem-solving, and theoretical understanding.`,
            explanation: `The practical applications would depend on the specific content of ${pdfName}, but generally involve applying theoretical knowledge to solve real problems.`,
            difficulty: "hard",
            topic: subject,
          },
        ];
      };

      const contextualQuestions = generateContextualQuestions(pdfName, text);

      return NextResponse.json({
        questions: contextualQuestions,
      });
    }

    // If OpenAI API key is available, use OpenAI
    const OpenAI = require("openai");
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = `You are an expert physics teacher creating educational quizzes. 
    Based on the following text from "${pdfName}", generate exactly 4 questions:
    
    Text: ${text.substring(0, 2000)} // Limit text to avoid token limits
    
    Generate questions in this exact JSON format:
    {
      "questions": [
        {
          "id": "1",
          "type": "mcq",
          "question": "Question text here",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": "Option A",
          "explanation": "Detailed explanation here",
          "difficulty": "easy|medium|hard",
          "topic": "Topic name"
        },
        {
          "id": "2", 
          "type": "saq",
          "question": "Short answer question here",
          "correctAnswer": "Expected short answer",
          "explanation": "Explanation here",
          "difficulty": "medium",
          "topic": "Topic name"
        },
        {
          "id": "3",
          "type": "laq", 
          "question": "Long answer question here",
          "correctAnswer": "Expected detailed answer",
          "explanation": "Detailed explanation here",
          "difficulty": "hard",
          "topic": "Topic name"
        },
        {
          "id": "4",
          "type": "mcq",
          "question": "Another MCQ question",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": "Option B", 
          "explanation": "Explanation here",
          "difficulty": "medium",
          "topic": "Topic name"
        }
      ]
    }
    
    Make sure questions are directly related to the provided text content.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful physics teacher assistant. Always respond with valid JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const responseText = completion.choices[0].message.content;

    // Try to parse JSON response
    try {
      const questions = JSON.parse(responseText);
      return NextResponse.json(questions);
    } catch (parseError) {
      // If JSON parsing fails, return mock questions
      console.error("Failed to parse OpenAI response:", parseError);
      return NextResponse.json({
        questions: [
          {
            id: "1",
            type: "mcq",
            question: "What is the main topic discussed in this text?",
            options: ["Physics", "Chemistry", "Biology", "Mathematics"],
            correctAnswer: "Physics",
            explanation: "This text discusses physics concepts.",
            difficulty: "easy",
            topic: "General Physics",
          },
        ],
      });
    }
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Failed to generate questions" },
      { status: 500 }
    );
  }
}
