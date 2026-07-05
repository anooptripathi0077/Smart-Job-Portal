// // src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';

import Navbar from './components/Navbar.js';
import RegisterPage from './pages/RegisterPage.js';
import LoginPage from './pages/LoginPage.js';
import ProfilePage from './pages/ProfilePage.js';
import UserSearchPage from './pages/UserSearchPage.js';
import PublicUserProfilePage from './pages/PublicUserProfilePage.js';
import ChatInbox from './components/ChatInbox.js';
import BlogPage from './pages/BlogPage.js';
import JobsPage from './pages/JobsPage.js';
import JobDetailsPage from './pages/JobDetailsPage.js';
import JobApplicationsPage from './pages/JobApplicationPage.js';
import MyApplicationsPage from './pages/MyApplicationsPage.js';
import AddJobPage from './pages/AddJobPage.js';
import ResumeEnhancer from './pages/resumeEnhancer.jsx';

const getApiBaseUrl = () => {
  if (process.env.REACT_APP_API_URL) return process.env.REACT_APP_API_URL;
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5000';
  }
  return '';
};

const getSocketUrl = () => {
  if (process.env.REACT_APP_SOCKET_URL) return process.env.REACT_APP_SOCKET_URL;
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5000';
  }
  return window.location.origin;
};

function App() {
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);

  axios.defaults.baseURL = getApiBaseUrl();

  useEffect(() => {
    const s = io(getSocketUrl(), { withCredentials: true });
    setSocket(s);
    return () => s.disconnect();
  }, []);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await axios.get('/api/auth/profile', { headers: { Authorization: `Bearer ${token}` } });
        setUser(res.data);
        localStorage.setItem('userId',res.data._id);
      } catch (err) {
        console.error('Failed to fetch current user:', err?.response?.status, err?.response?.data);
        setUser(null);
        localStorage.removeItem('token');
      }
    };
    fetchCurrentUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setUser(null);
  };

  const PrivateRoute = ({ children }) => (user ? children : <Navigate to="/login" />);

  return (
    <BrowserRouter>
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<PrivateRoute><ProfilePage user={user} socket={socket} /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><ProfilePage user={user} socket={socket} /></PrivateRoute>} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage setUser={setUser} />} />
        <Route path="/blogs" element={<BlogPage user={user} />} />
        <Route path="/search" element={<UserSearchPage />} />
        <Route path="/user/:id" element={<PublicUserProfilePage socket={socket} />} />
        <Route path="/enhance-resume" element={<ResumeEnhancer />} />
        <Route path="/inbox" element={<ChatInbox user={user} socket={socket} />} />
        <Route path="/jobs" element={<PrivateRoute><JobsPage user={user} /></PrivateRoute>} />
        <Route path="/jobs/:id" element={<PrivateRoute><JobDetailsPage user={user} /></PrivateRoute>} />
        <Route path="/jobs/:id/applications" element={<PrivateRoute>{user?.role === 'recruiter' ? <JobApplicationsPage user={user} /> : <Navigate to="/" />}</PrivateRoute>} />
        <Route path="/add-job" element={<PrivateRoute>{user?.role === 'recruiter' ? <AddJobPage user={user} /> : <Navigate to="/" />}</PrivateRoute>} />
        <Route path="/my-applications" element={<PrivateRoute><MyApplicationsPage user={user} /></PrivateRoute>} />
        <Route path="*" element={<Navigate to={user ? "/profile" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
