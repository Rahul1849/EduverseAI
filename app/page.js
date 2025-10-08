"use client";

import { useState, useEffect } from "react";
import {
  BookOpen,
  Brain,
  BarChart3,
  MessageSquare,
  Upload,
  FileText,
  Play,
} from "lucide-react";
import SourceSelector from "@/components/SourceSelector";
import PDFViewer from "@/components/PDFViewer";
import QuizGenerator from "@/components/QuizGenerator";
import ProgressDashboard from "@/components/ProgressDashboard";
import PDFUpload from "@/components/PDFUpload";
import ChatInterface from "@/components/ChatInterface";

export default function Home() {
  const [activeTab, setActiveTab] = useState("upload");
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [uploadedPDFs, setUploadedPDFs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load uploaded PDFs from localStorage on component mount
  useEffect(() => {
    const savedPDFs = JSON.parse(localStorage.getItem("uploadedPDFs") || "[]");
    setUploadedPDFs(savedPDFs);
  }, []);

  const tabs = [
    { id: "upload", label: "Upload PDFs", icon: Upload },
    { id: "viewer", label: "PDF Viewer", icon: FileText },
    { id: "quiz", label: "Quiz Generator", icon: Brain },
    { id: "chat", label: "AI Tutor", icon: MessageSquare },
    { id: "progress", label: "Progress", icon: BarChart3 },
  ];

  const handlePDFUpload = (pdfName) => {
    // Check if PDF already exists
    if (!uploadedPDFs.includes(pdfName)) {
      const updatedPDFs = [...uploadedPDFs, pdfName];
      setUploadedPDFs(updatedPDFs);
      // Save to localStorage
      localStorage.setItem("uploadedPDFs", JSON.stringify(updatedPDFs));
    }
    setSelectedPDF(pdfName);
    setActiveTab("viewer");
  };

  const handlePDFDelete = (pdfName) => {
    const updatedPDFs = uploadedPDFs.filter((pdf) => pdf !== pdfName);
    setUploadedPDFs(updatedPDFs);
    // Save to localStorage
    localStorage.setItem("uploadedPDFs", JSON.stringify(updatedPDFs));

    // If deleted PDF was selected, clear selection
    if (selectedPDF === pdfName) {
      setSelectedPDF(null);
    }

    // Also remove progress data for this PDF
    const progressData = JSON.parse(
      localStorage.getItem("quizProgress") || "[]"
    );
    const filteredProgress = progressData.filter(
      (attempt) => attempt.pdfName !== pdfName
    );
    localStorage.setItem("quizProgress", JSON.stringify(filteredProgress));
  };

  const handleResetAll = () => {
    if (
      confirm(
        "Are you sure you want to delete all PDFs and progress? This action cannot be undone."
      )
    ) {
      setUploadedPDFs([]);
      setSelectedPDF(null);
      localStorage.removeItem("uploadedPDFs");
      localStorage.removeItem("quizProgress");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <BookOpen className="h-8 w-8 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900">EduRevise AI</h1>
            </div>
            <div className="text-sm text-gray-500">
              Smart Learning Companion
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto space-x-2 sm:space-x-8 scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-1 sm:space-x-2 py-4 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors duration-200 whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "upload" && (
          <PDFUpload
            onUpload={handlePDFUpload}
            uploadedPDFs={uploadedPDFs}
            onDeletePDF={handlePDFDelete}
            onResetAll={handleResetAll}
          />
        )}

        {activeTab === "viewer" && (
          <div className="space-y-6">
            <SourceSelector
              uploadedPDFs={uploadedPDFs}
              selectedPDF={selectedPDF}
              onSelectPDF={setSelectedPDF}
            />
            {selectedPDF && (
              <PDFViewer pdfName={selectedPDF} uploadedPDFs={uploadedPDFs} />
            )}
          </div>
        )}

        {activeTab === "quiz" && (
          <QuizGenerator
            selectedPDF={selectedPDF}
            uploadedPDFs={uploadedPDFs}
          />
        )}

        {activeTab === "chat" && (
          <ChatInterface
            selectedPDF={selectedPDF}
            uploadedPDFs={uploadedPDFs}
          />
        )}

        {activeTab === "progress" && (
          <ProgressDashboard selectedPDF={selectedPDF} />
        )}
      </main>
    </div>
  );
}
