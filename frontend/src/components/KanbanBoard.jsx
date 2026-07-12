import TicketCard from './TicketCard.jsx';

const COLUNAS = ['Abertos', 'Triagem', 'Em atendimento', 'Encerrados'];

//Noveno error: llave react equivocada
//{ticketsDaColuna.map((ticket, index) => ( <TicketCard key={index} ...
//ele usa o index do array ao inves de um id estavel ai ele mistura estado com identidade
//quando a lista é filtrada, reordenado ou deletada
//prioridade media
//p solucionar é so botar {ticket.id} no lugar do index p ter um id estavel

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
                  key={ticket.id}
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
