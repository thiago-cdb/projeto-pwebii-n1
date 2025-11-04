require('dotenv').config();
module.exports = {
  port: process.env.PORT || 4000,
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    database: process.env.DB_NAME || 'twitter_n1',
    username: process.env.DB_USER || 'thiago',
    password: process.env.DB_PASS || 'senha123',
    dialect: 'mysql',
    logging: false
  }
};
