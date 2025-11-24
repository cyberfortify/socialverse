import React, { useEffect, useState } from "react";
import api from "../api/axiosClient";

export default function Notifications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // If you add backend, swap fetch to GET /notifications/
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      // mock fallback: generate from recent posts liked/comments (if no backend)
      // try API, otherwise fallback to empty
      const res = await api.get("notifications/").catch(()=>null);
      if (res && res.data) {
        setItems(res.data.results ?? res.data);
      } else {
        setItems([]); // no backend yet — empty
      }
    } catch (err) {
      console.error("notifications fetch", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markRead = async (id) => {
    try {
      await api.post(`notifications/${id}/mark-read/`).catch(()=>null);
      setItems(prev => prev.map(x => x.id === id ? {...x, read: true} : x));
    } catch (err) {
      console.error("mark read", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Notifications</h2>
      {loading ? (
        <div className="py-8 text-center">Loading…</div>
      ) : items.length === 0 ? (
        <div className="py-8 text-center text-slate-500">No notifications yet</div>
      ) : (
        <div className="space-y-3">
          {items.map(n => (
            <div key={n.id} className={`p-3 rounded border ${n.read ? 'bg-white' : 'bg-blue-50'}`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm">{n.text}</div>
                  <div className="text-xs text-slate-400">{new Date(n.created_at).toLocaleString()}</div>
                </div>
                {!n.read && (
                  <button onClick={()=>markRead(n.id)} className="ml-4 text-sm text-blue-600">Mark read</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
