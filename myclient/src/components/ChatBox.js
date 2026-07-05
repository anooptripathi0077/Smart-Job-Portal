// import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";

// const ChatBox = ({ from, to, socket }) => {
//   const [chat, setChat] = useState([]);
//   const [message, setMessage] = useState('');
//   const chatEndRef = useRef(null);

//   // Scroll to bottom whenever chat updates
//   const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });

//   useEffect(scrollToBottom, [chat]);

//   useEffect(() => {
//     if (!from || !to || !socket) return;

//     const fetchChat = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const res = await axios.get(`/api/chats/${from}/${to}`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         setChat(res.data || []);
//       } catch (err) {
//         console.error("Failed to fetch chat history:", err);
//       }
//     };
//     fetchChat();

//     socket.emit('join', { userId: from });

//     const receiveHandler = (msg) => {
//       if (!msg) return;
//       const msgFrom = String(msg.from);
//       const msgTo = String(msg.to);
//       if ((msgFrom === String(from) && msgTo === String(to)) || (msgFrom === String(to) && msgTo === String(from))) {
//         setChat(prev => [...prev, msg]);
//       }
//     };

//     socket.on('receive', receiveHandler);
//     return () => socket.off('receive', receiveHandler);
//   }, [from, to, socket]);

//   const sendMessage = async () => {
//     if (!message.trim()) return;

//     socket.emit('send', { from, to, body: message });
//     setChat(prev => [...prev, { from, to, body: message, createdAt: new Date() }]);
//     setMessage('');
//   };

//   return (
//     <div style={{
//       border: "1px solid #0073e6", borderRadius: 14, padding: 22,
//       maxWidth: 520, margin: "0 auto", background: "#f6fbff"
//     }}>
//       <div style={{
//         maxHeight: 400, overflowY: "auto", border: "1px solid #dae6fa",
//         padding: 10, borderRadius: 8
//       }}>
//         {chat.map((msg, i) => (
//           <div
//             key={i}
//             style={{
//               display: "flex",
//               justifyContent: String(msg.from) === String(from) ? "flex-end" : "flex-start",
//               margin: "6px 0"
//             }}
//           >
//             <span style={{
//               background: String(msg.from) === String(from) ? "#e6f7ff" : "#dbeafe",
//               borderRadius: 8, padding: "6px 13px", fontWeight: "bold",
//               maxWidth: "70%", wordBreak: "break-word"
//             }}>{msg.body}</span>
//           </div>
//         ))}
//         <div ref={chatEndRef} />
//       </div>

//       <div style={{ display: "flex", marginTop: 12 }}>
//         <input
//           value={message}
//           onChange={e => setMessage(e.target.value)}
//           style={{ flex: 1, padding: 11, borderRadius: 5, border: "1px solid #cee6ff" }}
//           placeholder="Type your message..."
//         />
//         <button onClick={sendMessage} style={{
//           marginLeft: 10, background: "#0073e6", color: "#fff",
//           border: "none", borderRadius: 5, padding: "10px 15px", fontWeight: "bold", fontSize: "1rem"
//         }}>Send</button>
//       </div>
//     </div>
//   );
// };

// export default ChatBox;

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const ChatBox = ({ from, to, socket, onMessageSent }) => {
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState('');
  const chatEndRef = useRef(null);

  // Scroll to bottom whenever chat updates
  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(scrollToBottom, [chat]);

  useEffect(() => {
    if (!from || !to || !socket) return;

    const fetchChat = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`/api/chats/${from}/${to}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Normalize 'from' and 'to' fields to strings for consistent comparison
        const normalizedChat = (res.data || []).map(msg => ({
          ...msg,
          from: msg.from?.toString(),
          to: msg.to?.toString()
        }));

        setChat(normalizedChat);
      } catch (err) {
        console.error("Failed to fetch chat history:", err);
      }
    };

    fetchChat();
    socket.emit('join', { userId: from });

    const receiveHandler = (msg) => {
      if (!msg) return;
      const msgFrom = msg.from?.toString();
      const msgTo = msg.to?.toString();

      if (
        (msgFrom === from?.toString() && msgTo === to?.toString()) ||
        (msgFrom === to?.toString() && msgTo === from?.toString())
      ) {
        setChat(prev => [...prev, { ...msg, from: msgFrom, to: msgTo }]);
      }
    };

    socket.on('receive', receiveHandler);
    return () => socket.off('receive', receiveHandler);
  }, [from, to, socket]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const newMsg = {
      from: from?.toString(),
      to: to?.toString(),
      body: message,
      createdAt: new Date()
    };

    socket.emit('send', newMsg);
    setChat(prev => [...prev, newMsg]);
    onMessageSent?.(newMsg);
    setMessage('');
  };

  const deleteAllMessages = async()=>{
    if(!window.confirm("Are you sure to delete all Messages")) return;
    try{
      const token = localStorage.getItem('token');
      await axios.delete(`/api/chats/${from}/${to}`,{
        headers:{Authorization: `Bearer ${token}`}
      });
    setChat([]); 
    socket.emit('deleteChat', { from, to });
    socket.on('chatDeleted', ({ from }) => {
  if (from === to) setChat([]);
});

    alert("All messages deleted successfully!");
    }catch (err) {
    console.error("Error deleting chat:", err);
    alert("Failed to delete messages.");
  }
  };

  return (
    <div style={{
      border: "1px solid #0073e6",
      borderRadius: 14,
      padding: 22,
      maxWidth: 520,
      margin: "0 auto",
      background: "#f6fbff",
      position: "relative"
    }}>
      <button 
      onClick={deleteAllMessages}
      style={{
        position: "absolute",
        top:10,
        right:10,
        background:"transparent",
        border: "none",
        color:"#d11a2a",
        fontWeight:"bold",
        cursor:"pointer"
      }}
      title="Delete All Messages"
      >🗑️</button>
      <div style={{
        maxHeight: 400,
        overflowY: "auto",
        border: "1px solid #dae6fa",
        padding: 10,
        borderRadius: 8
      }}>
        {chat.map((msg, i) => {
          const isUser = msg.from?.toString() === from?.toString();
          return (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: isUser ? "flex-end" : "flex-start",
                margin: "6px 0"
              }}
            >
              <span style={{
                background: isUser ? "#73cfc6ff" : "#e9edefff",
                borderRadius: 8,
                padding: "8px 13px",
                fontWeight: "normal",
                maxWidth: "70%",
                wordBreak: "break-word",
                boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                border: isUser ? "1px solid #057988ff" : "1px solid #310303ff"
              }}>
                {msg.body}
              </span>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      <div style={{ display: "flex", marginTop: 12 }}>
        <input
          value={message}
          onChange={e => setMessage(e.target.value)}
          style={{
            flex: 1,
            padding: 11,
            borderRadius: 5,
            border: "1px solid #cee6ff"
          }}
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          style={{
            marginLeft: 10,
            background: "#0073e6",
            color: "#fff",
            border: "none",
            borderRadius: 5,
            padding: "10px 15px",
            fontWeight: "bold",
            fontSize: "1rem"
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;