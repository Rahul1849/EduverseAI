"use client";

import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
  FileText,
} from "lucide-react";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export default function PDFViewer({ pdfName, uploadedPDFs = [] }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock PDF content based on PDF name
  const getMockContent = (pdfName) => {
    // Check if this is an uploaded file
    const isUploadedFile = uploadedPDFs.includes(pdfName);

    if (isUploadedFile) {
      const lowerPdfName = pdfName.toLowerCase();

      if (
        lowerPdfName.includes("train") ||
        lowerPdfName.includes("booking") ||
        lowerPdfName.includes("system")
      ) {
        return {
          title: "Train Seat Booking System",
          pages: [
            `Train Seat Booking System Documentation\n\nPage 1: System Overview\n\nThis document covers the design and implementation of a comprehensive train seat booking system.\n\nKey Components:\n• User Authentication and Management\n• Train Schedule and Route Management\n• Seat Availability and Reservation System\n• Payment Processing and Ticket Generation\n• Admin Panel for System Management\n\nSystem Architecture:\nThe system follows a three-tier architecture with frontend, backend, and database layers.`,
            `Page 2: Database Design\n\nDatabase Schema:\n• Users Table: Stores user information and authentication data\n• Trains Table: Contains train details, schedules, and routes\n• Seats Table: Manages seat availability and reservations\n• Bookings Table: Tracks reservation details and payment status\n• Payments Table: Records transaction information\n\nKey Relationships:\n• One-to-many relationship between trains and seats\n• Many-to-many relationship between users and bookings\n• Foreign key constraints ensure data integrity`,
            `Page 3: Technical Implementation\n\nFrontend Technologies:\n• React.js for user interface\n• Bootstrap for responsive design\n• JavaScript for client-side logic\n\nBackend Technologies:\n• Node.js with Express framework\n• RESTful API design\n• JWT for authentication\n• Bcrypt for password hashing\n\nDatabase:\n• MySQL for data persistence\n• Connection pooling for performance\n• Indexed queries for fast retrieval\n\nSecurity Features:\n• Input validation and sanitization\n• SQL injection prevention\n• XSS protection\n• Rate limiting for API endpoints`,
          ],
        };
      } else if (
        lowerPdfName.includes("physics") ||
        lowerPdfName.includes("motion") ||
        lowerPdfName.includes("energy")
      ) {
        return {
          title: "Physics Concepts",
          pages: [
            `Physics Fundamentals\n\nPage 1: Mechanics\n\nMotion in One Dimension:\n• Position, displacement, velocity, and acceleration\n• Equations of motion for constant acceleration\n• Graphical analysis of motion\n\nMotion in Two Dimensions:\n• Projectile motion\n• Circular motion\n• Relative motion\n\nNewton's Laws:\n• First Law: Law of Inertia\n• Second Law: F = ma\n• Third Law: Action-Reaction pairs`,
            `Page 2: Energy and Work\n\nWork and Energy:\n• Work done by constant and variable forces\n• Kinetic energy and work-energy theorem\n• Potential energy (gravitational and elastic)\n• Conservation of mechanical energy\n\nPower:\n• Average and instantaneous power\n• Power in rotational motion\n• Efficiency calculations\n\nMomentum:\n• Linear momentum and impulse\n• Conservation of momentum\n• Collisions (elastic and inelastic)`,
            `Page 3: Advanced Topics\n\nThermodynamics:\n• Heat, temperature, and thermal expansion\n• Laws of thermodynamics\n• Heat engines and refrigerators\n\nElectromagnetism:\n• Electric fields and forces\n• Magnetic fields and forces\n• Electromagnetic induction\n• AC and DC circuits\n\nModern Physics:\n• Quantum mechanics basics\n• Relativity theory\n• Nuclear physics fundamentals`,
          ],
        };
      } else {
        return {
          title: pdfName.replace(/\.pdf$/i, ""),
          pages: [
            `${pdfName.replace(
              /\.pdf$/i,
              ""
            )}\n\nPage 1: Introduction\n\nThis document covers comprehensive information about ${pdfName
              .replace(/\.pdf$/i, "")
              .replace(/[🚀📄📋]/g, "")
              .trim()}.\n\nOverview:\n• Fundamental concepts and principles\n• Theoretical foundations\n• Practical applications\n• Implementation strategies\n\nKey Topics:\n• Core concepts and definitions\n• Problem-solving methodologies\n• Case studies and examples\n• Best practices and guidelines`,
            `Page 2: Detailed Analysis\n\nAdvanced Concepts:\n• In-depth exploration of key topics\n• Mathematical formulations and derivations\n• Theoretical frameworks\n• Practical implementations\n\nApplications:\n• Real-world use cases\n• Industry applications\n• Problem-solving scenarios\n• Performance considerations\n\nMethodologies:\n• Systematic approaches\n• Step-by-step procedures\n• Quality assurance measures\n• Optimization techniques`,
            `Page 3: Implementation and Results\n\nImplementation Details:\n• Technical specifications\n• System requirements\n• Configuration parameters\n• Integration guidelines\n\nResults and Analysis:\n• Performance metrics\n• Comparative analysis\n• Success factors\n• Lessons learned\n\nFuture Directions:\n• Potential improvements\n• Emerging trends\n• Research opportunities\n• Development roadmap`,
          ],
        };
      }
    }

    const content = {
      "Physics Part 1 - Units and Measurements": {
        title: "Units and Measurements",
        pages: [
          "Chapter 1: Physical Quantities and Units\n\nPhysics is the natural science that studies matter, its motion and behavior through space and time.\n\nUnits and measurements are fundamental concepts in physics. The International System of Units (SI) provides standardized units for measuring physical quantities.\n\nFundamental quantities include:\n• Length (meter)\n• Mass (kilogram)\n• Time (second)\n• Electric current (ampere)",
          "Measurement and Precision\n\nMeasurements involve precision and accuracy. Precision refers to the closeness of measurements to each other, while accuracy refers to the closeness of a measurement to the true value.\n\nSignificant figures are important in scientific measurements. They indicate the precision of a measurement.\n\nExample: If a measurement is recorded as 2.35 cm, it has three significant figures.",
          "Error Analysis\n\nEvery measurement has some uncertainty associated with it. This uncertainty is called measurement error.\n\nTypes of errors:\n• Systematic errors\n• Random errors\n• Gross errors\n\nError propagation must be considered when combining measurements.",
        ],
      },
      "Physics Part 1 - Motion in a Straight Line": {
        title: "Motion in a Straight Line",
        pages: [
          "Chapter 2: Motion in a Straight Line\n\nMotion in a straight line is one of the fundamental concepts in mechanics. When a body moves along a straight line, it is said to be in rectilinear motion.\n\nThe position of an object is described by its distance from a reference point.\n\nDisplacement vs Distance:\n• Displacement is the change in position\n• Distance is the total path length",
          "Velocity and Speed\n\nVelocity is the rate of change of displacement with respect to time. It is a vector quantity.\n\nSpeed is the magnitude of velocity and is a scalar quantity.\n\nAverage velocity = Total displacement / Total time\nAverage speed = Total distance / Total time",
          "Acceleration\n\nAcceleration is the rate of change of velocity.\n\nUniform acceleration occurs when the velocity changes by equal amounts in equal intervals of time.\n\nEquations of motion:\n• v = u + at\n• s = ut + ½at²\n• v² = u² + 2as",
        ],
      },
      "Physics Part 2 - Work, Energy and Power": {
        title: "Work, Energy and Power",
        pages: [
          "Chapter 3: Work, Energy and Power\n\nWork, energy, and power are fundamental concepts in physics.\n\nWork is done when a force causes displacement.\n\nWork = Force × Displacement × cos(θ)\n\nWhere θ is the angle between force and displacement vectors.\n\nWork is a scalar quantity measured in joules (J).",
          "Energy\n\nEnergy is the capacity to do work.\n\nTypes of energy:\n• Kinetic energy: KE = ½mv²\n• Potential energy: PE = mgh\n• Mechanical energy = KE + PE\n\nConservation of energy: Energy cannot be created or destroyed, only transformed.",
          "Power\n\nPower is the rate of doing work.\n\nPower = Work / Time\n\nUnit of power is watt (W), which equals one joule per second.\n\nPower is also related to force and velocity:\nPower = Force × Velocity",
        ],
      },
    };

    return (
      content[pdfName] || {
        title: pdfName,
        pages: [
          `Content for ${pdfName}\n\nThis is a demo PDF viewer showing content based on the selected PDF.\n\nIn a real implementation, this would display the actual PDF content from the uploaded file.\n\nYou can proceed with quiz generation and other features using this content.`,
        ],
      }
    );
  };

  useEffect(() => {
    if (pdfName) {
      setIsLoading(true);
      setError(null);
      // Simulate PDF loading
      setTimeout(() => {
        const content = getMockContent(pdfName);
        setNumPages(content.pages.length);
        setIsLoading(false);
      }, 1000);
    }
  }, [pdfName]);

  const goToPrevPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages || 1));
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 3.0));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.5));
  };

  const rotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">PDF Viewer</h3>
        <div className="text-sm text-gray-500">{pdfName}</div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2">
          <button
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
            className="p-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <span className="text-sm font-medium text-gray-700">
            Page {pageNumber} of {numPages || "?"}
          </span>

          <button
            onClick={goToNextPage}
            disabled={pageNumber >= (numPages || 1)}
            className="p-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={zoomOut}
            className="p-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50"
          >
            <ZoomOut className="h-4 w-4" />
          </button>

          <span className="text-sm font-medium text-gray-700 min-w-[3rem] text-center">
            {Math.round(scale * 100)}%
          </span>

          <button
            onClick={zoomIn}
            className="p-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50"
          >
            <ZoomIn className="h-4 w-4" />
          </button>

          <button
            onClick={rotate}
            className="p-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50"
          >
            <RotateCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* PDF Display */}
      <div className="flex justify-center bg-gray-100 rounded-lg p-4 min-h-[600px]">
        {isLoading && (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="ml-3 text-gray-600">Loading PDF...</span>
          </div>
        )}

        {!isLoading && pdfName && (
          <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl w-full">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {getMockContent(pdfName).title}
              </h2>
              <div className="text-sm text-gray-600">
                Page {pageNumber} of {numPages}
              </div>
            </div>

            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed">
                {getMockContent(pdfName).pages[pageNumber - 1]}
              </pre>
            </div>
          </div>
        )}

        {!pdfName && !isLoading && (
          <div className="flex items-center justify-center">
            <div className="text-center">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Select a PDF to view</p>
            </div>
          </div>
        )}
      </div>

      {/* Page Navigation */}
      {numPages && numPages > 1 && (
        <div className="mt-4 flex justify-center">
          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(numPages, 10) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPageNumber(pageNum)}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    pageNumber === pageNum
                      ? "bg-primary-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            {numPages > 10 && (
              <span className="text-gray-500 text-sm">...</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
