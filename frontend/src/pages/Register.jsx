import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosClient";

export default function Register() {
  const [form, setForm] = useState({ 
    email: "", 
    username: "", 
    password: "", 
    password2: "" 
  });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1); // For multi-step registration

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    
    if (form.password !== form.password2) {
      setMsg("Passwords don't match. Please try again.");
      setLoading(false);
      return;
    }

    if (form.password.length < 8) {
      setMsg("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    try {
      await api.post("accounts/register/", form);
      setMsg("Registration successful! You can now login.");
      setTimeout(() => {
        window.location.href = "/auth/login";
      }, 2000);
    } catch (err) {
      const errorData = err.response?.data;
      if (typeof errorData === 'object') {
        const errorMessages = Object.values(errorData).flat().join(', ');
        setMsg(errorMessages || "Registration failed. Please try again.");
      } else {
        setMsg(err.response?.data?.message || "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="max-w-md w-full">
        {/* Main Form Container */}
        <div className="bg-white border border-gray-300 rounded-sm px-8 py-8">
          {/* Instagram-style Logo */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="w-64 h-16 flex items-center justify-center">
                  <span className="text-3xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 bg-clip-text text-transparent">
                    SocialVerse
                  </span>
                </div>
              </div>
            </div>
            <p className="text-gray-500 text-sm font-semibold">
              Sign up to see photos and videos from your friends.
            </p>
          </div>

          {/* Facebook Signup Option */}
          <button className="w-full bg-blue-500 text-white py-1.5 rounded text-sm font-semibold mb-4 hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center space-x-2">
            <span className="text-white text-lg">📘</span>
            <span>Log in with Facebook</span>
          </button>

          {/* Divider */}
          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-gray-300"></div>
            <div className="px-4 text-xs font-semibold text-gray-500">OR</div>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Registration Form */}
          <form onSubmit={submit} className="space-y-3">
            <div>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder="Mobile Number or Email"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-gray-400"
                required
              />
            </div>

            <div>
              <input
                name="username"
                value={form.username}
                onChange={onChange}
                placeholder="Username"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-gray-400"
                required
              />
            </div>

            <div>
              <input
                name="username"
                value={form.fullName}
                onChange={onChange}
                placeholder="Full Name"
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

            <div>
              <input
                type="password"
                name="password2"
                value={form.password2}
                onChange={onChange}
                placeholder="Confirm Password"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-gray-400"
                required
              />
            </div>

            {/* Terms and Conditions */}
            <div className="text-center mt-3">
              <p className="text-xs text-gray-500 px-4">
                By signing up, you agree to our{" "}
                <a href="#" className="text-blue-900">Terms</a>,{" "}
                <a href="#" className="text-blue-900">Privacy Policy</a> and{" "}
                <a href="#" className="text-blue-900">Cookies Policy</a>.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !form.email || !form.username || !form.password || !form.password2}
              className="w-full bg-blue-500 text-white py-1.5 rounded text-sm font-semibold mt-4 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors duration-200"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing up...
                </div>
              ) : (
                "Sign up"
              )}
            </button>

            {/* Error/Success Message */}
            {msg && (
              <div className="mt-4 text-center">
                <p className={`text-sm ${
                  msg.includes("successful") ? "text-green-600" : "text-red-600"
                }`}>
                  {msg}
                </p>
              </div>
            )}
          </form>
        </div>

        {/* Login Redirect */}
        <div className="bg-white border border-gray-300 rounded-sm mt-3 py-5 text-center">
          <p className="text-sm text-gray-900">
            Have an account?{" "}
            <Link 
              to="/auth/login" 
              className="text-blue-500 font-semibold hover:text-blue-600"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}