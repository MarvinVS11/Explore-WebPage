import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSitiosRecreacion, getSection, getImages, getImageUrl } from '../api';

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="recreacion-pin-icon">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="recreacion-link-icon">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
      <polyline points="15 3 21 3 21 9"/>
      <line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
  );
}

export default function SitiosRecreacionPage() {
  const navigate = useNavigate();
  const listRef  = useRef(null);
  const [sitios,  setSitios]  = useState([]);
  const [section, setSection] = useState(null);
  const [banner,  setBanner]  = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getSitiosRecreacion(),
      getSection('recreacion').catch(() => null),
      getImages('recreacion', 'banner').catch(() => []),
    ]).then(([items, sec, imgs]) => {
      setSitios(items);
      setSection(sec);
      setBanner(imgs.find(i => i.isActive !== false) || null);
    }).finally(() => setLoading(false));

    window.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    if (loading || !listRef.current) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('recreacion-card-visible');
        } else {
          entry.target.classList.remove('recreacion-card-visible');
        }
      }),
      { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
    );
    listRef.current.querySelectorAll('.recreacion-card').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [loading]);

  return (
    <div className="recreacion-page">

      {/* Banner */}
      <div className="recreacion-banner">
        {banner
          ? <img src={getImageUrl(banner.url)} alt={banner.alt || 'Sitios de Recreación'} className="recreacion-banner-img" />
          : <div className="recreacion-banner-placeholder" />
        }
        <div className="recreacion-banner-overlay" />
        <div className="recreacion-banner-title">
          <h1>{section?.title || 'Sitios de Recreación'}</h1>
        </div>
      </div>

      {/* Descripción */}
      {section?.body && (
        <div className="recreacion-header">
          <p className="recreacion-desc">{section.body}</p>
        </div>
      )}

      {/* Lista de sitios */}
      <div className="recreacion-list" ref={listRef}>
        {loading && [1, 2, 3].map(i => (
          <div key={i} className="recreacion-card recreacion-card--skeleton" />
        ))}

        {!loading && sitios.map((s, idx) => {
          const isAlt = idx % 2 === 1;
          return (
            <div
              key={s._id}
              className={`recreacion-card${isAlt ? ' recreacion-card--alt' : ''} ${isAlt ? 'recreacion-reveal-right' : 'recreacion-reveal-left'}`}
            >
              <div className="recreacion-img-wrap">
                {s.imageUrl
                  ? <img src={getImageUrl(s.imageUrl)} alt={s.title} className="recreacion-img" />
                  : <div className="recreacion-img-placeholder" />
                }
              </div>
              <div className="recreacion-info">
                <h2 className="recreacion-title">{s.title}</h2>
                <p className="recreacion-description">{s.description}</p>
                <div className="recreacion-actions">
                  {s.mapsUrl && (
                    <a href={s.mapsUrl} target="_blank" rel="noreferrer" className="recreacion-maps-btn" title="Ver en Google Maps">
                      <PinIcon />
                    </a>
                  )}
                  {s.linkUrl && (
                    <a href={s.linkUrl} target="_blank" rel="noreferrer" className="recreacion-link-btn">
                      <LinkIcon />
                      Ver más...
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {!loading && sitios.length === 0 && (
          <p className="recreacion-empty">No hay sitios de recreación disponibles.</p>
        )}
      </div>

      {/* Botón Volver */}
      <div className="recreacion-footer">
        <button className="btn-volver" onClick={() => navigate('/#redturismo')}>
          Volver
        </button>
      </div>

    </div>
  );
}
