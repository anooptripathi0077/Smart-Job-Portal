import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import UserBlogSection from '../components/UserBlogSection.js';

const PublicUserProfilePage = ({ socket }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('You must be logged in to view profiles');
          return;
        }
        const res = await axios.get(`/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error(err);
        setError('User not found');
      }
    };
    fetchUser();
  }, [id]);

  const currentUserId = localStorage.getItem('userId') || null;
  const isCurrentUser = Boolean(currentUserId) && String(user?._id) === String(currentUserId);

  const handleMessageClick = () => {
    if (!user) return;
    navigate(`/inbox?user=${user._id}`);
  };

  if (error) return <div className="error-message">{error}</div>;
  if (!user) return <div className="loading-message">Loading user profile...</div>;

  return (
    <div className="profile-page" style={{ maxWidth: 600, margin: '20px auto', padding: 20 }}>
      <header className="profile-header" style={{ marginBottom: 20 }}>
        <h1>{user.name}</h1>
        <p className="profile-email">{user.email}</p>
        <p className="profile-role">{user.role?.toUpperCase()}</p>
        <p className="profile-followers">Followers: {user.followers?.length ?? 0}</p>
      </header>

      <main className="profile-main">
        {user.role === 'student' && (
          <>
            {user.college && <div><strong>College:</strong> {user.college}</div>}

            {!isCurrentUser && socket && (
              <button
                onClick={handleMessageClick}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#0073e6",
                  color: "#fff",
                  border: "none",
                  borderRadius: 5,
                  fontWeight: "bold",
                  cursor: "pointer",
                  margin: "10px 0"
                }}
              >
                Message
              </button>
            )}

            {user.branch && <div><strong>Branch:</strong> {user.branch}</div>}
            {user.skills?.length > 0 && <div><strong>Skills:</strong> {user.skills.join(', ')}</div>}

            {user.projects?.length > 0 && (
              <div>
                <strong>Projects:</strong>
                <ul>
                  {user.projects.map((p, idx) => (
                    <li key={idx}>
                      <strong>{p.title}</strong> {p.techStack && `(${p.techStack.join(', ')})`}
                      <br />
                      {p.description}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <UserBlogSection userId={user._id} user={user} />
          </>
        )}

        {user.role === 'recruiter' && (
          <>
            {user.company && <div><strong>Company:</strong> {user.company}</div>}
            {(user.position || user.contact) && (
              <div>
                {user.position && <span><strong>Position:</strong> {user.position} </span>}
                {user.contact && <span><strong>Contact:</strong> {user.contact}</span>}
              </div>
            )}
            {user.companyProfile && <div><strong>Company Profile:</strong><div>{user.companyProfile}</div></div>}
          </>
        )}
      </main>
    </div>
  );
};

export default PublicUserProfilePage;




// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useParams, useNavigate } from 'react-router-dom';
// import UserBlogSection from '../components/UserBlogSection.js';

// const PublicUserProfilePage = ({ socket }) => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [user, setUser] = useState(null);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//           setError('You must be logged in to view profiles');
//           return;
//         }
//         const res = await axios.get(`/api/users/${id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setUser(res.data);
//       } catch (err) {
//         console.error(err);
//         setError('User not found');
//       }
//     };
//     fetchUser();
//   }, [id]);

//   const currentUserId = localStorage.getItem('userId') || null;
//   const isCurrentUser = Boolean(currentUserId) && String(user?._id) === String(currentUserId);

//   const handleMessageClick = () => {
//     if (!user) return;
//     // Redirect to inbox with query param to open chat with this user
//     navigate(`/inbox?user=${user._id}`);
//   };

//   if (error) return <div className="error-message">{error}</div>;
//   if (!user) return <div className="loading-message">Loading user profile...</div>;

//   return (
//     <div className="profile-page">
//       <header className="profile-header">
//         <h1>{user.name}</h1>
//         <p className="profile-email">{user.email}</p>
//         <p className="profile-role">{user.role?.toUpperCase()}</p>
//         <p className="profile-followers">Followers: {user.followers?.length ?? 0}</p>
//       </header>

//       <main className="profile-main">
//         {user.role === 'student' && (
//           <>
//             {user.college && <div><strong>College:</strong> {user.college}</div>}

//             {!isCurrentUser && socket && (
//               <button
//                 onClick={handleMessageClick}
//                 style={{
//                   padding: "10px 20px",
//                   backgroundColor: "#0073e6",
//                   color: "#fff",
//                   border: "none",
//                   borderRadius: 5,
//                   fontWeight: "bold",
//                   cursor: "pointer",
//                   margin: "10px 0"
//                 }}
//               >
//                 Message
//               </button>
//             )}

//             {user.branch && <div><strong>Branch:</strong> {user.branch}</div>}
//             {user.skills?.length > 0 && <div><strong>Skills:</strong> {user.skills.join(', ')}</div>}
//             {user.projects?.length > 0 && (
//               <div>
//                 <strong>Projects:</strong>
//                 <ul>
//                   {user.projects.map((p, idx) => (
//                     <li key={idx}>
//                       <strong>{p.title}</strong> {p.techStack && `(${p.techStack.join(', ')})`}
//                       <br />
//                       {p.description}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}

//             <UserBlogSection userId={user._id} user={user} />
//           </>
//         )}

//         {user.role === 'recruiter' && (
//           <>
//             {user.company && <div><strong>Company:</strong> {user.company}</div>}
//             {(user.position || user.contact) && (
//               <div>
//                 {user.position && <span><strong>Position:</strong> {user.position} </span>}
//                 {user.contact && <span><strong>Contact:</strong> {user.contact}</span>}
//               </div>
//             )}
//             {user.companyProfile && <div><strong>Company Profile:</strong><div>{user.companyProfile}</div></div>}
//           </>
//         )}
//       </main>
//     </div>
//   );
// };

// export default PublicUserProfilePage;
