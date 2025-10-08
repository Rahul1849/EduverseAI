"use client";

import { useState, useEffect } from "react";
import { Play, Clock, Eye, ExternalLink } from "lucide-react";
import { generateYouTubeRecommendations } from "@/lib/api";

export default function YouTubeRecommender({ selectedPDF, currentTopic }) {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(currentTopic || "");

  const topics = [
    "Motion and Forces",
    "Energy and Work",
    "Waves and Oscillations",
    "Thermodynamics",
    "Electromagnetism",
    "Modern Physics",
  ];

  const fetchRecommendations = async (topic) => {
    setIsLoading(true);
    try {
      const videos = await generateYouTubeRecommendations(topic, "medium");
      setRecommendations(videos);
    } catch (error) {
      console.error("Failed to fetch recommendations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedTopic) {
      fetchRecommendations(selectedTopic);
    }
  }, [selectedTopic]);

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
  };

  const formatViews = (views) => {
    const numViews = parseInt(views.replace(/[^\d]/g, ""));
    if (numViews >= 1000000) {
      return `${(numViews / 1000000).toFixed(1)}M views`;
    } else if (numViews >= 1000) {
      return `${(numViews / 1000).toFixed(1)}K views`;
    }
    return `${numViews} views`;
  };

  return (
    <div className="card">
      <div className="flex items-center space-x-3 mb-6">
        <Play className="h-6 w-6 text-red-500" />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Video Recommendations
          </h3>
          <p className="text-sm text-gray-600">
            Educational videos related to your study material
          </p>
        </div>
      </div>

      {/* Topic Selection */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Select Topic</h4>
        <div className="flex flex-wrap gap-2">
          {topics.map((topic) => (
            <button
              key={topic}
              onClick={() => handleTopicSelect(topic)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedTopic === topic
                  ? "bg-red-100 text-red-700 border border-red-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500"></div>
          <span className="ml-3 text-gray-600">Finding relevant videos...</span>
        </div>
      )}

      {/* Video Recommendations */}
      {!isLoading && recommendations.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">
              Recommended Videos for "{selectedTopic}"
            </h4>
            <span className="text-xs text-gray-500">
              {recommendations.length} videos found
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((video, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative">
                  <div className="w-full h-32 bg-gray-200 flex items-center justify-center">
                    <Play className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                </div>

                <div className="p-3">
                  <h5 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                    {video.title}
                  </h5>
                  <p className="text-xs text-gray-600 mb-2">{video.channel}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Eye className="h-3 w-3" />
                        <span>{formatViews(video.views)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{video.duration}</span>
                      </div>
                    </div>

                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-red-600 hover:text-red-700 text-xs font-medium"
                    >
                      <span>Watch</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && recommendations.length === 0 && selectedTopic && (
        <div className="text-center py-8 text-gray-500">
          <Play className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p>No videos found for this topic</p>
          <p className="text-sm">Try selecting a different topic</p>
        </div>
      )}

      {/* Initial State */}
      {!selectedTopic && (
        <div className="text-center py-8 text-gray-500">
          <Play className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p>Select a topic to see video recommendations</p>
          <p className="text-sm">Videos will help reinforce your learning</p>
        </div>
      )}

      {/* PDF Context */}
      {selectedPDF && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Context:</strong> Videos are recommended based on content
            from "{selectedPDF}"
          </p>
        </div>
      )}
    </div>
  );
}
