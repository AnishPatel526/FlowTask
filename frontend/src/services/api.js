const BASE_URL = '/api/tasks';

async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

const api = {
  getTasks: () => request(BASE_URL),
  createTask: (data) => request(BASE_URL, { method: 'POST', body: JSON.stringify(data) }),
  updateTask: (id, data) => request(`${BASE_URL}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTask: (id) => request(`${BASE_URL}/${id}`, { method: 'DELETE' })
};

export default api;