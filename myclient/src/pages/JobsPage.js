import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function JobsPage({ user }) {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    async function fetchJobs() {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/jobs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(res.data);
    }
    fetchJobs();
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', color: '#012b43' }}>
      <h2>Available Jobs</h2>
      {jobs.map(job => (
        <div key={job._id} style={{ margin: '17px 0', padding: '15px', border: '1px solid #ccc', borderRadius: 8 }}>
          <h4>{job.title}</h4>
          <p>{job.description}</p>
          <p>
            Posted by: {job.recruiter?.name || "Recruiter"}
          </p>
          {user?.role === 'recruiter' ? (
            <Link to={`/jobs/${job._id}/applications`} style={{ color: '#004a99', fontWeight: '700', marginLeft: 8 }}>View Applications</Link>
          ) : (
            <Link to={`/jobs/${job._id}`} style={{ color: 'green', fontWeight: '700', marginLeft: 8 }}>Apply</Link>
          )}
        </div>
      ))}
    </div>
  );
}
