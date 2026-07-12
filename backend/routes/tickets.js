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

// Primer error: filtro de prioridad no funciona leo mmgvo los datos se guardan como Alta, Media, Baixa
//pero antes esto tenia un filtro q lo mandaba todo en minusculo leo imbecil
//tickets = tickets.filter((t) => t.prioridade === prioridade.toLowerCase());
//entonces esa verga no matcheaba. En conclusion, la causa era una comparacion sin normas en los dos lados
//prioridad alta pq quiebra una feature entera fokin carajito

//solucion:

  if (prioridade) {
    tickets = tickets.filter((t) => t.prioridade.toLowerCase() === prioridade.toLowerCase());
  }


//tercer error: busca es sensible misma ruta, filtro q
//a busca nao acha os negocios. Prioridade baixa ou medioo
//antes:if (q) {tickets = tickets.filter((t) => t.titulo.includes(q) || t.descricao.includes(q));}
//solucion: 

  if (q) {
    const termo = q.toLowerCase();
    tickets = tickets.filter((t) => t.titulo.toLowerCase().includes(termo) || t.descricao.toLowerCase().includes(termo));
  }

  //Segundo error: el sort ignora el orden de severidad. mismo archivo misma ruta
  //antes: tickets.sort((a, b) => a.prioridade.localeCompare(b.prioridade));
  // ele nao ta chamando or ordem_prioridade e ordena alfabeticamente retornando o negocio na ordem incorreta
  //eu diria q isso tem prioridade media leo del conchale

  if (sort === 'prioridade') {
    tickets.sort((a, b) => ORDEM_PRIORIDADE.indexOf(a.prioridade) - ORDEM_PRIORIDADE.indexOf(b.prioridade));
    
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

//Quarto error: si borras un ticket el sistema como q reusa el id q borraste, porque suma el length +1
// antes: const novoId = db.tickets.length + 1;
// y ese id duplicado quebraria las rotas
// para solucionarlo entonces no vemos el tamanho del array y si el maior ID existente y le sumamos 1

  const novoId = db.tickets.length ? Math.max(...db.tickets.map((t) => t.id)) + 1 : 1;

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

// Quinto error: el api no sigue las reglas de negocio pq la ui desactiva Avancar-encerrados hasta
//que validado sea true pero el api acepta cualquier status ciegamente
//antes: ticket.status = status;
//cualquiera q le de al endpoint puede cerra un ticket sin validation. Prioridad ALta
 
  if (status === 'Encerrados' && !ticket.validado) {
  return res.status(400).json({ error: 'Chamado não pode ser encerrado sem validação com o usuário' });
}
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

//Sexto error: Deletar nao deleta kkk.
//antes: const restantes = db.tickets.filter((t) => t.id !== req.params.id);  
//t.id es un numero, req.params.id es un string, !== sempre es true ent nao filtra porra nenhuma
//el api te miente como hombre y t dice 204 pero el ticket se queda en la DB
//prioridad fokin alta

  const restantes = db.tickets.filter((t) => t.id !== Number(req.params.id));

  db.tickets = restantes;
  writeDB(db);
  res.status(204).end();
});

module.exports = router;
