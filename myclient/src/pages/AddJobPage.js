import React from 'react';
import JobPostForm from '../components/JobPostForm.js';
import { useNavigate } from 'react-router-dom';

export default function AddJobPage({ user }) {
  const navigate = useNavigate();
  const handleJobPost = (newJob) => {
    alert(`Job posted successfully: ${newJob.title}`);
    navigate('/jobs'); // Redirect to jobs list after posting
  };

  const containerStyle = {
    maxWidth: '700px',
    margin: '40px auto',
    padding: '20px',
    backgroundColor: '#002244',
    borderRadius: '8px',
    color: 'white',
    boxShadow: '0 0 8px rgba(0, 0, 0, 0.7)',
  };

  const headingStyle = {
    textAlign: 'center',
    marginBottom: '20px',
    fontWeight: '700',
    fontSize: '1.8rem'
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Add New Job Posting</h2>
      <JobPostForm onPost={handleJobPost} />
    </div>
  );
}
