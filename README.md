# 🧩 Help Desk — Aula 06: Caça aos Bugs

Aplicação fullstack (**React** no front + **Node/Express** no back) que simula
um sistema de Help Desk, baseado no conteúdo da Aula 06 (Help Desk e Fluxo de
Atendimento).

O sistema **contém erros propositais**, espalhados entre o back-end e o
front-end. A missão da turma é jogar o papel de analistas de suporte e
**identificar, corrigir e documentar** cada erro encontrado.

## 🎯 Objetivo do exercício

1. Explorar o sistema (quadro de chamados: Abertos → Triagem → Em atendimento
   → Encerrados).
2. Encontrar os bugs escondidos no código (existem bugs de back-end e de
   front-end).
3. Para cada bug encontrado, abrir um registro na aba **"🐞 Central de Bugs"**
   do próprio app, preenchendo:
   - Título do bug
   - Local (arquivo/rota onde está o problema)
   - Descrição do problema e como reproduzi-lo
   - Causa raiz
   - Prioridade (Alta / Média / Baixa) — use os critérios da Aula 06
4. Corrigir o bug no código.
5. Avançar o card na Central de Bugs pelo fluxo: **Aberto → Em Análise →
   Resolvido → Validado**, descrevendo a solução aplicada quando for marcar
   como Resolvido.

## 📦 Estrutura do projeto

```
helpdesk-bugs/
├── backend/     # API Node + Express (dados salvos em backend/data/db.json)
└── frontend/    # App React (Vite)
```

## ▶️ Como rodar

### 1. Back-end

```bash
cd backend
npm install
npm start
```

A API sobe em `http://localhost:4000`.

### 2. Front-end

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

O app abre em `http://localhost:5173` (o Vite já está configurado para
redirecionar `/api` para o back-end na porta 4000).

## 💡 Dicas de investigação

- Teste os filtros e a busca do quadro de chamados: eles funcionam como
  esperado?
- Preste atenção nas cores e nas prioridades. Elas fazem sentido com o que a
  Aula 06 ensinou sobre classificação de incidentes?
- Crie, edite, avance de coluna e exclua chamados. A tela sempre reflete o
  que realmente está no banco de dados?
- Tente abrir um chamado sem preencher tudo direito, ou só com espaços em
  branco. O sistema deveria permitir isso?
- Regras de negócio importam tanto quanto a tela: um chamado deveria poder
  ser encerrado sem passar pela etapa de Validação?
- Use as ferramentas de desenvolvedor do navegador (aba Network/Console) e
  teste a API diretamente (Postman/Insomnia/curl) — nem todo bug aparece só
  olhando a tela.

## 📝 Entregável da aula

Ao final, a turma deve apresentar:

- O quadro de chamados funcionando corretamente.
- Todos os bugs documentados na Central de Bugs, com causa raiz e solução
  aplicada, no fluxo completo (Aberto → Em Análise → Resolvido → Validado).
- Uma breve apresentação do que foi corrigido e do que melhorariam no
  processo de atendimento (conforme o exercício final da Aula 06).

Bom trabalho, equipe de suporte! 🕵️‍♀️🐞
