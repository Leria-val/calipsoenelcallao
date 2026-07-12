//decimo segundo error: mostra um ticket a mais do q realmente tem
//antes: {totalTickets + 1} chamados registrados · {totalBugs} bugs documentados
//fix: só tirar o +1 porraaaaaa
//prioridadee baixa gato 

export default function Navbar({ aba, setAba, totalTickets, totalBugs }) {
  return (
    <header className="navbar">
      <div className="navbar-brand">
        <span className="navbar-icon">🧩</span>
        <div>
          <h1>Help Desk — Aula 06</h1>
          <p className="navbar-subtitle">
            {totalTickets} chamados registrados · {totalBugs} bugs documentados
          </p>
        </div>
      </div>
      <nav className="navbar-tabs">
        <button
          className={aba === 'quadro' ? 'tab active' : 'tab'}
          onClick={() => setAba('quadro')}
        >
          🗂️ Quadro de Chamados
        </button>
        <button
          className={aba === 'bugs' ? 'tab active' : 'tab'}
          onClick={() => setAba('bugs')}
        >
          🐞 Central de Bugs
        </button>
      </nav>
    </header>
  );
}
