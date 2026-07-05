// // src/pages/ProfilePage.js
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './ProfilePage.css';

// const ProfilePage = () => {
//   const [profile, setProfile] = useState(null);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const res = await axios.get('/api/auth/profile', {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         setProfile(res.data);
//       } catch {
//         setError('Failed to load profile');
//       }
//     };
//     fetchProfile();
//   }, []);

//   if (error) return <div className="error-message">{error}</div>;
//   if (!profile) return <div className="loading-message">Loading profile...</div>;

//   return (
//     <div className="profile-page">
//       <header className="profile-header">
//         <h1>{profile.name}</h1>
//         <p className="profile-email">{profile.email}</p>
//         <p className="profile-role">{profile.role.toUpperCase()}</p>
//       </header>

//       <main className="profile-main">
//         {profile.profilePicUrl && (
//           <div className="profile-picture">
//             <img src={profile.profilePicUrl} alt={`${profile.name}'s profile`} />
//           </div>
//         )}

//         <section className="profile-section">
//           <h2>General Information</h2>
//           <div className="section-content">
//             {profile.role === 'student' ? (
//               <>
//                 <p><strong>College:</strong> {profile.college || 'Not specified'}</p>
//                 <p><strong>Branch:</strong> {profile.branch || 'Not specified'}</p>
//                 <p><strong>Current Year:</strong> {profile.currentYear || 'Not specified'}</p>
//               </>
//             ) : (
//               <>
//                 <p><strong>Company:</strong> {profile.company || 'Not specified'}</p>
//                 <p><strong>Position:</strong> {profile.position || 'Not specified'}</p>
//                 <p><strong>Contact:</strong> {profile.contact || 'Not specified'}</p>
//               </>
//             )}
//           </div>
//         </section>

//         {profile.role === 'student' && (
//           <>
//             <section className="profile-section">
//               <h2>Skills</h2>
//               <div className="section-content">
//                 {profile.skills && profile.skills.length > 0 ? (
//                   <ul className="skill-list">
//                     {profile.skills.map((skill, index) => (
//                       <li key={index}>{skill}</li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <p>No skills listed.</p>
//                 )}
//               </div>
//             </section>

//             <section className="profile-section">
//               <h2>Projects</h2>
//               <div className="section-content">
//                 {profile.projects && profile.projects.length > 0 ? (
//                   profile.projects.map((project, index) => (
//                     <div key={index} className="project-item">
//                       <h3>{project.title}</h3>
//                       <p>{project.description}</p>
//                       {project.techStack && project.techStack.length > 0 && (
//                         <p><em>Technologies: {project.techStack.join(', ')}</em></p>
//                       )}
//                       {project.link && (
//                         <p><a href={project.link} target="_blank" rel="noopener noreferrer">Project Link</a></p>
//                       )}
//                     </div>
//                   ))
//                 ) : (
//                   <p>No projects listed.</p>
//                 )}
//               </div>
//             </section>
//           </>
//         )}

//         {profile.role === 'recruiter' && profile.companyProfile && (
//           <section className="profile-section">
//             <h2>Company Profile</h2>
//             <div className="section-content">
//               <p>{profile.companyProfile}</p>
//             </div>
//           </section>
//         )}
//       </main>
//     </div>
//   );
// };

// export default ProfilePage;
// src/pages/ProfilePage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiEdit, FiSave, FiX, FiPlus, FiTrash2, FiUser, FiBriefcase, FiList, FiGlobe } from 'react-icons/fi'; // Added more icons
import './ProfilePage.css';
import './BlogPage.css';

import UserBlogSection from '../components/UserBlogSection.js';


