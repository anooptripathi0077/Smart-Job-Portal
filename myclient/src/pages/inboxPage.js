import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './inboxPage.css';
import ChatBox from '../components/ChatBox.js';

const IndexPage = ({ user, socket }) => {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const preselectedUser = queryParams.get('user');

  useEffect(() => {
    if (!user?._id) return;

    const fetchInbox = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`/api/chats/inbox/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const sortedChats = (res.data || []).sort((a, b) => new Date(b.lastDate) - new Date(a.lastDate));
        setChats(sortedChats);
      } catch (err) {
        console.error("Failed to load chats:", err);
      }
    };
    fetchInbox();
  }, [user]);

  useEffect(() => {
    if (preselectedUser) setActiveChat(preselectedUser);
  }, [preselectedUser]);

  if (!user || !socket) return <div>Loading chats...</div>;

  return (
    <div style={{ maxWidth: 520, margin: "40px auto", background: "#fff", borderRadius: 12, padding: 26, boxShadow: "0 3px 12px rgba(0,115,230,0.12)" }}>
      <h2 style={{ fontWeight: 800, marginBottom: 18 }}>Your Chats</h2>

      {activeChat ? (
        <>
          <button onClick={() => setActiveChat(null)} style={{ marginBottom: 12, cursor: 'pointer' }}>
            ← Back to Inbox
          </button>
          <ChatBox from={user._id} to={activeChat} socket={socket} />
        </>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {chats.length === 0 ? (
            <div>No chats yet.</div>
          ) : (
            chats.map(chat => (
              <li key={chat._id} style={{ marginBottom: 16 }}>
                <div
                  onClick={() => setActiveChat(chat._id)}
                  style={{
                    display: "flex", justifyContent: "space-between",
                    background: "#f6fbff", borderRadius: 8, padding: "10px 18px",
                    cursor: "pointer"
                  }}
                >
                  <span style={{ fontWeight: "bold", color: "#0073e6" }}>{chat.username || chat._id}</span>
                  <span style={{ color: "#4c6072", fontStyle: "italic" }}>{chat.lastMessage}</span>
                </div>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default IndexPage;
