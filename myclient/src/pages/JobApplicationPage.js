import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import JobApplicationList from '../components/JobApplicationList.js';

export default function JobApplicationsPage({ user }) {
  const { id } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchApplications() {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(`/api/jobs/${id}/applications`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setApplications(res.data);
      } catch (e) {
        setApplications([]);
      }
      setLoading(false);
    }
    fetchApplications();
  }, [id]);

  const handleStatusChange = async (appId, newStatus) => {
    const token = localStorage.getItem('token');
    await axios.patch(`/api/applications/${appId}/status`, { status: newStatus }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setApplications(apps => apps.map(app => app._id === appId ? { ...app, status: newStatus } : app));
  };

  if (loading) return <div>Loading applications...</div>;
  return <JobApplicationList applications={applications} onStatusChange={handleStatusChange} />;
}
