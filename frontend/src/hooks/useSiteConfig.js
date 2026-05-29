import { useState, useEffect } from 'react';
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

// ─── Helper URL de imágenes ──────────────────────────────────────────────────
export const getImageUrl = (url) => {
  if (!url) return '/images/placeholder.webp';
  if (url.startsWith('http')) return url;
  return `${BASE}${url}`;
};

export default function useSiteConfig() {
  const [config, setConfig] = useState(null);
  const [navLinks, setNavLinks] = useState([]);
  const [redItems, setRedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    Promise.all([getSiteConfig(), getNavLinks(), getRedItems()])
      .then(([siteConfig, navLinksData, redItemsData]) => {
        setConfig(siteConfig);
        setNavLinks(navLinksData);
        setRedItems(redItemsData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { config, navLinks, redItems, loading, error };
}
