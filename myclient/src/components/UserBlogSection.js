import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

// (Re-use the CommentSection function from BlogPage, or import it if needed)
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
            <span className="comment-user">{cmt.author?.name || 'User'}:</span> <span>{cmt.text}</span>
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

const UserBlogSection = ({ userId, user }) => {
  const [posts, setPosts] = useState([]);
  
  useEffect(() => {
    axios.get(`/api/blogs/user/${userId}`).then(res => setPosts(res.data));
  }, [userId]);

  if (!posts.length) return <p>No posts yet.</p>;

  return (
    <ul className="user-blog-list">
      {posts.map(post => (
        <li key={post._id} className="blog-feed-post">
          <div className="blog-media">
            {post.mediaType === 'image' ? (
              <img src={post.mediaUrl} className="blog-img" alt="blog"/>
            ) : (
              <video src={post.mediaUrl} className="blog-video" controls />
            )}
          </div>
          <div className="post-likes"><span>{'\u2764\uFE0F'}</span>{post.likes.length}</div>
          <div className="post-content">{post.description}</div>
          <div className="blog-meta-row">
            <span className="post-date">{new Date(post.createdAt).toLocaleString()}</span>
          </div>
          <CommentSection post={post} user={user} />
        </li>
      ))}
    </ul>
  );
};


export default UserBlogSection;
