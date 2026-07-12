import { useEffect, useState } from 'react';
import { api } from './api.js';
import Navbar from './components/Navbar.jsx';
import KanbanBoard from './components/KanbanBoard.jsx';
import TicketModal from './components/TicketModal.jsx';
import NewTicketForm from './components/NewTicketForm.jsx';
import BugCentral from './components/BugCentral.jsx';

export default function App() {
  const [aba, setAba] = useState('quadro');
  const [tickets, setTickets] = useState([]);
  const [totalBugs, setTotalBugs] = useState(0);
  const [busca, setBusca] = useState('');
  const [ticketSelecionado, setTicketSelecionado] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  async function carregarTickets() {
    try {
      setCarregando(true);
      const params = busca ? { q: busca } : {};
      const dados = await api.getTickets(params);
      setTickets(dados);
      setErro('');
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarTickets();
    api.getBugs().then((b) => setTotalBugs(b.length));
  }, []);

//oitavo error: ele busca totalbugs uma vez e nunca refresh cuando adiciona ou deleta
//o contador de bugs no Navbar fica desatualizado)
//buscava a qtd de bugs só 1 vez logo quando a página carrega
//useEffect com a lista vazia [] no final
//prioridade baixa creo pq es un fix facilito
//solucion:useeffect vai ficar de olho na variável aba
//toda vez que o usuário clicar para mudar de aba e entrar na aba de "bugs"
//ele vai lá na API buscar o número atualizado.

  useEffect(() => {
  if (aba === 'bugs') api.getBugs().then((b) => setTotalBugs(b.length));
}, [aba]);

  async function handleCriarTicket(dadosForm) {
    try {
      await api.createTicket(dadosForm);
      carregarTickets();
    } catch (e) {
      alert(e.message);
    }
  }

//Septimo error: quando clicas em avancar nao refresca o board
//erro em handle avancar
//ticket.status = novoStatus; setTickets(tickets);
//el array tickets continua igual ao endereco anterior. 
//mira la referência e nao ve mudanca ent n atualiza a tela
//los datos cambian pero el usuario no los ve a menos q actualize manual
//prioridad alta pq lo digo yo
//solucion: creamos array/ objeto nuevo usando un operador spread o lo q sea 

  async function handleAvancar(ticket, novoStatus) {
    try {
      await api.updateStatus(ticket.id, novoStatus);

      setTickets(tickets.map((t) => (t.id === ticket.id ? 
        { ...t, status: novoStatus } : t)));
    } catch (e) {
      alert(e.message);
    }
  }

  async function handleValidar(ticket) {
    await api.validarTicket(ticket.id);
    carregarTickets();
  }

  async function handleExcluir(ticket) {
    if (!confirm(`Excluir o chamado #${ticket.id} — "${ticket.titulo}"?`)) return;
    await api.deleteTicket(ticket.id);
    carregarTickets();
  }

  return (
    <div className="app">
      <Navbar
        aba={aba}
        setAba={setAba}
        totalTickets={tickets.length}
        totalBugs={totalBugs}
      />

      <main className="main-content">
        {aba === 'quadro' && (
          <>
            <div className="toolbar">
              <input
                className="search-input"
                type="text"
                placeholder="Buscar chamado por título ou descrição..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
              <button className="btn-secondary" onClick={carregarTickets}>
                🔄 Atualizar
              </button>
            </div>

            {erro && <p className="form-error">{erro}</p>}
            {carregando ? (
              <p>Carregando chamados...</p>
            ) : (
                <KanbanBoard
                  tickets={tickets}
                  onAvancar={handleAvancar}
                  onValidar={handleValidar}
                  onAbrir={setTicketSelecionado}
                  onExcluir={handleExcluir}
                />
              )}

            <NewTicketForm onCriar={handleCriarTicket} />
          </>
        )}

        {aba === 'bugs' && <BugCentral />}
      </main>

      <TicketModal ticket={ticketSelecionado} onClose={() => setTicketSelecionado(null)} />
    </div>
  );
}
