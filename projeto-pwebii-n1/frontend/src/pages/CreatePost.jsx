import React, { useState } from 'react';
import api from '../services/api';
import './CreatePost.css';

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [userId, setUserId] = useState('');
  const [msg, setMsg] = useState('');

  const handle = async (e) => {
    e.preventDefault();
    if (!title) return setMsg('Título obrigatório');
    if (!text) return setMsg('Texto obrigatório');
    if (!userId)
      return setMsg('Informe o seu userId (veja o retorno do cadastro)');
    try {
      await api.post('/posts', { title, text, userId });
      setMsg('✅ Post criado com sucesso!');
      setTitle('');
      setText('');
    } catch (err) {
      setMsg(err.response?.data?.error || 'Erro ao criar post');
    }
  };

  return (
    <div className="create-container">
      <h2 className="create-title">✏️ Criar Novo Post</h2>

      <form className="create-form" onSubmit={handle}>
        <div className="form-group">
          <label>Título</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Digite o título do post..."
          />
        </div>

        <div className="form-group">
          <label>Texto</label>
          <textarea
            rows="6"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escreva seu post aqui..."
          />
        </div>

        <div className="form-group">
          <label>Seu userId (para demo)</label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Ex: 1"
          />
        </div>

        <button type="submit" className="submit-btn">
          Publicar
        </button>
      </form>

      {msg && <p className="message">{msg}</p>}
    </div>
  );
}
