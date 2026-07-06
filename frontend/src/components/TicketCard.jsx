function corPrioridade(prioridade) {
  if (prioridade === 'Alta') return 'badge-baixa';
  if (prioridade === 'Media') return 'badge-media';
  if (prioridade === 'Baixa') return 'badge-alta';
  return '';
}

const PROXIMO_STATUS = {
  Abertos: 'Triagem',
  Triagem: 'Em atendimento',
  'Em atendimento': 'Encerrados',
};

export default function TicketCard({ ticket, onAvancar, onValidar, onAbrir, onExcluir }) {
  const proximo = PROXIMO_STATUS[ticket.status];

  return (
    <div className="ticket-card">
      <div className="ticket-card-header">
        <span className={`badge ${corPrioridade(ticket.prioridade)}`}>{ticket.prioridade}</span>
        <span className="badge badge-tipo">{ticket.tipo}</span>
      </div>
      <button className="ticket-title" onClick={() => onAbrir(ticket)}>
        #{ticket.id} — {ticket.titulo}
      </button>
      <p className="ticket-desc">{ticket.descricao}</p>

      <div className="ticket-card-footer">
        {proximo && (
          <button
            className="btn-mini"
            onClick={() => onAvancar(ticket, proximo)}
            disabled={proximo === 'Encerrados' && !ticket.validado}
            title={
              proximo === 'Encerrados' && !ticket.validado
                ? 'Valide o chamado com o usuário antes de encerrar'
                : ''
            }
          >
            Avançar → {proximo}
          </button>
        )}
        {ticket.status === 'Em atendimento' && !ticket.validado && (
          <button className="btn-mini btn-outline" onClick={() => onValidar(ticket)}>
            Validar com usuário
          </button>
        )}
        <button className="btn-mini btn-danger" onClick={() => onExcluir(ticket)}>
          Excluir
        </button>
      </div>
    </div>
  );
}
