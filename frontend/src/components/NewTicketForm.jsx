import { useState } from 'react';

export default function NewTicketForm({ onCriar }) {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tipo, setTipo] = useState('Incidente');
  const [prioridade, setPrioridade] = useState('Alta');
  const [erro, setErro] = useState('');

  function handleSubmit(e) {
    e.preventDefault();

    if (!titulo || !tipo || !prioridade) {
      setErro('Preencha ao menos o título, tipo e prioridade.');
      return;
    }

    setErro('');
    onCriar({ titulo, descricao, tipo, prioridade });
    setTitulo('');
    setDescricao('');
  }

  return (
    <form className="new-ticket-form" onSubmit={handleSubmit}>
      <h3>Abrir novo chamado</h3>
      {erro && <p className="form-error">{erro}</p>}
      <input
        type="text"
        placeholder="Título do chamado"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
      />
      <textarea
        placeholder="Descreva o problema, impacto e contexto"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
      />
      <div className="form-row">
        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="Incidente">Incidente</option>
          <option value="Requisição">Requisição</option>
        </select>
        <select value={prioridade} onChange={(e) => setPrioridade(e.target.value)}>
          <option value="Alta">Alta</option>
          <option value="Media">Média</option>
          <option value="Baixa">Baixa</option>
        </select>
      </div>
      <button type="submit" className="btn-primary">
        Abrir chamado
      </button>
    </form>
  );
}
