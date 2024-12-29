const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const pg = require('pg');

const db = new pg.Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'pg_monitor',
  password: 'password',
  port: 5432,
});

app.use(express.json());

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password], (err, result) => {
    if (err) {
      res.status(500).send({ message: 'Erro ao autenticar usuário' });
    } else if (result.rows.length === 0) {
      res.status(401).send({ message: 'Usuário ou senha inválidos' });
    } else {
      const token = jwt.sign({ username }, 'secret', { expiresIn: '1h' });
      res.send({ token });
    }
  });
});

app.get('/instances', (req, res) => {
  db.query('SELECT * FROM instances', (err, result) => {
    if (err) {
      res.status(500).send({ message: 'Erro ao carregar instâncias' });
    } else {
      res.send(result.rows);
    }
  });
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
