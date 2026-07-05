// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const LoginPage = ({ setUser }) => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const [error, setError] = useState('');

//   const handleChange = e => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async e => {
//     e.preventDefault();
//     try {
//       const res = await axios.post('/api/auth/login', formData);
//       localStorage.setItem('token', res.data.token);
//       setUser(res.data.user);
//       navigate('/profile');
//     } catch (err) {
//       setError(err.response?.data.message || 'Login failed');
//     }
//   };

//   return (
//     <div>
//       <h2>Login</h2>
//       <form onSubmit={handleSubmit}>
//         <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
//         <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
//         <button type="submit">Login</button>
//       </form>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//     </div>
//   );
// };

// export default LoginPage;
// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import './LoginPage.css';

// const LoginPage = ({ setUser }) => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleChange = e => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async e => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     try {
//       const res = await axios.post('/api/auth/login', formData);
//       localStorage.setItem('token', res.data.token);
//       setUser(res.data.user);
//       navigate('/profile');
//     } catch (err) {
//       setError(err.response?.data.message || 'Login failed');
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="login-outer-bg">
//       <div className="waves-bg">
//         <svg
//           viewBox="0 0 1440 320"
//           preserveAspectRatio="none"
//           className="waves"
//         >
//           <path
//             fill="#0099ff"
//             fillOpacity="0.25"
//             d="M0,160L48,186.7C96,213,192,267,288,256C384,245,480,171,576,122.7C672,75,768,53,864,58.7C960,64,1056,96,1152,128C1248,160,1344,192,1392,208L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
//           ></path>
//         </svg>
//       </div>
//       <div className="login-card">
//         <h2 className="login-title">Smart Job Portal</h2>
//         <form onSubmit={handleSubmit} className={loading ? 'form-loading' : ''}>
//           <div className="input-group">
//             <input
//               name="email"
//               type="email"
//               placeholder="Email"
//               onChange={handleChange}
//               required
//               autoComplete="off"
//             />
//             <label>Email</label>
//           </div>
//           <div className="input-group">
//             <input
//               name="password"
//               type="password"
//               placeholder="Password"
//               onChange={handleChange}
//               required
//               autoComplete="off"
//             />
//             <label>Password</label>
//           </div>
//           <button
//             type="submit"
//             className="login-btn"
//             disabled={loading}
//           >
//             {loading ? (
//               <span className="loader"></span>
//             ) : (
//               'Login'
//             )}
//           </button>
//         </form>
//         {error && <p className="login-error">{error}</p>}
//       </div>
//     </div>
//   );
// };

// export default LoginPage;


import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = ({ setUser }) => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('/api/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId',res.data.user._id);
      setUser(res.data.user);
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="split-login-outer">
      <div className={`split-login-container${showForm ? ' slide' : ''}`}>
        {/* Left Side: Welcome/Login Button OR Login Form */}
        <div className="split-left">
          {!showForm ? (
            <div className="welcome-pane">
              <h2 className="welcome-title">Welcome Back</h2>
              <button className="welcome-login-btn" onClick={() => setShowForm(true)}>
                Login
              </button>
            </div>
          ) : (
            <div className="form-pane">
              <h2 className="form-title">Sign In to SMART JOB PORTAL</h2>
              <form onSubmit={handleSubmit} className="login-form">
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  onChange={handleChange}
                  required
                />
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  onChange={handleChange}
                  required
                />
                <button type="submit" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </button>
                {error && <div className="login-error">{error}</div>}
              </form>
            </div>
          )}
        </div>
        {/* Right Side: Branding (only visible in form state) */}
        <div className="split-right">
          <div className="branding-content">
            <span className="brand-name">SMART JOB PORTAL</span>
            <br></br>
            <span className="brand-tagline">Where Careers Take Off</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
