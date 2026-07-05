// ChatInbox.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import ChatBox from './ChatBox.js';

const ChatInbox = ({ user, socket }) => {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const preselectedUser = queryParams.get('user');

  const fetchInbox = React.useCallback(async () => {
    if (!user?._id) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/api/chats/inbox/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const sortedChats = (res.data || []).sort((a, b) => new Date(b.lastDate || 0) - new Date(a.lastDate || 0));
      setChats(sortedChats);
    } catch (err) {
      console.error("Failed to load chats:", err);
      setChats([]);
    }
  }, [user?._id]);

  useEffect(() => {
    fetchInbox();
  }, [user?._id, fetchInbox]);

  useEffect(() => {
    if (!socket || !user?._id) return;

    const handleIncomingMessage = (msg) => {
      if (!msg) return;
      const isRelevant = String(msg.from) === String(user._id) || String(msg.to) === String(user._id);
      if (isRelevant) fetchInbox();
    };

    const handleChatDeleted = () => fetchInbox();

    socket.on('receive', handleIncomingMessage);
    socket.on('chatDeleted', handleChatDeleted);

    return () => {
      socket.off('receive', handleIncomingMessage);
      socket.off('chatDeleted', handleChatDeleted);
    };
  }, [socket, user?._id, fetchInbox]);

  useEffect(() => {
    if (preselectedUser) setActiveChat(preselectedUser);
  }, [preselectedUser]);

  if (!user || !socket) return <div>Loading chats...</div>;

  // --- Sidebar + Chat Layout --- //
  return (
    <div style={{ display: "flex", maxWidth: 950, margin: "42px auto" }}>
      {/* LEFT SIDEBAR: Chat List */}
      <div style={{
        width: 280,
        background: "#f8fbff",
        borderRadius: 10,
        marginRight: 24,
        padding: "18px 0 18px 13px",
        boxShadow: "0 2px 8px rgba(0,0,50,0.08)"
      }}>
        <h2 style={{ fontWeight: 800, marginBottom: 16 }}>Your Chats</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {chats.length === 0 ? (
            <div>No chats yet.</div>
          ) : (
            chats.map(chat => (
              <li key={chat._id} style={{ marginBottom: 14 }}>
                <div
                  onClick={() => setActiveChat(chat._id)}
                  style={{
                    background: activeChat === chat._id ? "#e3edff" : "transparent",
                    borderRadius: 7,
                    padding: "11px 14px",
                    fontWeight: activeChat === chat._id ? 700 : 500,
                    color: "#1b4366",
                    cursor: "pointer",
                  }}>
                  {chat.username || chat.email || chat._id}
                  <br />
                  <span style={{ color: "#4c6072", fontSize: 13 }}>{chat.lastMessage}</span>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
      {/* RIGHT: ChatBox */}
      <div style={{ flex: 1, minHeight: 480, background: "#fff", borderRadius: 10, padding: 14 }}>
        {activeChat ? (
          <ChatBox from={user._id} to={activeChat} socket={socket} onMessageSent={fetchInbox} />
        ) : (
          <div style={{ color: "#465e70", opacity: 0.7, marginTop: "90px", textAlign: "center" }}>
            Select a chat to start messaging.
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInbox;
