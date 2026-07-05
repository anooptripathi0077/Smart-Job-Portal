// import React, { useEffect, useState, useRef } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import './BlogPage.css';

// const BlogPage = ({ user }) => {
//   const [posts, setPosts] = useState([]);
//   const [description, setDescription] = useState('');
//   const [mediaUrl, setMediaUrl] = useState('');
//   const [mediaType, setMediaType] = useState('image');
//   const [posting, setPosting] = useState(false);

//   useEffect(() => { loadPosts(); }, []);
//   const loadPosts = async () => {
//     const res = await axios.get('/api/blogs');
//     setPosts(res.data);
//   };

//   const handlePost = async e => {
//     e.preventDefault();
//     setPosting(true);
//     const token = localStorage.getItem('token');
//     try {
//       const res = await axios.post('/api/blogs', { description, mediaUrl, mediaType }, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setPosts([res.data, ...posts]);
//       setDescription(''); setMediaUrl('');
//     } catch {}
//     setPosting(false);
//   };

//   const handleLike = async id => {
//     const token = localStorage.getItem('token');
//     await axios.post(`/api/blogs/like/${id}`, {}, {
//       headers: { Authorization: `Bearer ${token}` }
//     });
//     await loadPosts();
//   };

//   const handleFollow = async (authorId, followed) => {
//     if (!user) return;
//     const token = localStorage.getItem('token');
//     if (!followed)
//       await axios.post(`/api/users/follow/${authorId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
//     else
//       await axios.post(`/api/users/unfollow/${authorId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
//     await loadPosts();
//   };

//   return (
//     <div className="blog-feed-container">
//       <h2>Blog Feed</h2>
//       {user && (
//         <form className="blog-post-form" onSubmit={handlePost}>
//           <select value={mediaType} onChange={e => setMediaType(e.target.value)}>
//             <option value="image">Image</option>
//             <option value="video">Video</option>
//           </select>
//           <input
//             type="url"
//             value={mediaUrl}
//             onChange={e => setMediaUrl(e.target.value)}
//             placeholder="Paste image or video URL"
//             required
//             style={{ flex: 2 }}
//           />
//           <textarea
//             value={description}
//             onChange={e => setDescription(e.target.value)}
//             placeholder="Description"
//             rows={2}
//             required
//             style={{ flex: 4 }}
//           />
//           <button type="submit" disabled={posting || !mediaUrl || !description}>Post</button>
//         </form>
//       )}
//       <ul className="blog-feed-list">
//         {posts.map(post => (
//           <li key={post._id} className="blog-feed-post">
//             <Link to={`/user/${post.author._id}`} className="author-link">
//               {post.author.profilePicUrl 
//                 ? <img src={post.author.profilePicUrl} alt="author" className="author-pic"/>
//                 : <div className="author-avatar">{post.author.name[0]}</div>
//               }
//               <span className="author-name">{post.author.name}</span>
//             </Link>
//             <button
//               className="follow-btn"
//               onClick={() => handleFollow(post.author._id, post.author.followers?.includes(user?._id))}
//               disabled={!user || post.author._id === user._id}
//               style={{ marginLeft: 10 }}>
//               {post.author.followers?.includes(user?._id) ? 'Unfollow' : 'Follow'}
//             </button>
//             <div className="blog-media">
//               {post.mediaType === 'image' ? (
//                 <img src={post.mediaUrl} alt="blog" className="blog-img" />
//               ) : (
//                 <video src={post.mediaUrl} controls className="blog-video" />
//               )}
//             </div>
//             <div className="post-content">{post.description}</div>
//             <div className="blog-meta-row">
//               <button
//                 className={`like-btn${user && post.likes.includes(user._id) ? ' liked' : ''}`}
//                 onClick={() => handleLike(post._id)}
//                 disabled={!user}>
//                 ♥ {post.likes.length}
//               </button>
//               <span className="post-date">{new Date(post.createdAt).toLocaleString()}</span>
//               <CommentSection post={post} user={user} />
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// // Comments
// function CommentSection({ post, user }) {
//   const [comments, setComments] = useState(post.comments || []);
//   const [newComment, setNewComment] = useState('');
//   const inputRef = useRef();

//   const handleComment = async e => {
//     e.preventDefault();
//     if (!newComment.trim()) return;
//     const token = localStorage.getItem('token');
//     const res = await axios.post(`/api/blogs/comment/${post._id}`, { text: newComment }, {
//       headers: { Authorization: `Bearer ${token}` }
//     });
//     setComments([...comments, res.data]);
//     setNewComment('');
//     inputRef.current.blur();
//   };

//   return (
//     <div className="blog-comments">
//       <ul className="comment-list">
//         {comments.map((cmt, idx) => (
//           <li key={idx} className="comment">
//             <span className="comment-user">{cmt.author?.name || 'User'}:</span> <span>{cmt.text}</span>
//           </li>
//         ))}
//       </ul>
//       {user && (
//         <form onSubmit={handleComment} className="comment-form">
//           <input
//             ref={inputRef}
//             value={newComment}
//             onChange={e => setNewComment(e.target.value)}
//             placeholder="Add comment"
//             maxLength={200}
//           />
//           <button type="submit">Post</button>
//         </form>
//       )}
//     </div>
//   );
// }

// export default BlogPage;


import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './BlogPage.css';

