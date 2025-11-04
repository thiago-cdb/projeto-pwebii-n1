const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;
const config = require('./config');
const initModels = require('./models');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configuração do Sequelize
const sequelize = new Sequelize(
  config.db.database,
  config.db.username,
  config.db.password,
  {
    host: config.db.host,
    port: config.db.port,
    dialect: config.db.dialect,
    logging: config.db.logging
  }
);

const models = initModels(sequelize);

// Sync DB
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    await sequelize.sync(); // { force: true } to reset tables
    console.log('Database synced.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
})();

// Routes

// Signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'username and password required' });
    const exists = await models.User.findOne({ where: { username }});
    if (exists) return res.status(409).json({ error: 'username already exists' });
    // Gera hash da senha antes de salvar (bcrypt)
    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await models.User.create({ username, password: hashed });
    return res.json({ id: user.id, username: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

// Create post

// Rota de login: verifica usuário e senha, retorna info do usuário.
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'username and password required' });
    const user = await models.User.findOne({ where: { username } });
    if (!user) return res.status(404).json({ error: 'user not found' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'invalid credentials' });
    return res.json({ id: user.id, username: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

app.post('/api/posts', async (req, res) => {
  try {
    const { title, text, userId } = req.body;
    if (!title || !text || !userId) return res.status(400).json({ error: 'title, text and userId required' });
    const user = await models.User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'user not found' });
    const post = await models.Post.create({ title, text, userId });
    return res.json(post);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'internal' });
  }
});

// List posts (paginated)
app.get('/api/posts', async (req, res) => {
  try {
    const page = parseInt(req.query.page||'1');
    const limit = parseInt(req.query.limit||'10');
    const offset = (page-1)*limit;
    const { count, rows } = await models.Post.findAndCountAll({
      order: [['createdAt', 'DESC']],
      limit, offset,
      include: [{ model: models.User, attributes: ['id','username'] }]
    });
    const posts = rows.map(p => ({
      id: p.id,
      title: p.title,
      text: p.text,
      userId: p.userId,
      createdAt: p.createdAt,
      username: p.User ? p.User.username : 'unknown'
    }));
    res.json({ page, limit, total: count, posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

// Get single post
app.get('/api/posts/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const post = await models.Post.findByPk(id, { include: [{ model: models.User, attributes: ['id','username'] }]});
    if (!post) return res.status(404).json({ error: 'post not found' });
    res.json({
      id: post.id,
      title: post.title,
      text: post.text,
      userId: post.userId,
      createdAt: post.createdAt,
      username: post.User ? post.User.username : 'unknown'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

// Comments for a post
app.get('/api/comments/:postId', async (req, res) => {
  try {
    const postId = req.params.postId;
    const comments = await models.Comment.findAll({
      where: { postId },
      include: [{ model: models.User, attributes: ['id','username'] }],
      order: [['createdAt','ASC']]
    });
    const out = comments.map(c => ({ id: c.id, text: c.text, postId: c.postId, userId: c.userId, createdAt: c.createdAt, username: c.User ? c.User.username : 'unknown' }));
    res.json(out);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

// Create comment
app.post('/api/comments', async (req, res) => {
  try {
    const { text, postId, userId } = req.body;
    if (!text || !postId || !userId) return res.status(400).json({ error: 'text, postId and userId required' });
    const post = await models.Post.findByPk(postId);
    if (!post) return res.status(404).json({ error: 'post not found' });
    const comment = await models.Comment.create({ text, postId, userId });
    res.json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

// Rotas de exclusão protegidas: somente o autor pode excluir.
app.delete('/api/posts/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    const post = await models.Post.findByPk(id);
    if (!post) return res.status(404).json({ error: 'post not found' });
    if (post.userId.toString() !== userId.toString()) return res.status(403).json({ error: 'forbidden' });
    await post.destroy();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

app.delete('/api/comments/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    const comment = await models.Comment.findByPk(id);
    if (!comment) return res.status(404).json({ error: 'comment not found' });
    if (comment.userId.toString() !== userId.toString()) return res.status(403).json({ error: 'forbidden' });
    await comment.destroy();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> console.log('Server running on port', PORT));
