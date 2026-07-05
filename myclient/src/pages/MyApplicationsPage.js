import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function MyApplicationsPage({ user }) {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    async function fetchApplications() {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/applications/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(res.data);
    }
    fetchApplications();
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', color: '#012b43' }}>
      <h2>My Applications</h2>
      {applications.length === 0
        ? <div>No applications submitted yet.</div>
        : applications.map(app => (
          <div key={app._id} style={{ margin: '17px 0', padding: '15px', border: '1px solid #ccc', borderRadius: 8 }}>
            <h4>{app.job.title}</h4>
            <p>Status: <span style={{ fontWeight: 700 }}>{app.status}</span></p>
            <a href={app.resumeUrl} target="_blank" rel="noreferrer">Resume</a>
            <div>
              <strong>Responses:</strong>
              {Object.entries(app.responses || {}).map(([k, v]) =>
                <div key={k}><b>{k}:</b> {v}</div>
              )}
            </div>
          </div>
        ))
      }
    </div>
  );
}
