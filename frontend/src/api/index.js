const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ─── Sections ────────────────────────────────────────────────────────────────
export const getSection = async (key) => {
  const res = await fetch(`${BASE}/api/sections/${key}`);
  if (!res.ok) throw new Error(`Error cargando sección: ${key}`);
  return res.json();
};

// ─── Images ──────────────────────────────────────────────────────────────────
export const getImages = async (section, role = '') => {
  const query = role
    ? `section=${section}&role=${role}`
    : `section=${section}`;
  const res = await fetch(`${BASE}/api/images?${query}`);
  if (!res.ok) throw new Error(`Error cargando imágenes: ${section}`);
  return res.json();
};

// ─── Config global ────────────────────────────────────────────────────────────
export const getSiteConfig = async () => {
  const res = await fetch(`${BASE}/api/config/main`);
  if (!res.ok) throw new Error('Error cargando configuración del sitio');
  return res.json();
};

// ─── NavLinks ────────────────────────────────────────────────────────────────
export const getNavLinks = async () => {
  const res = await fetch(`${BASE}/api/navlinks`);
  if (!res.ok) throw new Error('Error cargando links del menú');
  return res.json();
};

// ─── Red Items ────────────────────────────────────────────────────────────────
export const getRedItems = async () => {
  const res = await fetch(`${BASE}/api/reditems`);
  if (!res.ok) throw new Error('Error cargando ítems de la red');
  return res.json();
};

// ─── Hospedajes ───────────────────────────────────────────────────────────────
export const getHospedajes = async () => {
  const res = await fetch(`${BASE}/api/hospedajes`);
  if (!res.ok) return [];
  return res.json();
};

// ─── Documentos ──────────────────────────────────────────────────────────────
export const getDocumentos = async (category = '') => {
  const query = category ? `?category=${encodeURIComponent(category)}` : '';
  const res = await fetch(`${BASE}/api/documentos${query}`);
  if (!res.ok) return [];
  return res.json();
};

// ─── Sitios de Recreación ────────────────────────────────────────────────────
export const getSitiosRecreacion = async () => {
  const res = await fetch(`${BASE}/api/sitios-recreacion`);
  if (!res.ok) return [];
  return res.json();
};

// ─── Helper URL de imágenes ──────────────────────────────────────────────────
export const getImageUrl = (url) => {
  if (!url) return '/images/placeholder.webp';
  if (url.startsWith('http')) return url;
  return `${BASE}${url}`;
};

// ─── Helper URL de documentos ────────────────────────────────────────────────
// URLs GridFS (/api/files/:id) se sirven desde el backend público con Content-Disposition: inline
export const getDocumentUrl = (url) => {
  if (!url) return '#';
  // URL relativa de GridFS → prefija con la base del API público
  if (url.startsWith('/api/files/')) return `${BASE}${url}`;
  // URL Cloudinary legacy: añade fl_inline para que abra en navegador
  if (url.includes('res.cloudinary.com') && url.includes('/raw/upload/')) {
    return url.replace('/raw/upload/', '/raw/upload/fl_inline,fl_attachment:false/');
  }
  return url;
};