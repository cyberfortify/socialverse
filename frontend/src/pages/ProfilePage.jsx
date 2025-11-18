import React, { useEffect, useState } from "react";
import api from "../api/axiosClient";
import { useParams, Link } from "react-router-dom";

export default function ProfilePage({ me, onLogout }) {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const isOwnProfile = !username || (me && me.username === username);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const url = username ? `accounts/profile/${username}/` : `accounts/profile/`;
        const res = await api.get(url);
        setProfile(res.data);
      } catch (err) {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [username]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-48 bg-gray-200 rounded-t-2xl"></div>
          <div className="bg-white p-6 rounded-b-2xl shadow-lg">
            <div className="flex flex-col md:flex-row items-center md:items-end -mt-20">
              <div className="w-32 h-32 bg-gray-200 rounded-full border-4 border-white shadow-lg"></div>
              <div className="md:ml-6 mt-4 md:mt-0 flex-1">
                <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">😕</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-6">The user you're looking for doesn't exist or may have been removed.</p>
          <Link 
            to="/" 
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all duration-200"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Profile Content - 3 columns */}
        <div className="lg:col-span-3">
          {/* Cover Photo */}
          <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500 rounded-t-2xl relative"></div>
          
          {/* Profile Card */}
          <div className="bg-white rounded-b-2xl shadow-lg border border-gray-100 -mt-1">
            <div className="p-6">
              <div className="flex flex-col md:flex-row items-center md:items-end -mt-20">
                {/* Avatar */}
                <div className="relative">
                  {profile.avatar ? (
                    <img 
                      src={profile.avatar} 
                      alt="avatar" 
                      className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">
                        {profile.user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  {isOwnProfile && (
                    <button className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow duration-200">
                      <span className="w-4 h-4">✏️</span>
                    </button>
                  )}
                </div>

                {/* Profile Info */}
                <div className="md:ml-6 mt-4 md:mt-0 flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">{profile.user.username}</h1>
                      <p className="text-gray-600 mt-1">Member since {new Date(profile.user.date_joined).getFullYear()}</p>
                    </div>
                    {isOwnProfile && (
                      <button className="mt-4 md:mt-0 border border-gray-300 text-gray-700 px-6 py-2 rounded-full font-semibold hover:bg-gray-50 transition-all duration-200">
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Bio Section */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  {profile.bio ? (
                    <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
                  ) : (
                    <p className="text-gray-500 italic">
                      {isOwnProfile ? "Add a bio to tell people about yourself..." : "This user hasn't added a bio yet."}
                    </p>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">0</div>
                  <div className="text-sm text-gray-600">Posts</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">0</div>
                  <div className="text-sm text-gray-600">Followers</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">0</div>
                  <div className="text-sm text-gray-600">Following</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Section Sidebar - 1 column */}
        {isOwnProfile && me && (
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white font-semibold text-sm">
                    {me.username?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{me.username}</p>
                  <p className="text-sm text-gray-500 truncate">{me.email}</p>
                </div>
              </div>
              
              <button 
                onClick={() => {
                  onLogout();
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-all duration-200"
              >
                <span className="text-lg">🚪</span>
                <span>Logout</span>
              </button>

              {/* Additional Quick Actions */}
              <div className="mt-6 space-y-3">
                <h4 className="font-semibold text-gray-900 text-sm mb-2">Quick Actions</h4>
                
                <button className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-all duration-200 text-sm">
                  <span className="text-lg">⚙️</span>
                  <span>Settings</span>
                </button>

                <button className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-all duration-200 text-sm">
                  <span className="text-lg">🛡️</span>
                  <span>Privacy</span>
                </button>

                <button className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-all duration-200 text-sm">
                  <span className="text-lg">❓</span>
                  <span>Help & Support</span>
                </button>
              </div>

              {/* Account Status */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2 text-blue-700">
                  <span className="text-lg">✅</span>
                  <div>
                    <p className="font-semibold text-sm">Account Active</p>
                    <p className="text-xs">Your account is in good standing</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Viewing other user's profile - Show different sidebar */}
        {!isOwnProfile && profile && (
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-md mx-auto mb-4">
                  <span className="text-white font-semibold text-lg">
                    {profile.user.username?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900">{profile.user.username}</h3>
                <p className="text-sm text-gray-500 mt-1">SocialVerse User</p>
              </div>

              {/* Action Buttons for other users */}
              <div className="mt-6 space-y-3">
                <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-200">
                  Follow
                </button>
                
                <button className="w-full flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200">
                  <span>💬</span>
                  <span>Message</span>
                </button>

                <button className="w-full flex items-center justify-center space-x-2 text-gray-600 py-2 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200">
                  <span>📧</span>
                  <span>Share Profile</span>
                </button>
              </div>

              {/* Mutual Connections */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 text-gray-700">
                  <span className="text-lg">👥</span>
                  <div>
                    <p className="font-semibold text-sm">0 mutual friends</p>
                    <p className="text-xs">You don't have mutual connections yet</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}