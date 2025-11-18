import React, { useEffect, useState, useRef } from "react";
import api from "../api/axiosClient";

function ConversationItem({ conv, active, onOpen }) {
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60);
      return `${minutes}m`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div 
      onClick={() => onOpen(conv)} 
      className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
        active?.id === conv.id 
          ? 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200' 
          : 'hover:bg-gray-50 border border-transparent'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-md">
            <span className="text-white font-semibold text-sm">
              {conv.other?.charAt(0)?.toUpperCase()}
            </span>
          </div>
          {conv.online && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900 truncate">{conv.other}</h4>
            <span className="text-xs text-gray-500 whitespace-nowrap">
              {formatTime(conv.updated_at)}
            </span>
          </div>
          <p className="text-sm text-gray-600 truncate mt-1">{conv.lastMessage}</p>
          
          {conv.unreadCount > 0 && (
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-blue-600 font-medium">
                {conv.unreadCount} new message{conv.unreadCount > 1 ? 's' : ''}
              </span>
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message, isOwn }) {
  const formatMessageTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[70%] rounded-2xl p-4 relative ${
        isOwn 
          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-none' 
          : 'bg-gray-100 text-gray-900 rounded-bl-none'
      }`}>
        <p className="text-sm leading-relaxed">{message.text}</p>
        <div className={`text-xs mt-2 ${
          isOwn ? 'text-blue-100' : 'text-gray-500'
        }`}>
          {formatMessageTime(message.created_at)}
        </div>
        
        {/* Message tail */}
        <div className={`absolute bottom-0 w-3 h-3 ${
          isOwn 
            ? 'right-0 translate-x-1 bg-gradient-to-r from-blue-500 to-purple-600' 
            : 'left-0 -translate-x-1 bg-gray-100'
        }`} 
        style={{ 
          clipPath: isOwn ? 'polygon(100% 0, 0 0, 100% 100%)' : 'polygon(0 0, 100% 0, 0 100%)' 
        }}></div>
      </div>
    </div>
  );
}

export default function Messages() {
  const [conversations, setConversations] = useState([]);
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load conversations
  const fetchConversations = async () => {
    setLoading(true);
    try {
      const res = await api.get("conversations/").catch(() => null);
      if (res && res.data) {
        setConversations(res.data.results ?? res.data);
      } else {
        // Fallback mock data
        setConversations([
          { 
            id: 1, 
            other: "alice", 
            lastMessage: "Hey! How are you doing today?", 
            updated_at: new Date(Date.now() - 5 * 60000).toISOString(),
            online: true,
            unreadCount: 2
          },
          { 
            id: 2, 
            other: "bob", 
            lastMessage: "Did you see the new update?", 
            updated_at: new Date(Date.now() - 2 * 3600000).toISOString(),
            online: false,
            unreadCount: 0
          },
          { 
            id: 3, 
            other: "charlie", 
            lastMessage: "Thanks for your help yesterday! 🎉", 
            updated_at: new Date(Date.now() - 24 * 3600000).toISOString(),
            online: true,
            unreadCount: 1
          },
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openConv = async (conv) => {
    setActive(conv);
    try {
      const res = await api.get(`conversations/${conv.id}/messages/`).catch(() => null);
      if (res && res.data) {
        setMessages(res.data.results ?? res.data);
      } else {
        // Mock messages
        setMessages([
          { id: 1, sender: "alice", text: "Hey! How are you doing today?", created_at: new Date(Date.now() - 10 * 60000).toISOString() },
          { id: 2, sender: "you", text: "I'm doing great! Just working on some new features.", created_at: new Date(Date.now() - 8 * 60000).toISOString() },
          { id: 3, sender: "alice", text: "That sounds awesome! Can't wait to see what you're building. 😊", created_at: new Date(Date.now() - 5 * 60000).toISOString() },
          { id: 4, sender: "you", text: "Thanks! It's a new messaging system with better UI.", created_at: new Date(Date.now() - 3 * 60000).toISOString() },
          { id: 5, sender: "alice", text: "Looks really good so far! The bubbles are nice.", created_at: new Date(Date.now() - 2 * 60000).toISOString() },
        ]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!text.trim() || !active) return;
    
    const newMessage = {
      id: Date.now(),
      sender: "you",
      text: text.trim(),
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMessage]);
    setText("");

    try {
      const payload = { text: newMessage.text, conversation: active.id };
      await api.post("messages/", payload).catch(() => null);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-140px)] bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-4 h-full">
        {/* Conversations Sidebar */}
        <div className="md:col-span-1 border-r border-gray-200 bg-gray-50/50">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Messages</h2>
            <p className="text-gray-600 mt-1">Chat with your friends</p>
          </div>
          
          <div className="p-4">
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full px-4 py-2 pl-10 bg-white border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
            </div>
          </div>

          <div className="overflow-y-auto h-[calc(100vh-280px)]">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                <p className="text-gray-600 text-sm">Loading conversations...</p>
              </div>
            ) : (
              <div className="space-y-2 p-4">
                {conversations.map(conv => (
                  <ConversationItem 
                    key={conv.id} 
                    conv={conv} 
                    active={active}
                    onOpen={openConv} 
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="md:col-span-3 flex flex-col">
          {!active ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">💬</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Your Messages</h3>
              <p className="text-gray-600 max-w-md">
                Select a conversation from the sidebar to start chatting with your friends and connections.
              </p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 bg-white">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {active.other?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{active.other}</h3>
                    <p className="text-sm text-green-600 flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Online
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-3xl mx-auto">
                  {messages.map(message => (
                    <MessageBubble 
                      key={message.id} 
                      message={message} 
                      isOwn={message.sender === "you"} 
                    />
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <form onSubmit={sendMessage} className="flex space-x-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Type a message..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage(e);
                        }
                      }}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!text.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}