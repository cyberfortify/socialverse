import React, { useEffect, useState } from "react";
import api from "../api/axiosClient";
import PostCard from "../components/PostCard";

export default function Explore() {
  const [posts, setPosts] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("newest"); // newest | popular

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get("posts/");
      let data = res.data.results ?? res.data;
      // client-side sort for now
      if (sort === "popular") {
        data = [...data].sort((a,b) => (b.likes_count||0) - (a.likes_count||0));
      } else {
        data = [...data].sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
      }
      if (q.trim()) {
        const term = q.toLowerCase();
        data = data.filter(p => (p.content || "").toLowerCase().includes(term) || (p.author?.username||"").toLowerCase().includes(term));
      }
      setPosts(data);
    } catch (err) {
      console.error("Explore fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [sort]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search posts, users..."
          className="flex-1 p-3 border rounded"
        />
        <select value={sort} onChange={e=>setSort(e.target.value)} className="p-2 border rounded">
          <option value="newest">Newest</option>
          <option value="popular">Most liked</option>
        </select>
        <button onClick={fetchPosts} className="px-3 py-2 bg-blue-600 text-white rounded">Search</button>
      </div>

      {loading ? (
        <div className="py-10 text-center">Loading explore…</div>
      ) : posts.length === 0 ? (
        <div className="py-10 text-center text-slate-500">No results</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.map(p => <PostCard key={p.id} post={p} onAction={fetchPosts} />)}
        </div>
      )}
    </div>
  );
}
