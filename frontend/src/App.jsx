import React, { useEffect, useState } from "react";
import api from "./api/axiosClient";
import Layout from "./components/Layout";

export default function App() {
  const [ping, setPing] = useState(null);

  useEffect(() => {
    async function fetchPing() {
      try {
        const res = await api.get("accounts/ping/");
        setPing(res.data.ping);
      } catch (err) {
        setPing("error");
        console.error(err);
      }
    }
    fetchPing();
  }, []);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto mt-20 p-6 bg-white/80 rounded-md shadow">
        <h1 className="text-2xl font-semibold mb-4">SocialVerse — Frontend</h1>
        <p className="mb-2">Backend ping: <span className="font-mono">{ping ?? "loading..."}</span></p>
        <p className="text-sm text-gray-500">
          This page uses the Axios client configured to <code>VITE_API_BASE_URL</code>.
        </p>
      </div>
    </Layout>
  );
}
