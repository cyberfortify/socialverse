import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosClient";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    
    try {
      await api.post("accounts/login/", form);
      setMsg("Logged in successfully!");
      setTimeout(() => {
        window.location.href = "/feed";
      }, 1000);
    } catch (err) {
      setMsg(err.response?.data?.message || "Sorry, your password was incorrect. Please double-check your password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="max-w-md w-full">
        {/* Main Form Container */}
        <div className="bg-white border border-gray-300 rounded-sm px-8 py-10">
          {/* Instagram-style Logo */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="w-64 h-16 flex items-center justify-center">
                  <span className="text-3xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 bg-clip-text text-transparent">
                    SocialVerse
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={submit} className="space-y-4">
            <div>
              <input
                name="username"
                value={form.username}
                onChange={onChange}
                placeholder="Phone number, username, or email"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-gray-400"
                required
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={onChange}
                placeholder="Password"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-gray-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs font-semibold text-gray-600 hover:text-gray-800"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || !form.username || !form.password}
              className="w-full bg-blue-500 text-white py-1.5 rounded text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors duration-200"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Logging in...
                </div>
              ) : (
                "Log in"
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-300"></div>
              <div className="px-4 text-xs font-semibold text-gray-500">OR</div>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Facebook Login Option */}
            <div className="text-center">
              <button
                type="button"
                className="flex items-center justify-center space-x-2 w-full text-sm font-semibold text-blue-900 hover:text-blue-700"
              >
                <span className="text-blue-600 text-lg">📘</span>
                <span>Log in with Facebook</span>
              </button>
            </div>
          </form>

          {/* Error Message */}
          {msg && (
            <div className="mt-4 p-3 text-center">
              <p className={`text-sm ${
                msg.includes("successfully") ? "text-green-600" : "text-red-600"
              }`}>
                {msg}
              </p>
            </div>
          )}

          {/* Forgot Password */}
          <div className="text-center mt-4">
            <a href="#" className="text-xs text-blue-900 hover:text-blue-700">
              Forgot password?
            </a>
          </div>
        </div>

        {/* Sign Up Redirect */}
        <div className="bg-white border border-gray-300 rounded-sm mt-3 py-5 text-center">
          <p className="text-sm text-gray-900">
            Don't have an account?{" "}
            <Link 
              to="/auth/register" 
              className="text-blue-500 font-semibold hover:text-blue-600"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}