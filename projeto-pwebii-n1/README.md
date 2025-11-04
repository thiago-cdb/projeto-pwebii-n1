# Twitter N1 - Fullstack (MySQL)
Este repositório contém um backend (Node + Express + Sequelize + MySQL) e um frontend (React + Vite).
## Como rodar
1. Configure o MySQL e crie o banco (ex: `CREATE DATABASE twitter_n1;`)
2. Copie `backend/.env.example` -> `backend/.env` e preencha suas credenciais.
3. Abra dois terminais:
   - Backend:
     cd backend
     npm install
     npm run dev
   - Frontend:
     cd frontend
     npm install
     npm run dev
## Observações
- O backend fará `sequelize.sync()` automaticamente (cria as tabelas se não existirem).
- Senhas em texto plano para demo. Posso adicionar bcrypt se quiser.
