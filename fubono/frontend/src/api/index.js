const BASE    = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const SITE_ID = 'fubono';

const siteHeaders = { 'X-Site-Id': SITE_ID };

export const getSection = async (key) => {
  const res = await fetch(`${BASE}/api/sections/${key}`, { headers: siteHeaders });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Error cargando sección: ${key}`);
  return res.json();
};

export const getImages = async (section, role = '') => {
  const query = role ? `section=${section}&role=${role}` : `section=${section}`;
  const res = await fetch(`${BASE}/api/images?${query}`, { headers: siteHeaders });
  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`Error cargando imágenes: ${section}`);
  return res.json();
};

export const getSiteConfig = async () => {
  const res = await fetch(`${BASE}/api/config/main`, { headers: siteHeaders });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Error cargando configuración del sitio');
  return res.json();
};

export const getProyectos = async () => {
  const res = await fetch(`${BASE}/api/projects`, { headers: siteHeaders });
  if (!res.ok) return [];
  return res.json();
};

export const getNavLinks = async () => {
  const res = await fetch(`${BASE}/api/navlinks`, { headers: siteHeaders });
  if (!res.ok) return [];
  return res.json();
};

export const getRedItems = async () => {
  const res = await fetch(`${BASE}/api/reditems`, { headers: siteHeaders });
  if (!res.ok) return [];
  return res.json();
};

export const getImageUrl = (url) => {
  if (!url) return '/images/placeholder.webp';
  if (url.startsWith('http')) return url;
  return `${BASE}${url}`;
};
