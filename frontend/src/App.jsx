import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom"; // Add Navigate import
import api from "./api/axiosClient";
import Layout from "./components/Layout";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProfilePage from "./pages/ProfilePage";
import Feed from "./pages/Feed";
import Explore from "./pages/Explore";
import Messages from "./pages/Messages";
import Notifications from "./pages/Notifications";

export default function App() {
  const [ping, setPing] = useState(null);
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        // set CSRF cookie
        await api.get("accounts/csrf/");
      } catch (e) {
        // ignore
      }

      try {
        const r = await api.get("accounts/ping/");
        setPing(r.data.ping);
      } catch (err) {
        setPing("error");
      }

      try {
        const res = await api.get("accounts/me/");
        setMe(res.data);
      } catch (err) {
        if (err.response?.status === 401) {
          setMe(null);
        } else {
          console.error("Failed fetching current user:", err);
          setMe(null);
        }
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("accounts/logout/");
      setMe(null);
      window.location.href = "/";
    } catch (err) {
      console.error("logout failed", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading SocialVerse...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Layout user={me} onLogout={handleLogout}>
        <Routes>
          {/* Redirect root path based on auth status */}
          <Route
            path="/"
            element={me ? <Navigate to="/feed" replace /> : <Navigate to="/auth/login" replace />}
          />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/profile" element={<ProfilePage me={me} onLogout={handleLogout} />} />
          <Route path="/profile/:username" element={<ProfilePage me={me} onLogout={handleLogout} />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/notifications" element={<Notifications />} />
        </Routes>
      </Layout>
    </div>
  );
}