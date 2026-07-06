import { useEffect, useState } from 'react';
import { api } from '../api.js';

const STATUS_FLUXO = ['Aberto', 'Em Analise', 'Resolvido', 'Validado'];

const PRIORIDADES = ['Alta', 'Media', 'Baixa'];

export default function BugCentral() {
  const [bugs, setBugs] = useState([]);
  const [form, setForm] = useState({
    titulo: '',
    local: '',
    descricao: '',
    causaRaiz: '',
    prioridade: 'Alta',
  });
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarBugs();
  }, []);

  async function carregarBugs() {
    setCarregando(true);
    const dados = await api.getBugs();
    setBugs(dados);
    setCarregando(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.titulo.trim() || !form.local.trim() || !form.descricao.trim()) {
      alert('Preencha título, local do bug e descrição.');
      return;
    }
    await api.createBug(form);
    setForm({ titulo: '', local: '', descricao: '', causaRaiz: '', prioridade: 'Alta' });
    carregarBugs();
  }

  async function avancarStatus(bug) {
    const idx = STATUS_FLUXO.indexOf(bug.status);
    const proximo = STATUS_FLUXO[idx + 1];
    if (!proximo) return;
    if (proximo === 'Resolvido' && !bug.solucao) {
      const solucao = prompt('Descreva a solução aplicada para este bug:');
      if (!solucao) return;
      await api.updateBug(bug.id, { status: proximo, solucao });
    } else {
      await api.updateBug(bug.id, { status: proximo });
    }
    carregarBugs();
  }

  async function excluirBug(bug) {
    if (!confirm(`Remover o registro do bug "${bug.titulo}"?`)) return;
    await api.deleteBug(bug.id);
    carregarBugs();
  }

  return (
    <div className="bug-central">
      <div className="bug-intro card">
        <h2>🐞 Central de Bugs da turma</h2>
        <p>
          Use este espaço para documentar, no mesmo formato de chamado da Aula 06,
          cada erro encontrado no sistema: onde está, qual o impacto, a causa raiz
          e a solução aplicada. Siga o fluxo{' '}
          <strong>Aberto → Em Análise → Resolvido → Validado</strong>.
        </p>
      </div>

      <form className="new-ticket-form" onSubmit={handleSubmit}>
        <h3>Registrar bug encontrado</h3>
        <input
          type="text"
          placeholder="Título do bug (ex: Filtro de prioridade não funciona)"
          value={form.titulo}
          onChange={(e) => setForm({ ...form, titulo: e.target.value })}
        />
        <input
          type="text"
          placeholder="Local (ex: backend/routes/tickets.js - GET /tickets)"
          value={form.local}
          onChange={(e) => setForm({ ...form, local: e.target.value })}
        />
        <textarea
          placeholder="Descreva o problema e como reproduzi-lo"
          value={form.descricao}
          onChange={(e) => setForm({ ...form, descricao: e.target.value })}
        />
        <textarea
          placeholder="Causa raiz identificada (opcional por enquanto)"
          value={form.causaRaiz}
          onChange={(e) => setForm({ ...form, causaRaiz: e.target.value })}
        />
        <select
          value={form.prioridade}
          onChange={(e) => setForm({ ...form, prioridade: e.target.value })}
        >
          {PRIORIDADES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <button type="submit" className="btn-primary">
          Documentar bug
        </button>
      </form>

      <div className="bug-list">
        {carregando && <p>Carregando...</p>}
        {!carregando && bugs.length === 0 && (
          <p className="empty-hint">Nenhum bug documentado ainda pela turma.</p>
        )}
        {bugs.map((bug) => (
          <div className="card bug-card" key={bug.id}>
            <div className="ticket-card-header">
              <span className={`badge badge-${bug.prioridade.toLowerCase()}`}>
                {bug.prioridade}
              </span>
              <span className="badge badge-status">{bug.status}</span>
            </div>
            <h4>{bug.titulo}</h4>
            <p className="ticket-desc">
              <strong>Local:</strong> {bug.local}
            </p>
            <p className="ticket-desc">{bug.descricao}</p>
            {bug.causaRaiz && (
              <p className="ticket-desc">
                <strong>Causa raiz:</strong> {bug.causaRaiz}
              </p>
            )}
            {bug.solucao && (
              <p className="ticket-desc">
                <strong>Solução aplicada:</strong> {bug.solucao}
              </p>
            )}
            <div className="ticket-card-footer">
              {STATUS_FLUXO.indexOf(bug.status) < STATUS_FLUXO.length - 1 && (
                <button className="btn-mini" onClick={() => avancarStatus(bug)}>
                  Avançar → {STATUS_FLUXO[STATUS_FLUXO.indexOf(bug.status) + 1]}
                </button>
              )}
              <button className="btn-mini btn-danger" onClick={() => excluirBug(bug)}>
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
