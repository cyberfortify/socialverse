import React, { useState, useRef } from "react";
import api from "../api/axiosClient";

export default function PostCreate({ onCreated }) {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef(null);

  const submit = async (e) => {
    e?.preventDefault();
    if (!content.trim()) return;
    
    setSubmitting(true);
    setError(null);
    
    try {
      const res = await api.post("posts/", { content });
      onCreated?.(res.data);
      setContent("");
      setIsFocused(false);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create post. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      submit();
    }
  };

  const charCount = content.length;
  const maxChars = 280;
  const isNearLimit = charCount > maxChars * 0.8;
  const isOverLimit = charCount > maxChars;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6 hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
          <span className="text-white font-semibold text-sm">+</span>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Create Post</h3>
          <p className="text-sm text-gray-500">Share what's on your mind</p>
        </div>
      </div>

      <form onSubmit={submit}>
        {/* Textarea */}
        <div className={`relative border-2 rounded-xl transition-all duration-200 ${
          isFocused 
            ? 'border-blue-400 ring-4 ring-blue-100' 
            : 'border-gray-200 hover:border-gray-300'
        }`}>
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            rows={4}
            placeholder="What's happening in your world? Share your thoughts..."
            className="w-full p-4 resize-none focus:outline-none rounded-xl text-gray-800 placeholder-gray-500 text-lg leading-relaxed"
            maxLength={maxChars}
          />
          
          {/* Character Counter */}
          <div className={`absolute bottom-3 right-3 text-xs font-medium px-2 py-1 rounded-full ${
            isOverLimit 
              ? 'bg-red-100 text-red-700' 
              : isNearLimit 
                ? 'bg-yellow-100 text-yellow-700' 
                : 'bg-gray-100 text-gray-500'
          }`}>
            {charCount}/{maxChars}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2 text-red-700">
              <span>⚠️</span>
              <span className="text-sm font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Action Bar */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          {/* Add-ons */}
          <div className="flex items-center space-x-2">
            <button 
              type="button"
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              title="Add photo"
            >
              <span className="text-lg">📷</span>
            </button>
            <button 
              type="button"
              className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
              title="Add emoji"
            >
              <span className="text-lg">😊</span>
            </button>
            <button 
              type="button"
              className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
              title="Add location"
            >
              <span className="text-lg">📍</span>
            </button>
          </div>

          {/* Submit Button */}
          <div className="flex items-center space-x-3">
            {content.trim() && (
              <button
                type="button"
                onClick={() => {
                  setContent("");
                  setError(null);
                  setIsFocused(false);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-full hover:bg-gray-100 transition-all duration-200"
                disabled={submitting}
              >
                Clear
              </button>
            )}
            
            <button
              type="submit"
              disabled={submitting || !content.trim() || isOverLimit}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg disabled:cursor-not-allowed"
            >
              {submitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Posting...</span>
                </div>
              ) : (
                "Post"
              )}
            </button>
          </div>
        </div>

        {/* Keyboard Shortcut Hint */}
        <div className="mt-3 text-center">
          <p className="text-xs text-gray-500">
            Pro tip: Press <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Ctrl</kbd> + <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Enter</kbd> to post
          </p>
        </div>
      </form>
    </div>
  );
}