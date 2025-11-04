import React, { useState } from 'react';
import api from '../services/api';
import './Signup.css';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handle = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      return setMessage('⚠️ Preencha todos os campos.');
    }
    try {
      const res = await api.post('/auth/signup', { username, password });
      setMessage(`✅ Usuário criado: ${res.data.username}. ID: ${res.data.id}`);
      setUsername('');
      setPassword('');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Erro ao cadastrar.');
    }
  };

  return (
    <div className="signup-container">
      <h2 className="signup-title">👤 Criar Conta</h2>

      <form className="signup-form" onSubmit={handle}>
        <div className="form-group">
          <label>Usuário</label>
          <input
            type="text"
            placeholder="Digite seu nome de usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Senha</label>
          <input
            type="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="signup-btn">
          Cadastrar
        </button>
      </form>

      {message && <p className="signup-message">{message}</p>}
    </div>
  );
}
