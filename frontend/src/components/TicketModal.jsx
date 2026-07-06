export default function TicketModal({ ticket, onClose }) {
  if (!ticket) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        <h2>
          #{ticket.id} — {ticket.titulo}
        </h2>
        <p className="ticket-desc">{ticket.descricao}</p>
        <div className="modal-grid">
          <div>
            <strong>Tipo</strong>
            <p>{ticket.tipo}</p>
          </div>
          <div>
            <strong>Prioridade</strong>
            <p>{ticket.prioridade}</p>
          </div>
          <div>
            <strong>Status</strong>
            <p>{ticket.status}</p>
          </div>
          <div>
            <strong>Validado com usuário</strong>
            <p>{ticket.validado ? 'Sim' : 'Não'}</p>
          </div>
          <div>
            <strong>Criado em</strong>
            <p>{new Date(ticket.criadoEm).toLocaleString('pt-BR')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
