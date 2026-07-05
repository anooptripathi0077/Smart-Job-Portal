import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const UserSearchPage = () => {
  const [role, setRole] = useState('student');
  const [term, setTerm] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/users/search', {
        headers: { Authorization: `Bearer ${token}` },
        params: { term, role }
      });
      setResults(res.data);
      setError('');
    } catch {
      setError('Search failed');
    }
  };

  return (
    <div className="profile-section">
      <h2>Search {role === 'student' ? 'Students' : 'Recruiters'}</h2>
      <form onSubmit={handleSearch} style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Search by name or college"
          value={term}
          onChange={e => setTerm(e.target.value)}
          style={{ marginRight: 8, padding: '6px' }}
        />
        <select value={role} onChange={e => setRole(e.target.value)} style={{ marginRight: 8 }}>
          <option value="student">Student</option>
          <option value="recruiter">Recruiter</option>
        </select>
        <button type="submit">Search</button>
      </form>
      {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}
      <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
        {results.map(u => (
          <li key={u._id} style={{ margin: '18px 0', background: '#f9fbfd', borderRadius: 10, padding: 12 }}>
            <Link to={`/user/${u._id}`}>
              <strong>{u.name}</strong>
              {u.college && <span style={{ color: '#0073e6' }}> &middot; {u.college}</span>}
              <span style={{ marginLeft: 16, color: '#666' }}>{u.role}</span>
              <br />
              <span style={{ fontSize: '0.98rem', color: '#333' }}>{u.email}</span>
            </Link>
          </li>
        ))}
      </ul>
      {results.length === 0 && term && <p>No users found.</p>}
    </div>
  );
};

export default UserSearchPage;
