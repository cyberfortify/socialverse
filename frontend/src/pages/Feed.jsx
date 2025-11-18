import React, { useEffect, useState } from "react";
import api from "../api/axiosClient";
import PostCard from "../components/PostCard";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = async (showRefreshing = false) => {
    if (showRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    try {
      const res = await api.get("posts/");
      setPosts(res.data.results ?? res.data);
    } catch (e) {
      console.error("Failed to fetch posts", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const onCreated = (newPost) => {
    setPosts((p) => [newPost, ...p]);
  };

  const onRefresh = () => fetchPosts(true);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">

      {/* Refresh Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Recent Posts</h2>
        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="flex items-center space-x-2 bg-white border border-gray-300 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
        >
          {refreshing ? (
            <>
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span>Refreshing...</span>
            </>
          ) : (
            <>
              <span>🔄</span>
              <span>Refresh</span>
            </>
          )}
        </button>
      </div>

      {/* Posts Feed */}
      {loading ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 animate-pulse">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">📝</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts yet</h3>
          <p className="text-gray-600 mb-6">Be the first to share something with the community!</p>
          <button 
            onClick={() => document.querySelector('textarea')?.focus()}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all duration-200"
          >
            Create First Post
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {refreshing && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-center">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-blue-700 font-medium">Loading new posts...</span>
              </div>
            </div>
          )}
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onAction={onRefresh} />
          ))}
        </div>
      )}
    </div>
  );
}