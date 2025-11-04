import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import AllPosts from './pages/AllPosts';
import CreatePost from './pages/CreatePost';
import PostPage from './pages/PostPage';
import Signup from './pages/Signup';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <header className="app-header">
          <h1 className="logo">Projeto N1</h1>
          <nav className="nav-links">
            <Link to="/">Posts</Link>
            <Link to="/create">Novo Post</Link>
            <Link to="/signup">Cadastro</Link>
          </nav>
        </header>

        <main className="app-content">
          <Routes>
            <Route path="/" element={<AllPosts />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/posts/:id" element={<PostPage />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')).render(<App />);
