import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './AllPosts.css';

export default function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => { load(); }, [page]);

  async function load() {
    try {
      const res = await api.get(`/posts?page=${page}&limit=10`);
      setPosts(res.data.posts);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="posts-container">
      <h2 className="posts-title">📜 Todos os Posts</h2>

      {posts.length === 0 ? (
        <p className="no-posts">Nenhum post encontrado.</p>
      ) : (
        <ul className="posts-list">
          {posts.map((p) => (
            <li key={p.id} className="post-card">
              <Link to={`/posts/${p.id}`} className="post-title">
                {p.title}
              </Link>
              <div className="post-meta">
                por <span>{p.username}</span> —{' '}
                {new Date(p.createdAt).toLocaleString()}
              </div>
              <p className="post-text">
                {p.text.slice(0, 200)}
                {p.text.length > 200 ? '...' : ''}
              </p>
            </li>
          ))}
        </ul>
      )}

      <div className="pagination">
        <button
          className="nav-btn"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          ◀ Anterior
        </button>
        <span className="page-number">Página {page}</span>
        <button className="nav-btn" onClick={() => setPage((p) => p + 1)}>
          Próxima ▶
        </button>
      </div>
    </div>
  );
}
