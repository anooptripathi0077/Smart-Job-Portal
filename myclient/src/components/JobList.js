// import React from 'react';
// import './Recruitment.css';

// import { Link } from 'react-router-dom';

// export default function JobList({ jobs }) {
//   return (
//     <div>
//       {jobs.map(job => (
//         <div key={job._id} className="job-list-card">
//           <h3>{job.title}</h3>
//           <p>{job.description}</p>
//           <Link to={`/jobs/${job._id}`}>Details / Apply</Link>
//         </div>
//       ))}
//     </div>
//   );
// }
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function JobList({ onSelectJob }) {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    axios.get('/api/jobs')
      .then(res => setJobs(res.data))
      .catch(() => setJobs([]));
  }, []);

  if (jobs.length === 0) {
    return <div>No jobs found</div>;
  }

  return (
    <ul>
      {jobs.map(job => (
        <li key={job._id} onClick={() => onSelectJob(job._id)}>
          <h3>{job.title}</h3>
          <p>{job.description}</p>
          <p>Recruiter: {job.recruiter?.name}</p>
        </li>
      ))}
    </ul>
  );
}
