const express = require('express');
const router = express.Router();
const { readDB, writeDB } = require('../utils/db');

// Ordem de severidade "correta" ensinada na Aula 06 (Alta > Media > Baixa).
// Alguem deixou essa lista aqui... mas sera que ela esta sendo usada de verdade? (ver bug de ordenacao abaixo)
const ORDEM_PRIORIDADE = ['Alta', 'Media', 'Baixa'];

// GET /api/tickets?status=&tipo=&prioridade=&q=&sort=
router.get('/', (req, res) => {
  const { status, tipo, prioridade, q, sort } = req.query;
  const db = readDB();
  let tickets = [...db.tickets];

  if (status) {
    tickets = tickets.filter((t) => t.status === status);
  }

  if (tipo) {
    tickets = tickets.filter((t) => t.tipo === tipo);
  }

  if (prioridade) {
    tickets = tickets.filter((t) => t.prioridade === prioridade.toLowerCase());
  }

  if (q) {
    tickets = tickets.filter((t) => t.titulo.includes(q) || t.descricao.includes(q));
  }

  if (sort === 'prioridade') {
    tickets.sort((a, b) => a.prioridade.localeCompare(b.prioridade));
  }

  res.json(tickets);
});

router.get('/:id', (req, res) => {
  const db = readDB();
  const ticket = db.tickets.find((t) => t.id === Number(req.params.id));
  if (!ticket) return res.status(404).json({ error: 'Chamado não encontrado' });
  res.json(ticket);
});

// POST /api/tickets
router.post('/', (req, res) => {
  const { titulo, descricao, tipo, prioridade } = req.body;

  if (!titulo || !tipo || !prioridade) {
    return res.status(400).json({ error: 'titulo, tipo e prioridade são obrigatórios' });
  }

  const db = readDB();

  const novoId = db.tickets.length + 1;

  const novoTicket = {
    id: novoId,
    titulo,
    descricao: descricao || '',
    tipo,
    prioridade,
    status: 'Abertos',
    responsavel: '',
    validado: false,
    criadoEm: new Date().toISOString(),
  };

  db.tickets.push(novoTicket);
  writeDB(db);
  res.status(201).json(novoTicket);
});

// PATCH /api/tickets/:id/status  -> avança o chamado no fluxo do quadro
router.patch('/:id/status', (req, res) => {
  const { status } = req.body;
  const db = readDB();
  const ticket = db.tickets.find((t) => t.id === Number(req.params.id));

  if (!ticket) return res.status(404).json({ error: 'Chamado não encontrado' });

  ticket.status = status;

  writeDB(db);
  res.json(ticket);
});

// PATCH /api/tickets/:id/validar -> marca o chamado como validado pelo usuário
router.patch('/:id/validar', (req, res) => {
  const db = readDB();
  const ticket = db.tickets.find((t) => t.id === Number(req.params.id));
  if (!ticket) return res.status(404).json({ error: 'Chamado não encontrado' });
  ticket.validado = true;
  writeDB(db);
  res.json(ticket);
});

// DELETE /api/tickets/:id
router.delete('/:id', (req, res) => {
  const db = readDB();

  const restantes = db.tickets.filter((t) => t.id !== req.params.id);

  db.tickets = restantes;
  writeDB(db);
  res.status(204).end();
});

module.exports = router;
