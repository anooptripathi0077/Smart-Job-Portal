import React from 'react';
import './Recruitment.css';

export default function JobApplicationList({ applications = [], onStatusChange }) {
  if (!applications || applications.length === 0) return <div>No applications found.</div>;

  return (
    <div>
      <h4>Applications Received ({applications.length})</h4>
      {applications.map(app => (
        <div key={app._id} className="app-card">
          <p>
            <strong>{app.applicant.name}</strong> | Status: {app.status}
            {/* ✅ View Resume Button */}
            { (
              <a
                href={app.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="view-resume-btn"
                style={{
                  display: 'inline-block',
                  padding: '6px 12px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  marginLeft: '10px'
                }}
              >
                View Resume
              </a>
            )}
          </p>

          <div>
            {Object.entries(app.responses || {}).map(([k, v]) => (
              <div key={k}><b>{k}:</b> {v}</div>
            ))}
          </div>

          <div>
            <select
              value={app.status}
              onChange={e => onStatusChange(app._id, e.target.value)}
            >
              {['Applied', 'Shortlisted', 'Rejected', 'Selected'].map(s => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}
