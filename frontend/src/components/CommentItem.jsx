import React, { useState } from "react";
import api from "../api/axiosClient";

export default function CommentItem({ comment, onDelete }) {
  const [isHovered, setIsHovered] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLiked, setIsLiked] = useState(comment.is_liked || false);
  const [likeCount, setLikeCount] = useState(comment.likes_count || 0);
  const [isLiking, setIsLiking] = useState(false);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = (now - date) / (1000 * 60);
    const diffInHours = diffInMinutes / 60;
    const diffInDays = diffInHours / 24;

    if (diffInMinutes < 1) {
      return "just now";
    } else if (diffInMinutes < 60) {
      return `${Math.floor(diffInMinutes)}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInDays < 7) {
      return `${Math.floor(diffInDays)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleLike = async () => {
    if (!comment?.id) return;
    
    setIsLiking(true);
    const previousIsLiked = isLiked;
    const previousLikeCount = likeCount;
    
    // Optimistic update
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    
    try {
      await api.post(`comments/${comment.id}/like/`);
      // Success - state already updated
    } catch (err) {
      console.error("Like comment error", err);
      // Revert optimistic update on error
      setIsLiked(previousIsLiked);
      setLikeCount(previousLikeCount);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async () => {
    if (!comment?.id || !window.confirm("Are you sure you want to delete this comment?")) return;
    
    setIsDeleting(true);
    try {
      await api.delete(`comments/${comment.id}/`);
      onDelete?.(comment.id);
    } catch (err) {
      console.error("Delete comment error", err);
      alert("Failed to delete comment. Please try again.");
    } finally {
      setIsDeleting(false);
      setShowActions(false);
    }
  };

  const canDelete = comment.can_delete; // This would come from your backend

  return (
    <div 
      className="px-6 py-4 hover:bg-gray-50/50 transition-colors duration-200 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex space-x-3">
        {/* User Avatar */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-sm">
            <span className="text-white font-semibold text-sm">
              {comment.author?.username?.charAt(0)?.toUpperCase() || "U"}
            </span>
          </div>
        </div>

        {/* Comment Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-gray-900 text-sm">
                {comment.author?.username || "Unknown User"}
              </span>
              <span className="text-xs text-gray-500">•</span>
              <span className="text-xs text-gray-500" title={new Date(comment.created_at).toLocaleString()}>
                {formatTime(comment.created_at)}
              </span>
              
              {comment.edited_at && comment.edited_at !== comment.created_at && (
                <>
                  <span className="text-xs text-gray-500">•</span>
                  <span className="text-xs text-gray-500" title={`Edited at ${new Date(comment.edited_at).toLocaleString()}`}>
                    edited
                  </span>
                </>
              )}
            </div>

            {/* Action Menu */}
            <div className="relative">
              <button
                onClick={() => setShowActions(!showActions)}
                className={`p-1 rounded-full transition-colors duration-200 ${
                  isHovered || showActions ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                } hover:bg-gray-200`}
              >
                <span className="text-gray-500 text-lg">⋯</span>
              </button>

              {showActions && (
                <div className="absolute right-0 top-8 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10 min-w-[120px]">
                  {canDelete && (
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 disabled:opacity-50 flex items-center space-x-2"
                    >
                      {isDeleting ? (
                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <span>🗑️</span>
                      )}
                      <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
                    </button>
                  )}
                  <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                    <span>🚫</span>
                    <span>Report</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Comment Text */}
          <div className="mt-1">
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
              {comment.content}
            </p>
          </div>

          {/* Comment Actions */}
          <div className="mt-3 flex items-center space-x-4">
            <button
              onClick={handleLike}
              disabled={isLiking}
              className={`flex items-center space-x-1 px-2 py-1 rounded-full text-sm transition-all duration-200 ${
                isLiked 
                  ? 'text-red-600 bg-red-50' 
                  : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
              }`}
            >
              <span className={isLiking ? 'animate-pulse' : ''}>
                {isLiked ? '❤️' : '🤍'}
              </span>
              {likeCount > 0 && (
                <span className="font-medium">{likeCount}</span>
              )}
            </button>

            <button className="flex items-center space-x-1 px-2 py-1 rounded-full text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200">
              <span>↩️</span>
              <span>Reply</span>
            </button>
          </div>
        </div>
      </div>

      {/* Nested Replies would go here */}
      {/* {comment.replies && comment.replies.length > 0 && (
        <div className="ml-12 mt-3 border-l-2 border-gray-200 pl-4">
          {comment.replies.map(reply => (
            <CommentItem key={reply.id} comment={reply} onDelete={onDelete} />
          ))}
        </div>
      )} */}
    </div>
  );
}