import React, { useEffect, useState } from "react";
import api from "../api/axiosClient";

function ConversationItem({ conv, onOpen }) {
  return (
    <div onClick={()=>onOpen(conv)} className="p-3 rounded hover:bg-gray-50 cursor-pointer flex items-center gap-3">
      <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-sm">{conv.other?.charAt(0)?.toUpperCase()}</div>
      <div className="flex-1">
        <div className="font-medium">{conv.other}</div>
        <div className="text-xs text-slate-500 truncate">{conv.lastMessage}</div>
      </div>
      <div className="text-xs text-slate-400">{new Date(conv.updated_at).toLocaleTimeString()}</div>
    </div>
  );
}

export default function Messages() {
  const [conversations, setConversations] = useState([]);
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  // load convos — try API or fallback to mock
  const fetchConversations = async () => {
    try {
      const res = await api.get("conversations/").catch(()=>null);
      if (res && res.data) {
        setConversations(res.data.results ?? res.data);
      } else {
        // fallback mock (local)
        setConversations([
          { id: 1, other: "alice", lastMessage: "Hey!", updated_at: new Date().toISOString() },
          { id: 2, other: "bob", lastMessage: "Sup", updated_at: new Date().toISOString() },
        ]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openConv = async (conv) => {
    setActive(conv);
    // try backend
    try {
      const res = await api.get(`conversations/${conv.id}/messages/`).catch(()=>null);
      if (res && res.data) {
        setMessages(res.data.results ?? res.data);
      } else {
        // mock messages
        setMessages([
          { id: 1, sender: conv.other, text: conv.lastMessage, created_at: new Date().toISOString() },
          { id: 2, sender: "you", text: "Reply...", created_at: new Date().toISOString() }
        ]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = async () => {
    if (!text.trim() || !active) return;
    const payload = { text, conversation: active.id };
    try {
      const res = await api.post("messages/", payload).catch(()=>null);
      if (res && res.data) {
        setMessages(prev => [...prev, res.data]);
      } else {
        setMessages(prev => [...prev, { id: Date.now(), sender: "you", text, created_at: new Date().toISOString() }]);
      }
      setText("");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(()=>{ fetchConversations(); }, []);

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="col-span-1 bg-white rounded shadow p-3">
        <h3 className="font-semibold mb-3">Conversations</h3>
        <div className="space-y-2">
          {conversations.map(c => <ConversationItem key={c.id} conv={c} onOpen={openConv} />)}
        </div>
      </div>

      <div className="col-span-2 bg-white rounded shadow p-3 flex flex-col">
        {!active ? (
          <div className="flex-1 flex items-center justify-center text-slate-400">Select a conversation</div>
        ) : (
          <>
            <div className="border-b pb-3 mb-3">
              <div className="font-semibold">{active.other}</div>
            </div>

            <div className="flex-1 overflow-auto space-y-3 mb-3">
              {messages.map(m => (
                <div key={m.id} className={`p-2 rounded ${m.sender === "you" ? "bg-blue-50 self-end" : "bg-gray-100 self-start"}`}>
                  <div className="text-sm">{m.text}</div>
                  <div className="text-xs text-slate-400 mt-1">{new Date(m.created_at).toLocaleString()}</div>
                </div>
              ))}
            </div>

            <div className="mt-auto">
              <div className="flex gap-2">
                <input value={text} onChange={e=>setText(e.target.value)} className="flex-1 p-2 border rounded" placeholder="Write a message..." />
                <button onClick={sendMessage} className="px-4 py-2 bg-blue-600 text-white rounded">Send</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