// Helper: upload to Cloudinary (replace config as needed)
const uploadToCloudinary = async (file) => {
  const resourceType = file.type.startsWith('video') ? 'video' : 'image';
  const url = `https://api.cloudinary.com/v1_1/ddifzvr1c/${resourceType}/upload`;
  const form = new FormData();
  form.append('file', file);
  form.append('upload_preset', 'blog_upload');

  const res = await fetch(url, { method: 'POST', body: form });
  const data = await res.json();
  return data.secure_url;
};

const BlogPage = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [mediaType, setMediaType] = useState('image');
  const [posting, setPosting] = useState(false);

  useEffect(() => { loadPosts(); }, []);

  const loadPosts = async () => {
    const res = await axios.get('/api/blogs');
    setPosts(res.data);
  };

  // File select and preview
  const handleFileChange = e => {
    const file = e.target.files[0];
    if (!file) {
      setSelectedFile(null);
      setPreviewUrl('');
      setMediaType('image');
      return;
    }
    setSelectedFile(file);
    setMediaType(file.type.startsWith('video') ? 'video' : 'image');
    setPreviewUrl(URL.createObjectURL(file));
  };

  // Post handler
  const handlePost = async e => {
    e.preventDefault();
    if (!selectedFile) return;
    setPosting(true);
    let mediaUrl = '';
    try {
      mediaUrl = await uploadToCloudinary(selectedFile);
      const token = localStorage.getItem('token');
      const res = await axios.post(
        '/api/blogs',
        { description, mediaUrl, mediaType },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts([res.data, ...posts]);
      setDescription('');
      setSelectedFile(null);
      setPreviewUrl('');
    } catch {}
    setPosting(false);
  };

  // Delete post
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await axios.delete(`/api/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setPosts(posts.filter(p => p._id !== id));
      }
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to delete post');
    }
  };

  const handleLike = async id => {
    const token = localStorage.getItem('token');
    await axios.post(`/api/blogs/like/${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    await loadPosts();
  };

  const handleFollow = async (authorId, followed) => {
    if (!user) return;
    const token = localStorage.getItem('token');
    if (!followed)
      await axios.post(`/api/users/follow/${authorId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
    else
      await axios.post(`/api/users/unfollow/${authorId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
    await loadPosts();
  };

  return (
    <div className="blog-feed-container">
      <h2>Blog Feed</h2>
      {user && (
        <form className="blog-post-form" onSubmit={handlePost}>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
          />
          {previewUrl && (
            mediaType === 'image'
              ? <img src={previewUrl} alt="preview" style={{ maxHeight: 80, borderRadius: 8 }} />
              : <video src={previewUrl} controls style={{ maxHeight: 80, borderRadius: 8 }} />
          )}
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Description"
            rows={2}
            required
            style={{ flex: 4 }}
          />
          <button type="submit" disabled={posting || !selectedFile || !description}>Post</button>
        </form>
      )}
      <ul className="blog-feed-list">
        {posts.map(post => (
          <li key={post._id} className="blog-feed-post">
            {user && post.author._id === user._id && (
              <button
                className="delete-post-btn"
                onClick={() => handleDelete(post._id)}
               style={{ float: "right", fontSize: "15px" }}
                title="Delete this post"
              >
                Delete
              </button>
            )}
            <Link to={`/user/${post.author._id}`} className="author-link">
              {post.author.profilePicUrl 
                ? <img src={post.author.profilePicUrl} alt="author" className="author-pic"/>
                : <div className="author-avatar">{post.author.name[0]}</div>
              }
              <span className="author-name">{post.author.name}</span>
            </Link>
            <button
              className="follow-btn"
              onClick={() => handleFollow(post.author._id, post.author.followers?.includes(user?._id))}
              disabled={!user || post.author._id === user._id}
              style={{ marginLeft: 10 }}>
              {post.author.followers?.includes(user?._id) ? 'Unfollow' : 'Follow'}
            </button>
            <div className="blog-media">
              {post.mediaType === 'image' ? (
                <img src={post.mediaUrl} alt="blog" className="blog-img" />
              ) : (
                <video src={post.mediaUrl} controls className="blog-video" />
              )}
            </div>
            <div className="post-content">{post.description}</div>
            <div className="blog-meta-row">
              <div >
                <button
                className={`like-btn${user && post.likes.includes(user._id) ? ' liked' : ''}`}
                onClick={() => handleLike(post._id)}
                disabled={!user}>
                ♥ {post.likes.length}
              </button>
              </div>
              <div ><span className="post-date">{new Date(post.createdAt).toLocaleString()}</span></div>
              <div  class="right"><CommentSection post={post} user={user} /></div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Comments component
function CommentSection({ post, user }) {
  const [comments, setComments] = useState(post.comments || []);
  const [newComment, setNewComment] = useState('');
  const inputRef = useRef();

  const handleComment = async e => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const token = localStorage.getItem('token');
    const res = await axios.post(`/api/blogs/comment/${post._id}`, { text: newComment }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setComments([...comments, res.data]);
    setNewComment('');
    inputRef.current.blur();
  };

  return (
    <div className="blog-comments">
  <ul className="comment-list">
    {comments.map((cmt, idx) => (
      <li key={idx} className="comment">
        <span className="comment-user">{cmt.author?.name || 'User'}:</span>
        <span>{cmt.text}</span>
      </li>
    ))}
  </ul>

  {user && (
    <form onSubmit={handleComment} className="comment-form">
      <input
        ref={inputRef}
        value={newComment}
        onChange={e => setNewComment(e.target.value)}
        placeholder="Add comment"
        maxLength={200}
      />
      <button type="submit">Post</button>
    </form>
  )}
</div>

  );
}

export default BlogPage;
