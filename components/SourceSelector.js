"use client";

import { useState } from "react";
import { FileText, ChevronDown } from "lucide-react";

export default function SourceSelector({
  uploadedPDFs,
  selectedPDF,
  onSelectPDF,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (pdfName) => {
    onSelectPDF(pdfName);
    setIsOpen(false);
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Select Source
      </h3>

      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-3 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <FileText className="h-5 w-5 text-gray-500" />
            <span className="text-gray-900">
              {selectedPDF || "Select a PDF to view"}
            </span>
          </div>
          <ChevronDown
            className={`h-5 w-5 text-gray-500 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
            <div className="py-1">
              <button
                onClick={() => handleSelect(null)}
                className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${
                  selectedPDF === null
                    ? "bg-primary-50 text-primary-600"
                    : "text-gray-900"
                }`}
              >
                All Uploaded PDFs
              </button>

              {/* Uploaded PDFs */}
              {uploadedPDFs.length > 0 && (
                <>
                  <div className="px-4 py-2 text-xs font-medium text-gray-500 bg-gray-50">
                    Your PDFs ({uploadedPDFs.length})
                  </div>
                  {uploadedPDFs.map((pdfName, index) => (
                    <button
                      key={`uploaded-${index}`}
                      onClick={() => handleSelect(pdfName)}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${
                        selectedPDF === pdfName
                          ? "bg-primary-50 text-primary-600"
                          : "text-gray-900"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4" />
                        <span className="truncate">{pdfName}</span>
                      </div>
                    </button>
                  ))}
                </>
              )}

              {/* Sample PDFs */}
              <div className="px-4 py-2 text-xs font-medium text-gray-500 bg-gray-50">
                Sample PDFs
              </div>
              {[
                "Physics Part 1 - Units and Measurements",
                "Physics Part 1 - Motion in a Straight Line",
                "Physics Part 2 - Work, Energy and Power",
              ].map((pdfName, index) => (
                <button
                  key={`sample-${index}`}
                  onClick={() => handleSelect(pdfName)}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${
                    selectedPDF === pdfName
                      ? "bg-primary-50 text-primary-600"
                      : "text-gray-900"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span className="truncate">{pdfName}</span>
                  </div>
                </button>
              ))}

              {uploadedPDFs.length === 0 && (
                <div className="px-4 py-2 text-gray-500 text-sm">
                  Upload PDFs to see them here
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {selectedPDF && (
        <div className="mt-4 p-3 bg-primary-50 border border-primary-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4 text-primary-600" />
            <span className="text-primary-800 font-medium">Selected:</span>
            <span className="text-primary-700">{selectedPDF}</span>
          </div>
        </div>
      )}
    </div>
  );
}
