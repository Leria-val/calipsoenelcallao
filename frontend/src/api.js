const BASE_URL = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok && res.status !== 204) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Erro na requisição (${res.status})`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  getTickets: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/tickets${query ? `?${query}` : ''}`);
  },
  getTicket: (id) => request(`/tickets/${id}`),
  createTicket: (data) =>
    request('/tickets', { method: 'POST', body: JSON.stringify(data) }),
  updateStatus: (id, status) =>
    request(`/tickets/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  validarTicket: (id) =>
    request(`/tickets/${id}/validar`, { method: 'PATCH' }),
  deleteTicket: (id) => request(`/tickets/${id}`, { method: 'DELETE' }),

  getBugs: () => request('/bugs'),
  createBug: (data) =>
    request('/bugs', { method: 'POST', body: JSON.stringify(data) }),
  updateBug: (id, data) =>
    request(`/bugs/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteBug: (id) => request(`/bugs/${id}`, { method: 'DELETE' }),
};
