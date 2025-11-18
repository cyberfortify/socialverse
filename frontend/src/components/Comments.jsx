import React, { useEffect, useState } from "react";
import api from "../api/axiosClient";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";

export default function Comments({ postId, onClose, initialCount = 0, onCommentCreatedRemote }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchComments = async (showRefresh = false) => {
    if (showRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    
    try {
      const res = await api.get(`comments/?post=${postId}`);
      setComments(res.data.results ?? res.data);
    } catch (err) {
      console.error("fetch comments error", err);
      setError("Failed to load comments. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (postId) fetchComments();
  }, [postId]);

  const handleCreated = (newComment) => {
    setComments((c) => [newComment, ...c]);
    onCommentCreatedRemote?.();
  };

  const handleCommentDeleted = (commentId) => {
    setComments((c) => c.filter(comment => comment.id !== commentId));
    onCommentCreatedRemote?.();
  };

  return (
    <div className="bg-white border-t border-gray-100">
      {/* Comments Header */}
      <div className="px-6 py-4 bg-gray-50/80 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">💬</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Comments</h3>
              <p className="text-sm text-gray-500">
                {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => fetchComments(true)}
              disabled={refreshing}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors duration-200"
              title="Refresh comments"
            >
              <div className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`}>
                🔄
              </div>
            </button>
            
            {onClose && (
              <button 
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
                title="Close comments"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Comment Form - Fixed at top */}
      <div className="px-6 py-4 border-b border-gray-100 bg-white">
        <CommentForm postId={postId} onCreated={handleCreated} />
      </div>

      {/* Comments List */}
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 px-6">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 font-medium">Loading comments...</p>
            <p className="text-sm text-gray-500 mt-1">Please wait a moment</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <p className="text-red-600 font-medium mb-2">Failed to load comments</p>
            <p className="text-gray-600 text-sm mb-4">{error}</p>
            <button
              onClick={() => fetchComments()}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-200"
            >
              Try Again
            </button>
          </div>
        ) : comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">💬</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">No comments yet</h4>
            <p className="text-gray-600 max-w-sm">
              Be the first to share your thoughts on this post!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {refreshing && (
              <div className="px-6 py-3 bg-blue-50 border-b border-blue-100">
                <div className="flex items-center justify-center space-x-2 text-blue-700 text-sm">
                  <div className="w-4 h-4 border-2 border-blue-700 border-t-transparent rounded-full animate-spin"></div>
                  <span>Loading new comments...</span>
                </div>
              </div>
            )}
            
            {comments.map((comment) => (
              <CommentItem 
                key={comment.id} 
                comment={comment} 
                onDelete={handleCommentDeleted}
              />
            ))}
            
            {/* Loading more indicator */}
            <div className="px-6 py-4 text-center">
              <p className="text-sm text-gray-500">
                You've reached the end of comments
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}