const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [editingField, setEditingField] = useState(null); // e.g., 'college', 'company', 'companyProfile'
  const [fieldValues, setFieldValues] = useState({
    college: '',
    branch: '',
    currentYear: '',
    // Recruiter specific fields
    company: '',
    position: '',
    contact: '',
    companyProfile: ''
  });
  const [newSkill, setNewSkill] = useState('');
  const [newProject, setNewProject] = useState({ title: '', description: '', techStack: '', link: '' });
  const [editingProjectIndex, setEditingProjectIndex] = useState(null); // null for no edit, -1 for adding new
  const [projectEdits, setProjectEdits] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/auth/profile', { headers: { Authorization: `Bearer ${token}` } });
        setProfile(res.data);

        // Initialize fieldValues based on the user's role
        if (res.data.role === 'student') {
          setFieldValues({
            college: res.data.branch ||'' ,
            branch: res.data.college || '',
            currentYear: res.data.currentYear || '',
            company: '', position: '', contact: '', companyProfile: '' // Clear recruiter fields
          });
        } else if (res.data.role === 'recruiter') {
          setFieldValues({
            college: '', branch: '', currentYear: '', // Clear student fields
            company: res.data.company || '',
            position: res.data.position || '',
            contact: res.data.contact || '',
            companyProfile: res.data.companyProfile || ''
          });
        }
      } catch (err) {
        setError('Failed to load profile');
        console.error("Profile fetch error:", err);
      }
    };
    fetchProfile();
  }, []);

  if (error) return <div className="error-message">{error}</div>;
  if (!profile) return <div className="loading-message">Loading profile...</div>;

  const token = localStorage.getItem('token');

  const handleFieldChange = e => setFieldValues({ ...fieldValues, [e.target.name]: e.target.value });

  const saveField = async (fieldName) => {
    try {
      const updateData = { [fieldName]: fieldValues[fieldName] };
      const res = await axios.put('/api/auth/profile', updateData, { headers: { Authorization: `Bearer ${token}` } });
      setProfile(res.data);
      setEditingField(null);
    } catch (err) {
      setError('Failed to save changes');
      console.error("Save field error:", err);
    }
  };

  const cancelEdit = () => {
    // Reset fieldValues to current profile data based on role
    if (profile.role === 'student') {
      setFieldValues(prev => ({
        ...prev,
        college: profile.college || '',
        branch: profile.branch || '',
        currentYear: profile.currentYear || '',
      }));
    } else if (profile.role === 'recruiter') {
      setFieldValues(prev => ({
        ...prev,
        company: profile.company || '',
        position: profile.position || '',
        contact: profile.contact || '',
        companyProfile: profile.companyProfile || ''
      }));
    }
    setEditingField(null);
  };

  const addSkill = async () => {
    try {
      const skillTrimmed = newSkill.trim();
      if (skillTrimmed && !profile.skills.includes(skillTrimmed)) {
        const updatedSkills = [...profile.skills, skillTrimmed];
        const res = await axios.put('/api/auth/profile', { skills: updatedSkills }, { headers: { Authorization: `Bearer ${token}` } });
        setProfile(res.data);
        setNewSkill('');
      }
    } catch (err) {
      setError('Failed to add skill');
      console.error("Add skill error:", err);
    }
  };

  const removeSkill = async (skillToRemove) => {
    try {
      const updatedSkills = profile.skills.filter(sk => sk !== skillToRemove);
      const res = await axios.put('/api/auth/profile', { skills: updatedSkills }, { headers: { Authorization: `Bearer ${token}` } });
      setProfile(res.data);
    } catch (err) {
      setError('Failed to remove skill');
      console.error("Remove skill error:", err);
    }
  };

  const handleProjectInputChange = e => {
    const { name, value } = e.target;
    if (editingProjectIndex === -1) {
      // Adding a new project
      setNewProject(prev => ({ ...prev, [name]: value }));
    } else if (editingProjectIndex !== null) {
      // Editing an existing project
      setProjectEdits(prev => ({ ...prev, [name]: value }));
    }
  };

  const addProject = async () => {
    if (!newProject.title.trim()) return;
    try {
      const newProj = {
        title: newProject.title.trim(),
        description: newProject.description.trim(),
        techStack: newProject.techStack.split(',').map(s => s.trim()).filter(Boolean),
        link: newProject.link.trim(),
      };
      const updatedProjects = [...(profile.projects || []), newProj];
      const res = await axios.put('/api/auth/profile', { projects: updatedProjects }, { headers: { Authorization: `Bearer ${token}` } });
      setProfile(res.data);
      setNewProject({ title: '', description: '', techStack: '', link: '' });
      setEditingProjectIndex(null); // Exit add mode
    } catch (err) {
      setError('Failed to add project');
      console.error("Add project error:", err);
    }
  };

  const editProject = index => {
    setEditingProjectIndex(index);
    setProjectEdits({
      ...profile.projects[index],
      techStack: profile.projects[index].techStack ? profile.projects[index].techStack.join(', ') : '',
    });
  };

  const saveProject = async () => {
    try {
      const updatedProjects = [...profile.projects];
      updatedProjects[editingProjectIndex] = {
        title: projectEdits.title,
        description: projectEdits.description,
        techStack: projectEdits.techStack.split(',').map(s => s.trim()).filter(Boolean),
        link: projectEdits.link,
      };
      const res = await axios.put('/api/auth/profile', { projects: updatedProjects }, { headers: { Authorization: `Bearer ${token}` } });
      setProfile(res.data);
      setEditingProjectIndex(null);
      setProjectEdits({});
    } catch (err) {
      setError('Failed to save project');
      console.error("Save project error:", err);
    }
  };

  const cancelProjectEdit = () => {
    setEditingProjectIndex(null);
    setProjectEdits({});
    setNewProject({ title: '', description: '', techStack: '', link: '' }); // Clear new project form too
  };

  const removeProject = async index => {
    try {
      const updatedProjects = [...profile.projects];
      updatedProjects.splice(index, 1);
      const res = await axios.put('/api/auth/profile', { projects: updatedProjects }, { headers: { Authorization: `Bearer ${token}` } });
      setProfile(res.data);
    } catch (err) {
      setError('Failed to remove project');
      console.error("Remove project error:", err);
    }
  };

  return (
    <div className="profile-page">
      <header className="profile-header">
        <h1>{profile.name}</h1>
        <p className="profile-email">{profile.email}</p>
        <p className="profile-role">{profile.role.toUpperCase()}</p>
        <p className="profile-followers">  Followers: {profile.followers?.length ?? 0}</p>
      </header>

      {profile.profilePicUrl && (
        <div className="profile-picture">
          <img src={profile.profilePicUrl} alt={`${profile.name}'s profile`} />
        </div>
      )}

      {/* Profile Sections */}
      <div className="profile-main"> {/* Added a main content wrapper for sections */}
        <section className="profile-section">
          <h2><FiUser className="section-icon" /> General Information</h2>
          {profile.role === 'student' ? (
            <div className="section-content editable-field">
              {['college', 'branch', 'currentYear'].map(field => (
                <p key={field}>
                  <strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong>{' '}
                  {editingField === field ? (
                    <>
                      <input
                        type={field === 'currentYear' ? 'number' : 'text'}
                        name={field}
                        value={fieldValues[field]}
                        onChange={handleFieldChange}
                      />
                      <button onClick={() => saveField(field)}><FiSave /></button>
                      <button onClick={cancelEdit}><FiX /></button>
                    </>
                  ) : (
                    <>
                      {profile[field] || 'Not specified'}{' '}
                      <FiEdit className="edit-icon" onClick={() => setEditingField(field)} />
                    </>
                  )}
                </p>
              ))}
            </div>
          ) : ( // Recruiter specific fields
            <div className="section-content editable-field">
              {['company', 'position', 'contact'].map(field => (
                <p key={field}>
                  <strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong>{' '}
                  {editingField === field ? (
                    <>
                      <input
                        type="text"
                        name={field}
                        value={fieldValues[field]}
                        onChange={handleFieldChange}
                      />
                      <button onClick={() => saveField(field)}><FiSave /></button>
                      <button onClick={cancelEdit}><FiX /></button>
                    </>
                  ) : (
                    <>
                      {profile[field] || 'Not specified'}{' '}
                      <FiEdit className="edit-icon" onClick={() => setEditingField(field)} />
                    </>
                  )}
                </p>
              ))}
            </div>
          )}
        </section>

        {profile.role === 'student' && (
          <section className="profile-section">
            <h2><FiList className="section-icon" /> Skills <FiPlus className="add-icon" onClick={() => document.getElementById('newSkillInput').focus()} /></h2>
            <div className="section-content skill-editor">
              <ul className="skill-list">
                {profile.skills && profile.skills.length > 0 ? profile.skills.map((skill, i) => (
                  <li key={i}>
                    {skill}{' '}
                    <FiTrash2 className="delete-icon" onClick={() => removeSkill(skill)} />
                  </li>
                )) : <p>No skills listed.</p>}
              </ul>
              <input
                id="newSkillInput"
                type="text"
                placeholder="Add new skill"
                value={newSkill}
                onChange={e => setNewSkill(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addSkill()}
                className="skill-input"
              />
              <button onClick={addSkill} disabled={!newSkill.trim()}>Add Skill</button>
            </div>
          </section>
        )}

        {profile.role === 'student' && (
          <section className="profile-section">
            <h2><FiGlobe className="section-icon" /> Projects <FiPlus className="add-icon" onClick={() => setEditingProjectIndex(-1)} /></h2>
            <div className="section-content project-editor">
              {profile.projects && profile.projects.length > 0 ? (
                profile.projects.map((project, i) => (
                  <div key={i} className="project-item">
                    {editingProjectIndex === i ? (
                      <>
                        <input name="title" value={projectEdits.title || ''} onChange={handleProjectInputChange} placeholder="Title" />
                        <textarea name="description" value={projectEdits.description || ''} onChange={handleProjectInputChange} placeholder="Description" />
                        <input name="techStack" value={projectEdits.techStack || ''} onChange={handleProjectInputChange} placeholder="Tech Stack (comma separated)" />
                        <input name="link" value={projectEdits.link || ''} onChange={handleProjectInputChange} placeholder="Project Link" />
                        <div className="project-actions">
                          <button onClick={saveProject}><FiSave /> Save</button>
                          <button onClick={cancelProjectEdit}><FiX /> Cancel</button>
                        </div>
                      </>
                    ) : (
                      <>
                        <h3>{project.title}</h3>
                        <p>{project.description}</p>
                        {project.techStack && project.techStack.length > 0 && <p><em>Technologies: {project.techStack.join(', ')}</em></p>}
                        {project.link && <p><a href={project.link} target="_blank" rel="noopener noreferrer">Project Link</a></p>}
                        <FiEdit className="edit-icon" onClick={() => editProject(i)} />
                        <FiTrash2 className="delete-icon" onClick={() => removeProject(i)} />
                      </>
                    )}
                  </div>
                ))
              ) : (
                <p>No projects listed.</p>
              )}

              {editingProjectIndex === -1 && (
                <div className="project-item add-new-project">
                  <h3>Add New Project</h3>
                  <input name="title" value={newProject.title} onChange={handleProjectInputChange} placeholder="Title" />
                  <textarea name="description" value={newProject.description} onChange={handleProjectInputChange} placeholder="Description" />
                  <input name="techStack" value={newProject.techStack} onChange={handleProjectInputChange} placeholder="Tech Stack (comma separated)" />
                  <input name="link" value={newProject.link} onChange={handleProjectInputChange} placeholder="Project Link" />
                  <div className="project-actions">
                    <button onClick={addProject} disabled={!newProject.title.trim()}><FiPlus /> Add Project</button>
                    <button onClick={cancelProjectEdit}><FiX /> Cancel</button>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Recruiter Company Profile section with edit functionality */}
        {profile.role === 'recruiter' && (
          <section className="profile-section">
            <h2><FiBriefcase className="section-icon" /> Company Profile</h2>
            <div className="section-content editable-field">
              <p>
                {editingField === 'companyProfile' ? (
                  <>
                    <textarea
                      name="companyProfile"
                      value={fieldValues.companyProfile}
                      onChange={handleFieldChange}
                      rows="5"
                      placeholder="Describe your company profile"
                    />
                    <button onClick={() => saveField('companyProfile')}><FiSave /></button>
                    <button onClick={cancelEdit}><FiX /></button>
                  </>
                ) : (
                  <>
                    {profile.companyProfile || 'Not specified'}{' '}
                    <FiEdit className="edit-icon" onClick={() => setEditingField('companyProfile')} />
                  </>
                )}
              </p>
            </div>
          </section>
        )}
      </div> {/* End profile-main */}
<div className="blog-feed-container">
  <h2>{profile.name}'s Posts</h2>
  <UserBlogSection userId={profile._id} user={profile} />
</div>

    </div>
  );
};

export default ProfilePage;