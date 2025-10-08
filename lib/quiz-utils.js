// Quiz generation utilities

export const generateQuestions = async (pdfContent, config) => {
  // Mock implementation - in real app would use OpenAI API
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockQuestions = [
        {
          id: "1",
          type: "mcq",
          question: "What is the SI unit of force?",
          options: ["Newton", "Joule", "Watt", "Pascal"],
          correctAnswer: "Newton",
          explanation:
            "Force is measured in Newtons (N) in the SI system, named after Sir Isaac Newton.",
          difficulty: "easy",
          topic: "Forces",
          pageReference: 23,
        },
        {
          id: "2",
          type: "mcq",
          question: "Which of the following is a vector quantity?",
          options: ["Mass", "Speed", "Velocity", "Temperature"],
          correctAnswer: "Velocity",
          explanation:
            "Velocity is a vector quantity because it has both magnitude and direction, unlike speed which only has magnitude.",
          difficulty: "medium",
          topic: "Motion",
          pageReference: 15,
        },
        {
          id: "3",
          type: "saq",
          question: "Explain the difference between speed and velocity.",
          correctAnswer:
            "Speed is a scalar quantity (magnitude only), while velocity is a vector quantity (magnitude and direction).",
          explanation:
            "Speed tells us how fast an object is moving, while velocity tells us both how fast and in which direction.",
          difficulty: "medium",
          topic: "Motion",
          pageReference: 16,
        },
      ];
      resolve(mockQuestions);
    }, 2000);
  });
};

export const calculateScore = (questions, answers) => {
  let correctCount = 0;
  questions.forEach((question) => {
    if (answers[question.id] === question.correctAnswer) {
      correctCount++;
    }
  });
  return Math.round((correctCount / questions.length) * 100);
};

export const getDifficultyColor = (difficulty) => {
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

export const getQuestionTypeLabel = (type) => {
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
