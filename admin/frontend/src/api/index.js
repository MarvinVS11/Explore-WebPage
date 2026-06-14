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

// ─── Hospedajes ───────────────────────────────────────────
export const getHospedajes    = ()         => request('/api/hospedajes');
export const createHospedaje  = (body)     =>
  request('/api/hospedajes', { method: 'POST', body: JSON.stringify(body) });
export const updateHospedaje  = (id, body) =>
  request(`/api/hospedajes/${id}`, { method: 'PUT', body: JSON.stringify(body) });
export const deleteHospedaje  = (id)       =>
  request(`/api/hospedajes/${id}`, { method: 'DELETE' });

// ─── Documentos ───────────────────────────────────────────────────────────────
export const getDocumentos    = (category) =>
  request(`/api/documentos${category ? `?category=${encodeURIComponent(category)}` : ''}`);
export const createDocumento  = (body)     =>
  request('/api/documentos', { method: 'POST', body: JSON.stringify(body) });
export const updateDocumento  = (id, body) =>
  request(`/api/documentos/${id}`, { method: 'PUT', body: JSON.stringify(body) });
export const deleteDocumento  = (id)       =>
  request(`/api/documentos/${id}`, { method: 'DELETE' });

export const uploadDocumento = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${BASE}/upload/documento`, {
    method:  'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('admin_token') || ''}`,
      'X-Site-Id':   localStorage.getItem('admin_site') || 'explore',
    },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al subir documento');
  return data;
};

// ─── Sitios de Recreación ──────────────────────────────────────
export const getSitiosRecreacion    = ()         => request('/api/sitios-recreacion');
export const createSitioRecreacion  = (body)     =>
  request('/api/sitios-recreacion', { method: 'POST', body: JSON.stringify(body) });
export const updateSitioRecreacion  = (id, body) =>
  request(`/api/sitios-recreacion/${id}`, { method: 'PUT', body: JSON.stringify(body) });
export const deleteSitioRecreacion  = (id)       =>
  request(`/api/sitios-recreacion/${id}`, { method: 'DELETE' });

// ─── Restaurantes & Sodas ─────────────────────────────────────
export const getRestaurantesSodas    = ()         => request('/api/restaurantes-sodas');
export const createRestauranteSoda   = (body)     =>
  request('/api/restaurantes-sodas', { method: 'POST', body: JSON.stringify(body) });
export const updateRestauranteSoda   = (id, body) =>
  request(`/api/restaurantes-sodas/${id}`, { method: 'PUT', body: JSON.stringify(body) });
export const deleteRestauranteSoda   = (id)       =>
  request(`/api/restaurantes-sodas/${id}`, { method: 'DELETE' });

// ─── Miradores & Sitios ───────────────────────────────────────
export const getMiradoresSitios    = ()         => request('/api/miradores-sitios');
export const createMiradorSitio    = (body)     =>
  request('/api/miradores-sitios', { method: 'POST', body: JSON.stringify(body) });
export const updateMiradorSitio    = (id, body) =>
  request(`/api/miradores-sitios/${id}`, { method: 'PUT', body: JSON.stringify(body) });
export const deleteMiradorSitio    = (id)       =>
  request(`/api/miradores-sitios/${id}`, { method: 'DELETE' });

// ─── Áreas Protegidas ─────────────────────────────────────────
export const getAreasProtegidas    = ()         => request('/api/areas-protegidas');
export const createAreaProtegida   = (body)     =>
  request('/api/areas-protegidas', { method: 'POST', body: JSON.stringify(body) });
export const updateAreaProtegida   = (id, body) =>
  request(`/api/areas-protegidas/${id}`, { method: 'PUT', body: JSON.stringify(body) });
export const deleteAreaProtegida   = (id)       =>
  request(`/api/areas-protegidas/${id}`, { method: 'DELETE' });

// ─── Projects ─────────────────────────────────────────────────
export const getProyectos   = ()         => request('/api/projects');
export const createProyecto = (body)     =>
  request('/api/projects', { method: 'POST', body: JSON.stringify(body) });
export const updateProyecto = (id, body) =>
  request(`/api/projects/${id}`, { method: 'PUT', body: JSON.stringify(body) });
export const deleteProyecto = (id)       =>
  request(`/api/projects/${id}`, { method: 'DELETE' });

export const uploadProyectoImage = async (id, side, file) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${BASE}/api/projects/${id}/image/${side}`, {
    method:  'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('admin_token') || ''}`,
      'X-Site-Id':   localStorage.getItem('admin_site') || 'explore',
    },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al subir imagen');
  return data;
};
