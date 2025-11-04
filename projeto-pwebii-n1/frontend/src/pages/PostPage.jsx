import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import './PostPage.css';

export default function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    load();
  }, [id]);

  async function load() {
    try {
      const res = await api.get(`/posts/${id}`);
      setPost(res.data);
      const c = await api.get(`/comments/${id}`);
      setComments(c.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function addComment(e) {
    e.preventDefault();
    if (!text) return;
    if (!userId) return alert('Informe seu userId para testar.');
    try {
      await api.post('/comments', { text, postId: id, userId });
      setText('');
      load();
    } catch (err) {
      alert(err.response?.data?.error || 'Erro ao enviar comentário');
    }
  }

  if (!post) return <div className="loading">Carregando...</div>;

  return (
    <div className="post-page">
      <div className="post-card">
        <h2 className="post-title">{post.title}</h2>
        <div className="post-meta">
          por <span>{post.username}</span> —{' '}
          {new Date(post.createdAt).toLocaleString()}
        </div>
        <p className="post-content">{post.text}</p>
      </div>

      <div className="comments-section">
        <h3>💬 Comentários</h3>
        {comments.length === 0 ? (
          <p className="no-comments">Nenhum comentário ainda.</p>
        ) : (
          <ul className="comments-list">
            {comments.map((c) => (
              <li key={c.id} className="comment">
                <strong>{c.username}</strong>
                <p>{c.text}</p>
              </li>
            ))}
          </ul>
        )}

        <form className="comment-form" onSubmit={addComment}>
          <label>Seu userId (para teste)</label>
          <input
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Ex: 1"
          />

          <label>Comentário</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escreva algo..."
          />

          <button type="submit">💭 Enviar comentário</button>
        </form>
      </div>
    </div>
  );
}
