const BASE = import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:5001';

const headers = () => ({
  'Content-Type': 'application/json',
  Authorization:  `Bearer ${localStorage.getItem('admin_token') || ''}`,
  'X-Site-Id':    localStorage.getItem('admin_site') || 'explore',
});

async function request(url, options = {}) {
  const res = await fetch(`${BASE}${url}`, { ...options, headers: headers() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
  return data;
}

// ─── Auth ─────────────────────────────────────────────────────────
export const login = async (email, password) => {
  const res = await fetch(`${BASE}/auth/login`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Credenciales incorrectas');
  return data;
};

// ─── Sections ─────────────────────────────────────────────────────
export const getSections    = () => request('/api/sections');
export const updateSection  = (key, body) =>
  request(`/api/sections/${key}`, { method: 'PUT', body: JSON.stringify(body) });

// ─── Config ───────────────────────────────────────────────────────
export const getConfig    = (key = 'main') => request(`/api/config/${key}`);
export const updateConfig = (key = 'main', body) =>
  request(`/api/config/${key}`, { method: 'PUT', body: JSON.stringify(body) });

// ─── NavLinks ─────────────────────────────────────────────────────
export const getNavLinks    = ()        => request('/api/navlinks');
export const createNavLink  = (body)    =>
  request('/api/navlinks', { method: 'POST', body: JSON.stringify(body) });
export const updateNavLink  = (id, body) =>
  request(`/api/navlinks/${id}`, { method: 'PUT', body: JSON.stringify(body) });
export const deleteNavLink  = (id)      =>
  request(`/api/navlinks/${id}`, { method: 'DELETE' });

// ─── Upload ───────────────────────────────────────────────────────
export const uploadFile = async (file, type = 'image') => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${BASE}/upload/${type}`, {
    method:  'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('admin_token') || ''}`,
      'X-Site-Id':   localStorage.getItem('admin_site') || 'explore',
    },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Error al subir ${type}`);
  return data;
};

// ─── Images ───────────────────────────────────────────────────────
export const getImages     = (section) =>
  request(`/api/images${section ? `?section=${section}` : ''}`);
export const createImage   = (body)    =>
  request('/api/images', { method: 'POST', body: JSON.stringify(body) });
export const updateImage   = (id, body) =>
  request(`/api/images/${id}`, { method: 'PUT', body: JSON.stringify(body) });
export const deleteImage   = (id)      =>
  request(`/api/images/${id}`, { method: 'DELETE' });

// ─── RedItems ─────────────────────────────────────────────────────
export const getRedItems    = ()        => request('/api/reditems');
export const createRedItem  = (body)    =>
  request('/api/reditems', { method: 'POST', body: JSON.stringify(body) });
export const updateRedItem  = (id, body) =>
  request(`/api/reditems/${id}`, { method: 'PUT', body: JSON.stringify(body) });
export const deleteRedItem  = (id)      =>
  request(`/api/reditems/${id}`, { method: 'DELETE' });
