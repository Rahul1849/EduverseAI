"use client";

import { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  Send,
  Plus,
  MoreVertical,
  Bot,
  User,
  Trash2,
  Edit3,
} from "lucide-react";
import toast from "react-hot-toast";

export default function ChatInterface({ selectedPDF, uploadedPDFs = [] }) {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const messagesEndRef = useRef(null);

  // Load chats from localStorage on component mount
  useEffect(() => {
    const savedChats = JSON.parse(localStorage.getItem("chatHistory") || "[]");
    setChats(savedChats);
    if (savedChats.length > 0 && !activeChatId) {
      setActiveChatId(savedChats[0].id);
    }
  }, []);

  // Load messages for active chat
  useEffect(() => {
    console.log(
      "useEffect triggered - activeChatId:",
      activeChatId,
      "chats:",
      chats
    );
    if (activeChatId) {
      const chat = chats.find((c) => c.id === activeChatId);
      console.log("Found chat:", chat);
      if (chat && chat.messages.length > 0) {
        console.log("Setting messages to:", chat.messages);
        setMessages(chat.messages);
      } else if (!chat) {
        console.log("No chat found, setting empty messages");
        setMessages([]);
      }
      // Don't reset messages if chat exists but has no messages yet
    } else {
      console.log("No activeChatId, setting empty messages");
      setMessages([]);
    }
  }, [activeChatId]); // Remove chats from dependency to prevent reset

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const createNewChat = () => {
    const newChat = {
      id: Date.now().toString(),
      title: "New Chat",
      pdfName: selectedPDF || "General",
      createdAt: new Date().toISOString(),
      messages: [],
    };

    const updatedChats = [newChat, ...chats];
    setChats(updatedChats);
    setActiveChatId(newChat.id);
    setMessages([]);

    // Save to localStorage
    localStorage.setItem("chatHistory", JSON.stringify(updatedChats));

    toast.success("New chat created!");
  };

  const deleteChat = (chatId) => {
    if (confirm("Are you sure you want to delete this chat?")) {
      const updatedChats = chats.filter((chat) => chat.id !== chatId);
      setChats(updatedChats);

      if (activeChatId === chatId) {
        if (updatedChats.length > 0) {
          setActiveChatId(updatedChats[0].id);
        } else {
          setActiveChatId(null);
          setMessages([]);
        }
      }

      // Save to localStorage
      localStorage.setItem("chatHistory", JSON.stringify(updatedChats));

      toast.success("Chat deleted!");
    }
  };

  const updateChatTitle = (chatId, newTitle) => {
    const updatedChats = chats.map((chat) =>
      chat.id === chatId ? { ...chat, title: newTitle } : chat
    );
    setChats(updatedChats);
    localStorage.setItem("chatHistory", JSON.stringify(updatedChats));
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    // Add user message immediately
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputMessage("");
    setIsLoading(true);

    // Update chat with user message
    const updatedChats = chats.map((chat) =>
      chat.id === activeChatId
        ? {
            ...chat,
            messages: [...chat.messages, userMessage],
            title:
              chat.title === "New Chat"
                ? inputMessage.slice(0, 30) + "..."
                : chat.title,
          }
        : chat
    );
    setChats(updatedChats);

    try {
      // Generate AI response
      const aiResponse = await generateAIResponse(inputMessage, selectedPDF);

      console.log("AI Response received:", aiResponse);

      const botMessage = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: "bot",
        timestamp: new Date().toISOString(),
      };

      console.log("Bot message created:", botMessage);

      // Add bot message
      const finalMessages = [...updatedMessages, botMessage];
      console.log("Final messages:", finalMessages);
      setMessages(finalMessages);

      // Update chat with bot message
      const finalChats = chats.map((chat) =>
        chat.id === activeChatId
          ? { ...chat, messages: [...chat.messages, userMessage, botMessage] }
          : chat
      );
      setChats(finalChats);

      // Save to localStorage
      localStorage.setItem("chatHistory", JSON.stringify(finalChats));
    } catch (error) {
      console.error("Error generating response:", error);
      toast.error("Failed to get response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIResponse = async (message, pdfName) => {
    try {
      // Get PDF content for context
      let pdfContent = "";
      if (pdfName) {
        try {
          const extractResponse = await fetch("/api/extractText", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              pdfName: pdfName,
              pdfFile: uploadedPDFs.includes(pdfName) ? "uploaded" : "sample",
            }),
          });

          if (extractResponse.ok) {
            const { text } = await extractResponse.json();
            pdfContent = text;
          }
        } catch (error) {
          console.log("Could not extract PDF content:", error);
        }
      }

      // Call the chat API
      console.log("Calling chat API with:", { message, pdfName, pdfContent });

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message,
          pdfName: pdfName,
          pdfContent: pdfContent,
        }),
      });

      console.log("API response status:", response.status);
      console.log("API response ok:", response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error response:", errorText);
        throw new Error(`API error: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("API response data:", responseData);
      console.log("Response type:", typeof responseData);
      console.log("Response keys:", Object.keys(responseData));

      const { response: aiResponse } = responseData;
      console.log("AI Response:", aiResponse);
      console.log("AI Response type:", typeof aiResponse);

      return aiResponse;
    } catch (error) {
      console.error("Error generating AI response:", error);

      // Fallback to a simple response
      return `I apologize, but I'm having trouble generating a response right now. Please try again in a moment.

In the meantime, you can:
• Try rephrasing your question
• Ask about a specific concept from your PDF
• Request examples or explanations

I'm here to help with your studies!`;
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex h-[calc(100vh-200px)] bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Left Drawer - Chat List */}
      <div
        className={`${
          isDrawerOpen ? "w-80" : "w-0"
        } transition-all duration-300 border-r border-gray-200 bg-gray-50 flex flex-col`}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Chats</h2>
            <button
              onClick={createNewChat}
              className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              title="New Chat"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {selectedPDF && (
            <div className="text-sm text-gray-600 bg-primary-50 p-2 rounded-lg">
              <strong>Context:</strong> {selectedPDF}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {chats.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>No chats yet</p>
              <p className="text-sm">Start a new conversation!</p>
            </div>
          ) : (
            <div className="p-2">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 group ${
                    activeChatId === chat.id
                      ? "bg-primary-100 border border-primary-200"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveChatId(chat.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {chat.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {chat.pdfName}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(chat.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteChat(chat.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MessageSquare className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                {activeChatId
                  ? chats.find((c) => c.id === activeChatId)?.title || "Chat"
                  : "AI Study Companion"}
              </h1>
              <p className="text-sm text-gray-500">
                {selectedPDF ? `Context: ${selectedPDF}` : "Ask me anything!"}
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {console.log("Rendering messages:", messages)}
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Bot className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Welcome to your AI Study Companion!
                </h3>
                <p className="text-gray-500 mb-4">
                  I'm here to help you understand concepts from your PDFs and
                  answer any questions.
                </p>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    💡 Try asking: "Explain the main concepts from this PDF"
                  </p>
                  <p>📚 Or: "Help me understand [specific topic]"</p>
                  <p>🎯 Or: "Give me examples of [concept]"</p>
                </div>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === "user"
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.sender === "bot" && (
                      <Bot className="h-4 w-4 mt-1 text-gray-500 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                    {message.sender === "user" && (
                      <User className="h-4 w-4 mt-1 text-white flex-shrink-0" />
                    )}
                  </div>
                </div>
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Bot className="h-4 w-4 text-gray-500" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about your studies..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={1}
                style={{ minHeight: "44px", maxHeight: "120px" }}
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="p-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
