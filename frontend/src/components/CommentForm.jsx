import React, { useState, useRef } from "react";
import api from "../api/axiosClient";

export default function CommentForm({ postId, onCreated }) {
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef(null);

  const submit = async (e) => {
    e?.preventDefault();
    if (!text.trim()) return;
    
    setSubmitting(true);
    setError(null);
    
    try {
      const res = await api.post("comments/", { post: postId, content: text });
      onCreated?.(res.data);
      setText("");
      setIsFocused(false);
    } catch (err) {
      console.error("comment submit error", err);
      const errorMessage = err.response?.data?.content?.[0] || 
                          err.response?.data?.message || 
                          "Failed to post comment. Please try again.";
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const charCount = text.length;
  const maxChars = 500;
  const isNearLimit = charCount > maxChars * 0.9;
  const isOverLimit = charCount > maxChars;

  return (
    <div className="w-full">
      <form onSubmit={submit} className="space-y-3">
        <div className={`relative border-2 rounded-xl transition-all duration-200 ${
          isFocused 
            ? 'border-blue-400 ring-4 ring-blue-100' 
            : 'border-gray-200 hover:border-gray-300'
        }`}>
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            rows={3}
            placeholder="Share your thoughts... (Press Enter to post)"
            className="w-full p-4 resize-none focus:outline-none rounded-xl text-gray-800 placeholder-gray-500 leading-relaxed"
            maxLength={maxChars}
          />
          
          {/* Character Counter */}
          {text.length > 0 && (
            <div className={`absolute bottom-2 right-2 text-xs font-medium px-2 py-1 rounded-full ${
              isOverLimit 
                ? 'bg-red-100 text-red-700' 
                : isNearLimit 
                  ? 'bg-yellow-100 text-yellow-700' 
                  : 'bg-gray-100 text-gray-500'
            }`}>
              {charCount}/{maxChars}
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start space-x-2 text-red-700">
              <span className="text-lg mt-0.5">⚠️</span>
              <div>
                <p className="text-sm font-medium">{error}</p>
                {isOverLimit && (
                  <p className="text-xs mt-1">Please shorten your comment to under {maxChars} characters.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button 
              type="button"
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              title="Add emoji"
              onClick={() => {
                // Emoji picker would be implemented here
                setText(prev => prev + '😊 ');
                textareaRef.current?.focus();
              }}
            >
              <span className="text-lg">😊</span>
            </button>
            <button 
              type="button"
              className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
              title="Add GIF"
            >
              <span className="text-lg">🎬</span>
            </button>
          </div>

          <div className="flex items-center space-x-3">
            {text.trim() && (
              <button
                type="button"
                onClick={() => {
                  setText("");
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
              disabled={submitting || !text.trim() || isOverLimit}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg disabled:cursor-not-allowed"
            >
              {submitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Posting...</span>
                </div>
              ) : (
                "Post Comment"
              )}
            </button>
          </div>
        </div>

        {/* Keyboard Shortcut Hint */}
        <div className="text-center pt-2">
          <p className="text-xs text-gray-500">
            <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs font-mono">Enter</kbd> to post • 
            <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs font-mono ml-2">Shift + Enter</kbd> for new line
          </p>
        </div>
      </form>
    </div>
  );
}