"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, X, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function PDFUpload({
  onUpload,
  uploadedPDFs = [],
  onDeletePDF,
  onResetAll,
}) {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const pdfFiles = acceptedFiles.filter(
        (file) => file.type === "application/pdf"
      );

      if (pdfFiles.length === 0) {
        toast.error("Please upload only PDF files");
        return;
      }

      setIsUploading(true);

      try {
        for (const file of pdfFiles) {
          // Simulate upload process
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // In a real app, you would upload to a server here
          // For now, we'll just add to local state
          setUploadedFiles((prev) => [...prev, file]);
          onUpload(file.name);
          toast.success(`Successfully uploaded ${file.name}`);
        }
      } catch (error) {
        toast.error("Failed to upload files");
      } finally {
        setIsUploading(false);
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: true,
  });

  const removeFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Upload Your Coursebooks
        </h2>
        <p className="text-gray-600">
          Upload PDF files of your textbooks to start your AI-powered learning
          journey
        </p>
      </div>

      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200 ${
          isDragActive
            ? "border-primary-500 bg-primary-50"
            : "border-gray-300 hover:border-primary-400 hover:bg-gray-50"
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        {isDragActive ? (
          <p className="text-primary-600 font-medium">
            Drop the PDF files here...
          </p>
        ) : (
          <div>
            <p className="text-gray-600 mb-2">
              Drag & drop PDF files here, or click to select files
            </p>
            <p className="text-sm text-gray-500">Supports multiple PDF files</p>
          </div>
        )}
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span className="text-blue-800">Uploading files...</span>
          </div>
        </div>
      )}

      {/* Uploaded Files Management */}
      {uploadedPDFs.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Your PDFs ({uploadedPDFs.length})
            </h3>
            <button
              onClick={onResetAll}
              className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              Reset All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uploadedPDFs.map((pdfName, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-sm transition-all duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <FileText className="h-6 w-6 text-red-500 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p
                        className="font-medium text-gray-900 text-sm truncate"
                        title={pdfName}
                      >
                        {pdfName}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Uploaded PDF</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onDeletePDF(pdfName)}
                    className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 ml-2"
                    title="Delete PDF"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-3 flex space-x-2">
                  <button
                    onClick={() => onUpload(pdfName)}
                    className="flex-1 px-3 py-1 text-xs bg-primary-100 text-primary-700 rounded hover:bg-primary-200 transition-colors"
                  >
                    Select
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sample PDFs */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Sample NCERT Physics PDFs
        </h3>
        <p className="text-gray-600 mb-4">
          For testing purposes, you can use these sample NCERT Class XI Physics
          PDFs:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            "Physics Part 1 - Units and Measurements",
            "Physics Part 1 - Motion in a Straight Line",
            "Physics Part 2 - Work, Energy and Power",
          ].map((title, index) => (
            <button
              key={index}
              onClick={() => {
                // Simulate adding sample PDF
                onUpload(title);
                toast.success(`Added ${title}`);
              }}
              className="text-left p-4 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-sm transition-all duration-200"
            >
              <FileText className="h-6 w-6 text-red-500 mb-2" />
              <p className="font-medium text-gray-900 text-sm">{title}</p>
              <p className="text-xs text-gray-500 mt-1">
                {index === 0 && "Fundamental concepts of measurement"}
                {index === 1 && "Rectilinear motion and kinematics"}
                {index === 2 && "Work, energy, and power concepts"}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
