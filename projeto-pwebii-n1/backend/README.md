# Backend - Twitter N1 (MySQL + Sequelize)
## Setup
1. Copy `.env.example` -> `.env` and fill your DB credentials.
2. Crie o banco no MySQL (ex: `CREATE DATABASE twitter_n1;`)
3. cd backend
4. npm install
5. npm run dev

## Notas
- O backend usa Sequelize e fará `sequelize.sync()` automaticamente.
- Usuários: tabela `Users` (id, username, password)
- Posts: tabela `Posts` (id, title, text, userId)
- Comments: tabela `Comments` (id, text, postId, userId)
- As senhas estão em texto plano para demo. Se quiser, eu altero para `bcrypt`.
