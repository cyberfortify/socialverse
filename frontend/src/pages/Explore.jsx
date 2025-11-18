import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosClient";

function UserCard({ user }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
      <div className="text-center">
        {/* User Avatar */}
        <div className="relative inline-block mb-4">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <span className="text-white font-semibold text-xl">
              {user.username?.charAt(0)?.toUpperCase()}
            </span>
          </div>
          {user.online && (
            <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          )}
        </div>

        {/* User Info */}
        <h3 className="font-semibold text-gray-900 text-lg mb-1">{user.username}</h3>
        <p className="text-gray-600 text-sm mb-3">{user.bio || "SocialVerse enthusiast"}</p>

        {/* Stats */}
        <div className="flex justify-center space-x-4 mb-4 text-center">
          <div>
            <div className="font-bold text-gray-900">{user.postsCount}</div>
            <div className="text-xs text-gray-500">Posts</div>
          </div>
          <div>
            <div className="font-bold text-gray-900">{user.followers}</div>
            <div className="text-xs text-gray-500">Followers</div>
          </div>
          <div>
            <div className="font-bold text-gray-900">{user.following}</div>
            <div className="text-xs text-gray-500">Following</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-full font-semibold text-sm hover:shadow-lg transition-all duration-200">
            Follow
          </button>
          <Link 
            to={`/profile/${user.username}`}
            className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-full font-semibold text-sm text-center hover:bg-gray-50 transition-all duration-200"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}

function PostCard({ post }) {
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
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {post.author?.username?.charAt(0)?.toUpperCase()}
            </span>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-sm">{post.author?.username}</h4>
            <p className="text-xs text-gray-500">{formatTime(post.created_at)}</p>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="p-4">
        <p className="text-gray-800 leading-relaxed">{post.content}</p>
      </div>

      {/* Engagement Stats */}
      <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>❤️ {post.likes_count} likes</span>
            <span>💬 {post.comments_count} comments</span>
          </div>
          <Link 
            to={`/post/${post.id}`}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View Post
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Explore() {
  const [activeTab, setActiveTab] = useState('trending'); // trending, people, posts
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchExploreData = async () => {
    setLoading(true);
    try {
      // Mock data for trending posts
      const mockPosts = [
        {
          id: 1,
          content: "Just discovered this amazing platform! The community here is so supportive and engaging. Can't wait to share more content with everyone! 🚀",
          author: { username: "traveler_jane" },
          likes_count: 142,
          comments_count: 23,
          created_at: new Date(Date.now() - 2 * 3600000).toISOString()
        },
        {
          id: 2,
          content: "The sunset views from the mountains today were absolutely breathtaking. Nature never fails to amaze me! 🌄 #NatureLover #Photography",
          author: { username: "mountain_explorer" },
          likes_count: 89,
          comments_count: 12,
          created_at: new Date(Date.now() - 5 * 3600000).toISOString()
        },
        {
          id: 3,
          content: "Working on some exciting new projects using React and Django. The developer community here is amazing! 💻 #WebDevelopment #Programming",
          author: { username: "code_wizard" },
          likes_count: 67,
          comments_count: 8,
          created_at: new Date(Date.now() - 8 * 3600000).toISOString()
        }
      ];

      // Mock data for suggested users
      const mockUsers = [
        {
          id: 1,
          username: "creative_soul",
          bio: "Artist & Designer | Sharing daily creativity",
          postsCount: 45,
          followers: 1234,
          following: 567,
          online: true
        },
        {
          id: 2,
          username: "tech_guru",
          bio: "Tech enthusiast | AI & Machine Learning",
          postsCount: 89,
          followers: 4567,
          following: 234,
          online: false
        },
        {
          id: 3,
          username: "foodie_adventures",
          bio: "Food blogger | Restaurant reviews & recipes",
          postsCount: 156,
          followers: 8912,
          following: 345,
          online: true
        },
        {
          id: 4,
          username: "fitness_enthusiast",
          bio: "Personal trainer | Fitness tips & motivation",
          postsCount: 78,
          followers: 2345,
          following: 678,
          online: false
        },
        {
          id: 5,
          username: "book_lover",
          bio: "Bibliophile | Book reviews & recommendations",
          postsCount: 34,
          followers: 1234,
          following: 456,
          online: true
        },
        {
          id: 6,
          username: "travel_diaries",
          bio: "Travel blogger | Exploring the world one city at a time",
          postsCount: 167,
          followers: 5678,
          following: 789,
          online: false
        }
      ];

      setTrendingPosts(mockPosts);
      setSuggestedUsers(mockUsers);
    } catch (err) {
      console.error("Explore data fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExploreData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore</h1>
        <p className="text-gray-600">Discover amazing content and connect with new people</p>

        {/* Tabs */}
        <div className="flex space-x-6 mt-6 border-b border-gray-200">
          {['trending', 'people', 'posts'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-1 font-semibold text-sm border-b-2 transition-colors duration-200 ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'trending' && '🔥 Trending'}
              {tab === 'people' && '👥 People'}
              {tab === 'posts' && '📝 Posts'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 font-medium">Loading explore content...</p>
          </div>
        </div>
      ) : (
        <div>
          {/* Trending Posts */}
          {activeTab === 'trending' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Trending Now</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trendingPosts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          )}

          {/* People */}
          {activeTab === 'people' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">People You May Know</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {suggestedUsers.map(user => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            </div>
          )}

          {/* All Posts */}
          {activeTab === 'posts' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Posts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {trendingPosts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}