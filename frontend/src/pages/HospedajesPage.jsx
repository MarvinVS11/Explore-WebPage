import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHospedajes, getSection, getImages, getImageUrl } from '../api';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function pdfProxyUrl(url) {
  return `${API_BASE}/api/pdf?url=${encodeURIComponent(url)}`;
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="hospedaje-pin-icon">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hospedaje-link-icon">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
      <polyline points="15 3 21 3 21 9"/>
      <line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
  );
}

export default function HospedajesPage() {
  const navigate  = useNavigate();
  const listRef   = useRef(null);
  const [hospedajes, setHospedajes] = useState([]);
  const [section,    setSection]    = useState(null);
  const [banner,     setBanner]     = useState(null);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    Promise.all([
      getHospedajes(),
      getSection('hospedajes').catch(() => null),
      getImages('hospedajes', 'banner').catch(() => []),
    ]).then(([items, sec, imgs]) => {
      setHospedajes(items);
      setSection(sec);
      setBanner(imgs.find(i => i.isActive !== false) || null);
    }).finally(() => setLoading(false));

    window.scrollTo({ top: 0 });
  }, []);

  // Observer de entrada — se repite en cada scroll
  useEffect(() => {
    if (loading || !listRef.current) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('card-visible');
        } else {
          entry.target.classList.remove('card-visible');
        }
      }),
      { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
    );
    listRef.current.querySelectorAll('.hospedaje-card').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [loading]);

  return (
    <div className="hospedajes-page">

      {/* Banner */}
      <div className="hospedajes-banner">
        {banner
          ? <img src={getImageUrl(banner.url)} alt={banner.alt || 'Hospedajes'} className="hospedajes-banner-img" />
          : <div className="hospedajes-banner-placeholder" />
        }
      </div>

      {/* Encabezado */}
      <div className="hospedajes-header">
        <h1>{section?.title || 'Hospedajes'}</h1>
        {section?.body && <p className="hospedajes-desc">{section.body}</p>}
      </div>

      {/* Lista */}
      <div className="hospedajes-list" ref={listRef}>
        {loading && [1, 2, 3].map(i => (
          <div key={i} className="hospedaje-card hospedaje-card--skeleton" />
        ))}

        {!loading && hospedajes.map((h, idx) => {
          const isAlt = idx % 2 === 1;
          return (
          <div key={h._id} className={`hospedaje-card${isAlt ? ' hospedaje-card--alt' : ''} ${isAlt ? 'reveal-right' : 'reveal-left'}`}>
            <div className="hospedaje-info">
              <h2 className="hospedaje-title">{h.title}</h2>
              <p className="hospedaje-description">{h.description}</p>
              <div className="hospedaje-actions">
                {h.mapsUrl && (
                  <a href={h.mapsUrl} target="_blank" rel="noreferrer" className="hospedaje-maps-btn" title="Ver en Google Maps">
                    <PinIcon />
                  </a>
                )}
                {h.linkUrl && (
                  <a
                    href={h.linkUrl.toLowerCase().endsWith('.pdf')
                      ? pdfProxyUrl(h.linkUrl)
                      : h.linkUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="hospedaje-link-btn"
                  >
                    <LinkIcon />
                    Ver más...
                  </a>
                )}
              </div>
            </div>
            <div className="hospedaje-img-wrap">
              {h.imageUrl
                ? <img src={getImageUrl(h.imageUrl)} alt={h.title} className="hospedaje-img" />
                : <div className="hospedaje-img-placeholder" />
              }
            </div>
          </div>
          );
        })}

        {!loading && hospedajes.length === 0 && (
          <p className="hospedajes-empty">No hay hospedajes disponibles.</p>
        )}
      </div>

      {/* Botón Volver */}
      <div className="hospedajes-footer">
        <button className="btn-volver" onClick={() => navigate('/#redturismo')}>
          Volver
        </button>
      </div>

    </div>
  );
}
