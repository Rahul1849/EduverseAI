# EduRevise AI - AI-Powered Study Assistant

An intelligent web application that transforms PDF textbooks into an interactive learning experience, combining the power of AI with educational content to help students revise effectively.

## 🚀 Live Demo: https://edu-revise-ai.vercel.app/

The application is currently running at `http://localhost:3000` (when started locally).

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup & Installation](#setup--installation)
- [How to Run](#how-to-run)
- [Project Architecture](#project-architecture)
- [Development Journey](#development-journey)
- [LLM Usage](#llm-usage)
- [What's Done](#whats-done)
- [What's Missing](#whats-missing)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)

## ✨ Features

### Core Features (Must-Have)

- **📄 PDF Upload & Management**: Upload your own PDF coursebooks with drag-and-drop interface
- **👁️ PDF Viewer**: Interactive PDF viewer with page navigation, zoom, and rotation controls
- **🧠 AI Quiz Generator**: Generate MCQs, SAQs, and LAQs from PDF content using OpenAI GPT-4o-mini
- **📊 Progress Tracking**: Track quiz scores, strengths/weaknesses, and learning progress
- **💬 AI Chat Interface**: ChatGPT-inspired chat interface for asking questions about PDF content
- **📚 Sample Content**: Pre-loaded NCERT Class XI Physics PDFs for testing

### Technical Features

- **🔄 Real-time AI Integration**: Live quiz generation and chat responses
- **💾 Local Storage**: Persistent data storage for PDFs, quiz progress, and chat history
- **📱 Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **⚡ Fast Performance**: Optimized React components with proper state management

## 🛠 Tech Stack

### Frontend

- **Next.js 14** - React framework with App Router
- **React 18** - UI library with hooks
- **JavaScript** - Primary programming language
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Framer Motion** - Animation library
- **React Hot Toast** - Notification system

### Backend & AI

- **OpenAI API** - GPT-4o-mini for quiz generation and chat responses
- **Next.js API Routes** - Serverless backend functions
- **pdf-parse** - PDF text extraction (planned)
- **LangChain** - AI workflow management (planned)

### Development Tools

- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 🚀 Setup & Installation

### Prerequisites

- Node.js 18+
- npm or yarn
- OpenAI API key

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd edureviseAI
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏃‍♂️ How to Run

### Development Mode

```bash
npm run dev
```

- Runs on `http://localhost:3000`
- Hot reload enabled
- Development optimizations

### Production Build

```bash
npm run build
npm start
```

- Optimized production build
- Runs on `http://localhost:3000`

### Linting

```bash
npm run lint
```

- Checks code quality
- Fixes auto-fixable issues

## 🏗 Project Architecture

### File Structure

```
edureviseAI/
├── app/
│   ├── api/
│   │   ├── chat/
│   │   ├── extractText/
│   │   └── generateQuiz/
│   ├── globals.css
│   ├── layout.js
│   └── page.js
├── components/
│   ├── ChatInterface.js
│   ├── PDFUpload.js
│   ├── PDFViewer.js
│   ├── ProgressDashboard.js
│   ├── QuizGenerator.js
│   └── SourceSelector.js
├── lib/
│   └── utils.js
├── public/
├── .env.local
├── next.config.js
├── package.json
├── tailwind.config.js
└── README.md
```

### Component Architecture

- **App Router**: Next.js 14 App Router for routing
- **Component-based**: Modular React components
- **State Management**: React hooks (useState, useEffect)
- **API Integration**: Next.js API routes for backend logic
- **Data Persistence**: localStorage for client-side data

### Data Flow

1. **PDF Upload** → localStorage → Component State
2. **Quiz Generation** → OpenAI API → Component State → localStorage
3. **Chat Messages** → OpenAI API → Component State → localStorage
4. **Progress Tracking** → localStorage → Dashboard Display

## 🛣 Development Journey

### Phase 1: Project Initialization

- ✅ Set up Next.js 14 project with TypeScript
- ✅ Configure Tailwind CSS and basic styling
- ✅ Set up project structure and dependencies
- ✅ Convert from TypeScript to JavaScript (user preference)

### Phase 2: Core Components

- ✅ PDF Upload component with drag-and-drop
- ✅ PDF Viewer with mock content system
- ✅ Source Selector for PDF management
- ✅ Quiz Generator with AI integration
- ✅ Progress Dashboard for tracking

### Phase 3: AI Integration

- ✅ OpenAI API integration for quiz generation
- ✅ Chat interface with AI responses
- ✅ Text extraction API (mock implementation)
- ✅ Error handling and loading states

### Phase 4: User Experience

- ✅ Responsive design implementation
- ✅ Local storage for data persistence
- ✅ Toast notifications for user feedback
- ✅ Loading states and error handling

### Phase 5: Testing & Debugging

- ✅ Chat interface message rendering fix
- ✅ State management optimization
- ✅ API response handling
- ✅ Console logging for debugging

## 🤖 LLM Usage

### OpenAI GPT-4o-mini Integration

#### Quiz Generation (`/api/generateQuiz`)

- **Purpose**: Generate educational questions from PDF content
- **Input**: Extracted PDF text, PDF name
- **Output**: Array of questions (MCQ, SAQ, LAQ) with:
  - Question text
  - Multiple choice options (for MCQs)
  - Correct answers
  - Detailed explanations
  - Difficulty levels
  - Topic categorization

#### Chat Interface (`/api/chat`)

- **Purpose**: Provide AI tutoring and Q&A about PDF content
- **Input**: User message, PDF context, PDF content
- **Output**: Contextual AI responses with:
  - Educational explanations
  - Concept clarifications
  - Study guidance
  - PDF-specific information

#### Text Extraction (`/api/extractText`)

- **Purpose**: Extract text content from PDFs for AI processing
- **Current Status**: Mock implementation with contextual content
- **Future**: Real PDF parsing with pdf-parse library

### Development Process with LLMs

- **Code Generation**: Used for component structure and styling
- **API Integration**: Assisted with OpenAI API implementation
- **Error Debugging**: Helped identify and fix state management issues
- **Documentation**: Generated comprehensive README and comments
- **Architecture Design**: Guided component structure and data flow

## ✅ What's Done

### Core Functionality

-  PDF upload and management system
-  Interactive PDF viewer with controls
-  AI-powered quiz generation (MCQ, SAQ, LAQ)
-  ChatGPT-inspired chat interface
-  Progress tracking and analytics
-  Responsive mobile-friendly design
-  Local storage for data persistence
-  Sample NCERT Physics PDFs for testing

### Technical Implementation

-  Next.js 14 with App Router
-  React 18 with hooks
-  Tailwind CSS styling
-  OpenAI API integration
-  Error handling and loading states
-  Toast notifications
-  Component state management
-  API route implementation

### User Experience

-  Drag-and-drop PDF upload
-  Page navigation and zoom controls
-  Real-time quiz generation
-  Interactive chat interface
-  Progress visualization
-  Mobile responsiveness

## ❌ What's Missing

### High Priority

- [ ] **Real PDF Processing**: Replace mock content with actual PDF parsing
- [ ] **Vector Database**: Implement embeddings for better RAG responses
- [ ] **User Authentication**: Add user accounts and data sync
- [ ] **Cloud Storage**: Move from localStorage to cloud database
- [ ] **Advanced Quiz Features**: Timer, hints, adaptive difficulty

### Medium Priority

- [ ] **YouTube Integration**: Video recommendations based on topics
- [ ] **Export Features**: PDF export of quiz results
- [ ] **Offline Support**: Service worker for offline functionality
- [ ] **Analytics**: Detailed learning analytics and insights
- [ ] **Multi-language Support**: Support for different languages

### Low Priority

- [ ] **Social Features**: Share quizzes and progress
- [ ] **Gamification**: Points, badges, leaderboards
- [ ] **Advanced AI Features**: Image analysis, voice input
- [ ] **Integration**: LMS integration, Google Classroom
- [ ] **Mobile App**: React Native or PWA version

## 🔌 API Endpoints

### `/api/chat`

- **Method**: POST
- **Purpose**: Generate AI chat responses
- **Input**: `{ message, pdfName, pdfContent }`
- **Output**: `{ response }`

### `/api/generateQuiz`

- **Method**: POST
- **Purpose**: Generate quiz questions from PDF content
- **Input**: `{ text, pdfName }`
- **Output**: `{ questions: [...] }`

### `/api/extractText`

- **Method**: POST
- **Purpose**: Extract text from PDF (currently mock)
- **Input**: `{ pdfName, pdfFile }`
- **Output**: `{ text }`

## 🤝 Contributing

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Commit with conventional commits: `git commit -m "feat: add amazing feature"`
5. Push to branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Code Style

- Use JavaScript (ES6+)
- Follow React best practices
- Use Tailwind CSS for styling
- Add proper error handling
- Include console logging for debugging

### Commit Convention

We use conventional commits for better tracking:

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- OpenAI for GPT-4o-mini API
- Next.js team for the amazing framework
- Tailwind CSS for the utility-first approach
- React team for the component library
- All open-source contributors

---


