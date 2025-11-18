import React, { useState } from "react";
import api from "../api/axiosClient";
import Comments from "./Comments";

export default function PostCard({ post, onAction }) {
  const [loading, setLoading] = useState(false);
  const [local, setLocal] = useState(post);
  const [showComments, setShowComments] = useState(false);
  const [animateLike, setAnimateLike] = useState(false);

  // Toggle like/unlike
  const toggleLike = async () => {
    if (!post?.id) return;
    setLoading(true);
    setAnimateLike(true);
    
    try {
      const res = await api.post(`posts/${post.id}/like/`);
      setLocal((p) => ({
        ...p,
        likes_count: res.data.likes_count,
        is_liked: res.data.liked,
      }));
      onAction?.();
    } catch (err) {
      console.error("like error", err);
    } finally {
      setLoading(false);
      setTimeout(() => setAnimateLike(false), 600);
    }
  };

  const handleCommentCreatedRemote = () => {
    onAction?.();
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60);
      return `${minutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Post Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {/* Author Avatar */}
            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-md">
              <span className="text-white font-semibold text-sm">
                {local.author?.username?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>
            
            <div>
              <div className="font-semibold text-gray-900">
                {local.author?.username || "Unknown User"}
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>{formatTime(local.created_at)}</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span>🌐 Public</span>
              </div>
            </div>
          </div>
          
          {/* Options Menu */}
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
            <span className="text-gray-400 hover:text-gray-600">⋯</span>
          </button>
        </div>

        {/* Post Content */}
        <div className="mt-4">
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap text-lg">
            {local.content}
          </p>
        </div>
      </div>

      {/* Action Buttons with Integrated Counts */}
      <div className="px-6 py-3 border-t border-gray-100">
        <div className="flex items-center justify-around">
          {/* Like Button with Count */}
          <button
            onClick={toggleLike}
            disabled={loading}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all duration-200 ${
              local.is_liked 
                ? 'text-red-600 bg-red-50' 
                : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
            } ${animateLike ? 'scale-110' : ''}`}
          >
            <div className={`transform transition-all duration-200 ${animateLike ? 'scale-125' : ''}`}>
              {local.is_liked ? '❤️' : '🤍'}
            </div>
            <span className="flex items-center space-x-1">
              <span>{local.is_liked ? 'Liked' : 'Like'}</span>
              {local.likes_count > 0 && (
                <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                  local.is_liked ? 'bg-red-200 text-red-700' : 'bg-gray-200 text-gray-700'
                }`}>
                  {local.likes_count}
                </span>
              )}
            </span>
          </button>

          {/* Comment Button with Count */}
          <button
            onClick={() => setShowComments((s) => !s)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all duration-200 ${
              showComments 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            <span>💬</span>
            <span className="flex items-center space-x-1">
              <span>Comment</span>
              {local.comments_count > 0 && (
                <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                  showComments ? 'bg-blue-200 text-blue-700' : 'bg-gray-200 text-gray-700'
                }`}>
                  {local.comments_count}
                </span>
              )}
            </span>
          </button>

          {/* Share Button */}
          <button className="flex items-center space-x-2 px-4 py-2 rounded-full font-medium text-gray-600 hover:text-green-600 hover:bg-green-50 transition-all duration-200">
            <span>🔄</span>
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-gray-100 bg-gray-50/30">
          <Comments
            postId={local.id}
            initialCount={local.comments_count}
            onClose={() => setShowComments(false)}
            onCommentCreatedRemote={handleCommentCreatedRemote}
          />
        </div>
      )}
    </div>
  );
}