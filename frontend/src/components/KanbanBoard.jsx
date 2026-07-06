import TicketCard from './TicketCard.jsx';

const COLUNAS = ['Abertos', 'Triagem', 'Em atendimento', 'Encerrados'];

export default function KanbanBoard({ tickets, onAvancar, onValidar, onAbrir, onExcluir }) {
  return (
    <div className="board">
      {COLUNAS.map((coluna) => {
        const ticketsDaColuna = tickets.filter((t) => t.status === coluna);
        return (
          <div className="board-column" key={coluna}>
            <h3>
              {coluna} <span className="count-pill">{ticketsDaColuna.length}</span>
            </h3>
            <div className="board-column-list">

              {ticketsDaColuna.map((ticket, index) => (
                <TicketCard
                  key={index}
                  ticket={ticket}
                  onAvancar={onAvancar}
                  onValidar={onValidar}
                  onAbrir={onAbrir}
                  onExcluir={onExcluir}
                />
              ))}
              {ticketsDaColuna.length === 0 && (
                <p className="empty-hint">Nenhum chamado aqui.</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
