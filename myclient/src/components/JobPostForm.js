import React, { useState } from 'react';
import axios from 'axios';
import './Recruitment.css';


export default function JobPostForm({ onPost }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fields, setFields] = useState([]);
  const [newField, setNewField] = useState({ label: '', fieldType: 'text', required: false, options: '' });

  const handleAddField = () => {
    setFields([...fields, {
      ...newField,
      options: newField.options ? newField.options.split(',').map(s => s.trim()) : [],
    }]);
    setNewField({ label: '', fieldType: 'text', required: false, options: '' });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem('token');

  const formattedFields = fields.map(f => ({
    label: f.label,
    fieldType: f.fieldType,
    required: f.required,
    options: f.fieldType === 'select' ? (f.options || []) : [], // only for select
  }));

  const body = {
    title,
    description,
    dynamicFields: formattedFields,
    // recruiter is set in backend from authenticated user token
  };

  const res = await axios.post('/api/jobs', body, {
    headers: { Authorization: `Bearer ${token}` }
  });

  onPost && onPost(res.data);
  setTitle('');
  setDescription('');
  setFields([]);
};


  return (
    <form onSubmit={handleSubmit} className="job-post-form">
      <input required placeholder="Job Title" value={title} onChange={e=>setTitle(e.target.value)} />
      <textarea placeholder="Job Description" value={description} onChange={e=>setDescription(e.target.value)} />
      <hr />
      <h4>Custom Application Fields</h4>
      {fields.map((f,i)=>(
        <div key={i}>{f.label} ({f.fieldType}) {f.required && '*'} {f.options?.length>0 && `[${f.options.join(', ')}]`}</div>
      ))}
      <input required placeholder="Field Label" value={newField.label} onChange={e => setNewField({...newField, label: e.target.value})} />
      <select value={newField.fieldType} onChange={e => setNewField({...newField, fieldType: e.target.value})}>
        <option value="text">Text</option>
        <option value="email">Email</option>
        <option value="number">Number</option>
        <option value="textarea">Textarea</option>
        <option value="select">Select</option>
      </select>
      {newField.fieldType === 'select' &&
        <input placeholder="Options, comma separated" value={newField.options} onChange={e => setNewField({...newField, options: e.target.value})} />
      }
      <label>
        <input type="checkbox" checked={newField.required} onChange={e => setNewField({...newField, required: e.target.checked})}/>
        Required
      </label>
      <button type="button" onClick={handleAddField}>Add Field</button>
      <br/>
      <button type="submit">Post Job</button>
    </form>
  );
}
