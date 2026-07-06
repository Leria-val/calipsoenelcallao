const express = require('express');
const router = express.Router();
const { readDB, writeDB } = require('../utils/db');

router.get('/', (req, res) => {
  const { status } = req.query;
  const db = readDB();
  let bugs = [...db.bugs];
  if (status) {
    bugs = bugs.filter((b) => b.status === status);
  }
  res.json(bugs);
});

router.post('/', (req, res) => {
  const { titulo, local, descricao, causaRaiz, prioridade } = req.body;

  if (!titulo || !local || !descricao || !prioridade) {
    return res.status(400).json({
      error: 'titulo, local, descricao e prioridade são obrigatórios',
    });
  }

  const db = readDB();
  const novoBug = {
    id: db.bugs.length ? Math.max(...db.bugs.map((b) => b.id)) + 1 : 1,
    titulo,
    local,
    descricao,
    causaRaiz: causaRaiz || '',
    solucao: '',
    prioridade,
    status: 'Aberto', // Aberto -> Em Analise -> Resolvido -> Validado
    criadoEm: new Date().toISOString(),
  };

  db.bugs.push(novoBug);
  writeDB(db);
  res.status(201).json(novoBug);
});

router.patch('/:id', (req, res) => {
  const { status, solucao, causaRaiz } = req.body;
  const db = readDB();
  const bug = db.bugs.find((b) => b.id === Number(req.params.id));
  if (!bug) return res.status(404).json({ error: 'Registro de bug não encontrado' });

  if (status) bug.status = status;
  if (solucao !== undefined) bug.solucao = solucao;
  if (causaRaiz !== undefined) bug.causaRaiz = causaRaiz;

  writeDB(db);
  res.json(bug);
});

router.delete('/:id', (req, res) => {
  const db = readDB();
  db.bugs = db.bugs.filter((b) => b.id !== Number(req.params.id));
  writeDB(db);
  res.status(204).end();
});

module.exports = router;
