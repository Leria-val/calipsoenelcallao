const express = require('express');
const cors = require('cors');

const ticketsRouter = require('./routes/tickets');
const bugsRouter = require('./routes/bugs');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ ok: true, servico: 'Help Desk API - Aula 06' });
});

app.use('/api/tickets', ticketsRouter);
app.use('/api/bugs', bugsRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

app.listen(PORT, () => {
  console.log(`Help Desk API rodando em http://localhost:${PORT}`);
});
