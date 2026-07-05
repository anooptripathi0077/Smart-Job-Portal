// import React, { useState } from 'react';
// import './Recruitment.css';

// const uploadToCloudinary = async (file) => {
//   let resourceType = 'image';
//   if (
//     file.type === 'application/pdf' ||
//     file.type === 'application/msword' ||
//     file.type ===
//       'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
//   ) {
//     resourceType = 'raw'; // PDFs/DOCs
//   }

//   const url = `https://api.cloudinary.com/v1_1/ddifzvr1c/${resourceType}/upload`;
//   const form = new FormData();
//   form.append('file', file);
//   form.append('upload_preset', 'resume_upload'); // your unsigned preset

//   const res = await fetch(url, { method: 'POST', body: form });
//   const data = await res.json();
//   if (!data.secure_url) throw new Error('Upload failed');
//   return data.secure_url;
// };

// export default function JobApplyForm({ job, onApply }) {
//   const [responses, setResponses] = useState({});
//   const [resumeFile, setResumeFile] = useState(null);
//   const [resumeUrl, setResumeUrl] = useState('');
//   const [uploading, setUploading] = useState(false);

//   const handleFileChange = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     setResumeFile(file);
//     setUploading(true);
//     try {
//       const url = await uploadToCloudinary(file);
//       setResumeUrl(url);
//     } catch (err) {
//       alert('Upload failed. Check file type and preset.');
//       setResumeUrl('');
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!resumeUrl) return alert('Please upload a resume first');
//     onApply({ responses, resumeUrl });
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       {job.dynamicFields.map(f => (
//         <div key={f.label}>
//           <label>{f.label}{f.required && '*'}</label>
//           {f.fieldType === 'select' ? (
//             <select
//               required={f.required}
//               value={responses[f.label] || ''}
//               onChange={e => setResponses(r => ({ ...r, [f.label]: e.target.value }))}
//             >
//               <option value="">-- select --</option>
//               {f.options.map(opt => <option key={opt}>{opt}</option>)}
//             </select>
//           ) : f.fieldType === 'textarea' ? (
//             <textarea
//               required={f.required}
//               value={responses[f.label] || ''}
//               onChange={e => setResponses(r => ({ ...r, [f.label]: e.target.value }))}
//             />
//           ) : (
//             <input
//               type={f.fieldType}
//               required={f.required}
//               value={responses[f.label] || ''}
//               onChange={e => setResponses(r => ({ ...r, [f.label]: e.target.value }))}
//             />
//           )}
//         </div>
//       ))}

//       <div>
//         <label>Upload Resume (PDF/DOC) *</label>
//         <input
//           type="file"
//           accept=".pdf,.doc,.docx"
//           onChange={handleFileChange}
//           disabled={uploading}
//         />
//         {uploading && <span>Uploading...</span>}
//         {resumeUrl && (
//           <span>Uploaded! <a href={resumeUrl} target="_blank" rel="noopener noreferrer">View</a></span>
//         )}
//       </div>

//       <button type="submit" disabled={!resumeUrl || uploading}>Apply Now</button>
//     </form>
//   );
// }
import React, { useState } from 'react';
import './Recruitment.css';

// Upload helper (exactly like blog)
const uploadToCloudinary = async (file) => {
  const url = `https://api.cloudinary.com/v1_1/ddifzvr1c/image/upload`;
  const form = new FormData();
  form.append('file', file);
  form.append('upload_preset', 'resume_upload'); // your unsigned image preset

  const res = await fetch(url, { method: 'POST', body: form });
  const data = await res.json();
  if (!data.secure_url) throw new Error('Upload failed');
  return data.secure_url;
};

export default function JobApplyForm({ job, onApply }) {
  const [responses, setResponses] = useState({});
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreviewUrl(URL.createObjectURL(file));
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setImageUrl(url);
    } catch (err) {
      alert('Upload failed. Check file type and preset.');
      setImageUrl('');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!imageUrl) return alert('Please upload an image resume first');
    onApply({ responses, resumeUrl: imageUrl });
  };

  return (
    <form onSubmit={handleSubmit}>
      {job.dynamicFields.map(f => (
        <div key={f.label}>
          <label>{f.label}{f.required && '*'}</label>
          {f.fieldType === 'select' ? (
            <select
              required={f.required}
              value={responses[f.label] || ''}
              onChange={e => setResponses(r => ({ ...r, [f.label]: e.target.value }))}
            >
              <option value="">-- select --</option>
              {f.options.map(opt => <option key={opt}>{opt}</option>)}
            </select>
          ) : f.fieldType === 'textarea' ? (
            <textarea
              required={f.required}
              value={responses[f.label] || ''}
              onChange={e => setResponses(r => ({ ...r, [f.label]: e.target.value }))}
            />
          ) : (
            <input
              type={f.fieldType}
              required={f.required}
              value={responses[f.label] || ''}
              onChange={e => setResponses(r => ({ ...r, [f.label]: e.target.value }))}
            />
          )}
        </div>
      ))}

      <div>
        <label>Upload Resume (Image Only) *</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
        />
        {previewUrl && (
          <img src={previewUrl} alt="preview" style={{ maxHeight: 80, borderRadius: 8 }} />
        )}
        {uploading && <span>Uploading...</span>}
        {imageUrl && (
          <span>Uploaded! <a href={imageUrl} target="_blank" rel="noopener noreferrer">View</a></span>
        )}
      </div>

      <button type="submit" disabled={!imageUrl || uploading}>Apply Now</button>
    </form>
  );
}
