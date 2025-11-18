import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import PostCreate from "./PostCreate"; // Import PostCreate component

export default function Layout({ children, user, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItemClass = (path) => `
    flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200
    ${isActive(path) 
      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
    }
  `;

  const handlePostCreated = (newPost) => {
    setCreateModalOpen(false);
    // You can add additional logic here if needed, like refreshing the feed
    // For example, you might want to dispatch an event or update global state
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white/80 backdrop-blur-sm shadow-lg text-gray-600 hover:text-blue-600 transition-colors duration-200"
      >
        <div className="w-6 h-6 flex flex-col justify-center space-y-1">
          <div className={`h-0.5 bg-current transform transition-all duration-200 ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
          <div className={`h-0.5 bg-current transition-all duration-200 ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></div>
          <div className={`h-0.5 bg-current transform transition-all duration-200 ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
        </div>
      </button>

      {/* Sidebar - Non-scrollable */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-40
        w-64 bg-white/80 backdrop-blur-sm shadow-xl border-r border-white/20
        transform transition-transform duration-300 ease-in-out
        flex flex-col
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${sidebarOpen ? 'md:translate-x-0' : 'md:-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-6 border-b border-gray-200 flex-shrink-0">
            <Link 
              to="/" 
              className="flex items-center space-x-3 group"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SocialVerse
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation - Non-scrollable */}
          <nav className="flex-1 p-6 space-y-2 overflow-hidden">
            {user ? (
              <>
                <Link 
                  to="/feed" 
                  className={navItemClass("/feed")}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="text-lg">🏠</span>
                  <span>Home</span>
                </Link>

                <Link 
                  to="/explore" 
                  className={navItemClass("/explore")}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="text-lg">🔍</span>
                  <span>Explore</span>
                </Link>

                <Link 
                  to="/messages" 
                  className={navItemClass("/messages")}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="text-lg">💬</span>
                  <span>Messages</span>
                </Link>

                <Link 
                  to="/notifications" 
                  className={navItemClass("/notifications")}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="text-lg">🔔</span>
                  <span>Notifications</span>
                </Link>

                <Link 
                  to="/profile" 
                  className={navItemClass("/profile")}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="text-lg">👤</span>
                  <span>Profile</span>
                </Link>

                {/* Create Post Button in Sidebar */}
                <button
                  onClick={() => setCreateModalOpen(true)}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200  hover:shadow-xl"
                >
                  <span className="text-lg">✏️</span>
                  <span>Create Post</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/auth/login" 
                  className={navItemClass("/auth/login")}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="text-lg">🔑</span>
                  <span>Login</span>
                </Link>
                
                <Link 
                  to="/auth/register" 
                  className={navItemClass("/auth/register")}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="text-lg">📝</span>
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </nav>

          {/* User Section - Non-scrollable */}
          {user && (
            <div className="p-6 border-t border-gray-200 flex-shrink-0">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white font-semibold text-sm">
                    {user.username?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{user.username}</p>
                  <p className="text-sm text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
              
              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout();
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-all duration-200"
              >
                <span className="text-lg">🚪</span>
                <span>Logout</span>
              </button>
            </div>
          )}

          {/* Footer - Non-scrollable */}
          <div className="p-6 border-t border-gray-200 flex-shrink-0">
            <div className="text-center">
              <div className="flex justify-center space-x-2 mb-3">
                <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">Django</span>
                <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">React</span>
                <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">Tailwind</span>
              </div>
              <p className="text-xs text-gray-500">
                © {new Date().getFullYear()} SocialVerse
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Create Post Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Create New Post</h2>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>
            <div className="max-h-[calc(90vh-120px)] overflow-y-auto">
              <PostCreate 
                onCreated={handlePostCreated}
                compact={true}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar for Mobile */}
        <header className="md:hidden bg-white/80 backdrop-blur-sm sticky top-0 z-30 shadow-sm border-b border-white/20">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">SV</span>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SocialVerse
              </span>
            </div>
            
            {user && (
              <div className="flex items-center space-x-4">
                {/* Create Post Button in Mobile Top Bar */}
                <button
                  onClick={() => setCreateModalOpen(true)}
                  className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <span className="text-lg">✏️</span>
                </button>

                {/* Messages Icon in Top Bar */}
                <Link 
                  to="/messages" 
                  className={`p-2 rounded-full transition-all duration-200 ${
                    isActive("/messages") 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl">💬</span>
                </Link>
                
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">
                    {user.username?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Main Content Area - Scrollable */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-6">
            {children}
          </div>
        </main>

        {/* Mobile Bottom Navigation - Fixed with Icons Only */}
        {user && (
          <nav className="md:hidden bg-white/90 backdrop-blur-sm fixed bottom-0 left-0 right-0 z-40 shadow-lg border-t border-gray-200">
            <div className="flex items-center justify-around p-2">
              <Link 
                to="/feed" 
                className={`flex flex-col items-center p-3 rounded-xl transition-all duration-200 ${
                  isActive("/feed") 
                    ? 'text-blue-600 bg-blue-50 transform -translate-y-1' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <span className="text-2xl">🏠</span>
              </Link>
              
              <Link 
                to="/explore" 
                className={`flex flex-col items-center p-3 rounded-xl transition-all duration-200 ${
                  isActive("/explore") 
                    ? 'text-blue-600 bg-blue-50 transform -translate-y-1' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <span className="text-2xl">🔍</span>
              </Link>

              {/* Create Post Button in Mobile Bottom Bar */}
              <button
                onClick={() => setCreateModalOpen(true)}
                className={`flex flex-col items-center p-3 rounded-xl transition-all duration-200 ${
                  createModalOpen 
                    ? 'text-green-600 bg-green-50 transform -translate-y-1' 
                    : 'text-gray-600 hover:text-green-600'
                }`}
              >
                <span className="text-2xl">✏️</span>
              </button>
              
              <Link 
                to="/notifications" 
                className={`flex flex-col items-center p-3 rounded-xl transition-all duration-200 ${
                  isActive("/notifications") 
                    ? 'text-blue-600 bg-blue-50 transform -translate-y-1' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <span className="text-2xl">🔔</span>
              </Link>
              
              <Link 
                to="/profile" 
                className={`flex flex-col items-center p-3 rounded-xl transition-all duration-200 ${
                  isActive("/profile") 
                    ? 'text-blue-600 bg-blue-50 transform -translate-y-1' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <span className="text-2xl">👤</span>
              </Link>
            </div>
          </nav>
        )}
      </div>
    </div>
  );
}