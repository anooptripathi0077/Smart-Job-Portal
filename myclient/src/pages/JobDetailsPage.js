import React, { useState, useEffect } from 'react';
import axios from 'axios';
import JobApplyForm from '../components/JobApplyForm.js'; // Form you posted earlier
import { useParams, useNavigate } from 'react-router-dom';

export default function JobDetailsPage({ user }) {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchJob() {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/api/jobs/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setJob(res.data);

      // Check if already applied
      const applRes = await axios.get('/api/applications/my', { headers: { Authorization: `Bearer ${token}` } });
      if (applRes.data.some(app => app.job._id === id)) setAlreadyApplied(true);
    }
    fetchJob();
  }, [id]);

// const handleApply = async (payload) => {
//   const token = localStorage.getItem('token');
//   try {
//     const formData = new FormData();
//     // formData.append('resume', payload.resume);
//     // if (payload.coverLetter) formData.append('coverLetter', payload.coverLetter);

//     await axios.post(`/api/applications/${id}`, formData, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'multipart/form-data',
//       },
//     });
    
//     alert('Application submitted!');
//     navigate('/my-applications');
//   } catch (error) {
//     alert(error.response?.data?.message || 'Error applying!');
//   }
// };

// const handleApply = async (payload) => {
//   const token = localStorage.getItem('token');
//   await axios.post(`/api/applications/${id}`, {
//     responses: payload.responses,
//     resumeUrl: payload.resumeUrl // this field should be exact Cloudinary URL
//   }, {
//     headers: { Authorization: `Bearer ${token}` }
//   });
// };
const handleApply = async (payload) => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please login first');
    return;
  }
  try {
    await axios.post(`/api/applications/${id}`, {
      responses: payload.responses,
      resumeUrl: payload.resumeUrl,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert('Application submitted!');
    navigate('/my-applications');
  } catch (error) {
    alert(error.response?.data?.message || 'Error applying!');
  }
};





  if (!job) return <div>Loading job...</div>;
  if (alreadyApplied) return <div style={{ color: 'green', fontWeight: 500 }}>You have already applied for this job.</div>;

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', color: '#012b43' }}>
      <h3>{job.title}</h3>
      <p>{job.description}</p>
      <JobApplyForm job={job} onApply={handleApply} />
    </div>
  );
}
// /*
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useParams, useNavigate } from 'react-router-dom';

// function JobApplyForm({ job, onApply, uploading }) {
//   const [resume, setResume] = useState(null);
//   const [coverLetter, setCoverLetter] = useState('');
//   const [responses, setResponses] = useState({});

//   const handleChange = (e, field) => {
//     setResponses(prev => ({ ...prev, [field]: e.target.value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // Ensure all dynamic questions are answered
//     if (job.questions && job.questions.length > 0) {
//       for (let q of job.questions) {
//         if (!responses[q] || responses[q].trim() === '') {
//           return alert(`Please answer: ${q}`);
//         }
//       }
//     }

//     if (!resume) return alert('Please upload your resume.');

//     onApply({ resume, coverLetter, responses });
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       {/* Dynamic questions */}
//       {job.questions && job.questions.length > 0 && job.questions.map((q, idx) => (
//         <div key={idx} style={{ marginBottom: '10px' }}>
//           <label>{q}</label>
//           <input
//             type="text"
//             value={responses[q] || ''}
//             onChange={(e) => handleChange(e, q)}
//             style={{ width: '100%' }}
//             required
//           />
//         </div>
//       ))}

//       {/* Cover letter */}
//       <div style={{ marginBottom: '10px' }}>
//         <label>Cover Letter (optional)</label>
//         <textarea
//           value={coverLetter}
//           onChange={(e) => setCoverLetter(e.target.value)}
//           placeholder="Write your cover letter here"
//           rows={4}
//           style={{ width: '100%' }}
//         />
//       </div>

//       {/* Resume */}
//       <div style={{ marginBottom: '10px' }}>
//         <label>Resume (PDF/DOC/DOCX)</label>
//         <input
//           type="file"
//           accept=".pdf,.doc,.docx"
//           onChange={(e) => setResume(e.target.files[0])}
//           required
//         />
//       </div>

//       <button type="submit" disabled={uploading}>
//         {uploading ? 'Uploading...' : 'Apply'}
//       </button>
//     </form>
//   );
// }

// export default function JobDetailsPage({ user }) {
//   const { id } = useParams();
//   const [job, setJob] = useState(null);
//   const [alreadyApplied, setAlreadyApplied] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     async function fetchJob() {
//       const token = localStorage.getItem('token');
//       try {
//         const res = await axios.get(`/api/jobs/${id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setJob(res.data);

//         // Check if already applied
//         const applRes = await axios.get('/api/applications/my', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (applRes.data.some(app => app.job._id === id)) setAlreadyApplied(true);
//       } catch (err) {
//         console.error(err);
//       }
//     }
//     fetchJob();
//   }, [id]);

//   const uploadToCloudinary = async (file) => {
//     const url = 'https://api.cloudinary.com/v1_1/ddifzvr1c/auto/upload';
//     const form = new FormData();
//     form.append('file', file);
//     form.append('upload_preset', 'blog_upload'); // your preset
//     const res = await fetch(url, { method: 'POST', body: form });
//     const data = await res.json();
//     return data.secure_url;
//   };

//   const handleApply = async (payload) => {
//     if (!payload.resume) return alert('Please upload your resume.');
//     const token = localStorage.getItem('token');
//     setUploading(true);

//     try {
//       // Upload resume
//       const resumeUrl = await uploadToCloudinary(payload.resume);

//       // Send all data to backend
//       await axios.post(
//         `/api/applications/${id}`,
//         {
//           resumeUrl,
//           coverLetter: payload.coverLetter || '',
//           responses: payload.responses || {},
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       alert('Application submitted!');
//       navigate('/my-applications');
//     } catch (err) {
//       console.error(err);
//       alert(err.response?.data?.message || 'Error applying!');
//     } finally {
//       setUploading(false);
//     }
//   };

//   if (!job) return <div>Loading job...</div>;
//   if (alreadyApplied) return <div style={{ color: 'green', fontWeight: 500 }}>You have already applied for this job.</div>;

//   return (
//     <div style={{ maxWidth: 700, margin: '40px auto', color: '#012b43' }}>
//       <h3>{job.title}</h3>
//       <p>{job.description}</p>
//       <JobApplyForm job={job} onApply={handleApply} uploading={uploading} />
//     </div>
//   );
// }

// */ 