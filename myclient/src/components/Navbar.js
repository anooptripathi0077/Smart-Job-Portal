import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ user, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout(); // clear user state (maybe token, etc.)
    navigate('/login'); // redirect to login page
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">Smart Job Portal</Link>

      <div className="navbar-links">
        {!user ? (
          <>
            <Link to="/register" className={`navbar-link ${location.pathname === '/register' ? 'active' : ''}`}>Register</Link>
            <Link to="/login" className={`navbar-link ${location.pathname === '/login' ? 'active' : ''}`}>Login</Link>
          </>
        ) : (
          <>
            <Link to="/profile" className={`navbar-link ${location.pathname === '/profile' ? 'active' : ''}`}>Profile</Link>
            <Link to="/blogs" className={`navbar-link ${location.pathname === '/blogs' ? 'active' : ''}`}>Blog</Link>
            <Link to="/search" className={`navbar-link ${location.pathname === '/search' ? 'active' : ''}`}>Search</Link>
            <Link to="/jobs" className={`navbar-link ${location.pathname === '/jobs' ? 'active' : ''}`}>Jobs</Link>
            <Link to="/inbox" className={`navbar-link ${location.pathname === '/inbox' ? 'active' : ''}`}>Inbox</Link>
             {user.role==='student' && (
            <Link to="/enhance-resume">Enhance Resume</Link>//
             )}
            {user.role === 'student' && (
            <Link to="/my-applications" className={`navbar-link ${location.pathname === '/my-applications' ? 'active' : ''}`}>My Applications</Link>
             )}
            {user.role === 'recruiter' && (
            <Link to="/add-job" className={`navbar-link ${location.pathname === '/add-job' ? 'active' : ''}`}>
            Add Job  </Link>)}

            
            <button onClick={handleLogout} style={{
              background: 'transparent',
              border: 'none',
              color: '#a8d8ff',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '1.05rem'
            }}>
              Logout
            </button>
          </>
        )}
      </div>

      {user && (
        <div className="navbar-user-info" title={user.name}>
          {user.profilePicUrl ? (
            <img src={user.profilePicUrl} alt={`${user.name}'s profile`} className="navbar-user-pic" />
          ) : (
            <div style={{
              width: 36, height: 36, borderRadius: '50%', backgroundColor: '#004a99',
              color: 'white', textAlign: 'center', lineHeight: '36px', fontWeight: '700',
              fontSize: '1rem', userSelect: 'none'
            }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <span>{user.name}</span>
        </div>
      )}
    </nav>
  )
}

export default Navbar;
