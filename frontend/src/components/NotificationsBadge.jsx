// frontend/src/components/NotificationsBadge.jsx
import React, { useState, useRef, useEffect } from "react";
import useNotifications from "../hooks/useNotifications";
import { Link } from "react-router-dom";

/**
 * NotificationsBadge
 * - shows bell icon with unread badge
 * - click toggles dropdown
 * - dropdown lists recent notifications (max 10)
 * - supports mark-as-read per item and "Mark all read"
 */
export default function NotificationsBadge({ pollInterval = 10000 }) {
  const { notifications, unreadCount, loading, markRead, markAllRead, refresh } = useNotifications({
    intervalMs: pollInterval,
  });
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    function handleClick(e) {
      if (!ref.current?.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const recent = notifications.slice(0, 10);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => {
          setOpen((s) => !s);
          if (!open) {
            // if opening, optionally refresh immediately
            refresh();
          }
        }}
        className="relative p-2 rounded-full hover:bg-gray-100 transition"
        aria-expanded={open}
        title={unreadCount ? `${unreadCount} unread notifications` : "Notifications"}
      >
        <span className="text-2xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-0 -right-0 transform translate-x-1/2 -translate-y-1/2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold leading-none text-white bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-2 border-b">
            <div className="text-sm font-semibold">Notifications</div>
            <div className="flex items-center gap-2">
              <button
                onClick={async () => {
                  await markAllRead();
                }}
                className="text-xs text-slate-600 hover:text-slate-800"
              >
                Mark all read
              </button>
              <button onClick={() => setOpen(false)} className="text-xs text-slate-400 hover:text-slate-600">
                Close
              </button>
            </div>
          </div>

          <div className="max-h-64 overflow-auto">
            {loading ? (
              <div className="p-4 text-center text-sm text-slate-500">Loading…</div>
            ) : recent.length === 0 ? (
              <div className="p-4 text-sm text-slate-500">No notifications</div>
            ) : (
              recent.map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 p-3 hover:bg-gray-50 ${n.read ? "" : "bg-blue-50"}`}
                >
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-sm">
                    {n.actor?.username?.charAt(0)?.toUpperCase() ?? "U"}
                  </div>

                  <div className="flex-1">
                    <div className="text-sm">
                      {n.text}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {new Date(n.created_at).toLocaleString()}
                    </div>
                    <div className="mt-2 flex items-center gap-3">
                      {n.url ? (
                        <Link
                          to={n.url}
                          onClick={() => {
                            // mark read when navigating
                            if (!n.read) markRead(n.id);
                            setOpen(false);
                          }}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          View
                        </Link>
                      ) : null}
                      {!n.read && (
                        <button
                          onClick={() => markRead(n.id)}
                          className="text-xs text-slate-600 hover:text-slate-800"
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="px-3 py-2 border-t text-sm text-center">
            <Link to="/notifications" onClick={() => setOpen(false)} className="text-blue-600 hover:underline">
              See all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
