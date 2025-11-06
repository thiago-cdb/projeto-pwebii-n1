# Projeto Twitter — N1

## Descrição do Projeto

Este projeto foi desenvolvido como parte da avaliação N1 da disciplina **Programação Web II**.  
Trata-se de uma aplicação inspirada no Twitter, que permite aos usuários **se cadastrar, criar posts e comentar publicações**.  
O sistema foi construído com **Node.js, Express, React e MySQL**, com comunicação entre o frontend e o backend via **API REST**.






---

## Tecnologias Utilizadas

### Backend
- Node.js  
- Express.js  
- MySQL (via mysql2)  
- Dotenv  
- Nodemon  

### Frontend
- React.js  
- Vite  
- Axios  
- React Router DOM  

---

## Funcionalidades

### Usuário
- Cadastro de usuário  
- Login básico (autenticação local)  

### Postagens
- Criação de novos posts  
- Listagem de todos os posts  
- Visualização de um post específico  

### Comentários
- Exibição dos comentários de um post  
- Adição de novos comentários  

---

## Banco de Dados (MySQL)

O projeto utiliza **MySQL** para armazenar dados de usuários, posts e comentários.  
A conexão é configurada no arquivo `.env`, localizado dentro da pasta `backend/`.

### Exemplo de configuração:

```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=twitter_n1
DB_USER=thhhiago
DB_PASS=Senha@123
PORT=4000
```

---

## Endpoints Principais

### Usuários
- POST /users — Cria um novo usuário  

### Posts
- GET /posts — Lista todos os posts  
- GET /posts/:id — Retorna um post específico  
- POST /posts — Cria um novo post  

### Comentários
- GET /comments/:postId — Lista os comentários de um post  
- POST /comments — Cria um novo comentário  

---

