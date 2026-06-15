import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getRestaurantesSodas,
  getMiradoresSitios,
  getAreasProtegidas,
  getSection,
  getImages,
  getImageUrl,
} from '../api';

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  );
}

function TreeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
      <path d="M17 12l-5-8-5 8h3v4h4v-4h3zM12 2L4 14h5v4h6v-4h5L12 2z"/>
    </svg>
  );
}

export default function RestaurantesMiradoresPage() {
  const navigate = useNavigate();

  const [restaurantes, setRestaurantes] = useState([]);
  const [miradores,    setMiradores]    = useState([]);
  const [areas,        setAreas]        = useState([]);
  const [section,      setSection]      = useState(null);
  const [banner,       setBanner]       = useState(null);
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    Promise.all([
      getRestaurantesSodas(),
      getMiradoresSitios(),
      getAreasProtegidas(),
      getSection('restaurantes').catch(() => null),
      getImages('restaurantes', 'banner').catch(() => []),
    ]).then(([rest, mir, areas, sec, imgs]) => {
      setRestaurantes(rest);
      setMiradores(mir);
      setAreas(areas);
      setSection(sec);
      setBanner(imgs.find(i => i.isActive !== false) || null);
    }).finally(() => setLoading(false));

    window.scrollTo({ top: 0 });
  }, []);

  if (loading) {
    return (
      <div className="rest-page">
        <div className="rest-loading">
          <div className="rest-spinner" />
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  const titulo     = section?.title       || 'Restaurantes y Miradores';
  const subtitulo  = section?.subtitle    || '';
  const bannerUrl  = banner ? getImageUrl(banner.url) : null;

  return (
    <div className="rest-page">

      {/* ── Banner ─────────────────────────────────────────────── */}
      <div className="rest-banner" style={bannerUrl ? { backgroundImage: `url(${bannerUrl})` } : {}}>
        <div className="rest-banner-overlay" />
        <div className="rest-banner-content">
          <h1>{titulo}</h1>
          {subtitulo && <p>{subtitulo}</p>}
        </div>
      </div>

      {/* ── Descripción principal ──────────────────────────────── */}
      <section className="rest-intro">
        <h2 className="rest-intro-title">Elementos Complementarios de la Red de Turismo Sostenible</h2>
        <p className="rest-intro-desc">
          {section?.body ||
            'Descubre los establecimientos, miradores naturales y espacios protegidos que complementan la experiencia turística sostenible de nuestra red.'}
        </p>
      </section>

      {/* ── Tabla 1: Restaurantes & Sodas ─────────────────────── */}
      <section className="rest-section">
        <div className="rest-section-header rest-header-green">
          <span className="rest-section-icon">🍽️</span>
          <h3>Restaurantes &amp; Sodas</h3>
        </div>
        {restaurantes.length === 0 ? (
          <p className="rest-empty">No hay establecimientos registrados aún.</p>
        ) : (
          <div className="rest-table-wrap">
            <table className="rest-table">
              <thead>
                <tr>
                  <th>Restaurante &amp; Soda</th>
                  <th><PhoneIcon /> Teléfono</th>
                  <th><LocationIcon /> Distrito &amp; Cantón</th>
                </tr>
              </thead>
              <tbody>
                {restaurantes.map((r) => (
                  <tr key={r._id}>
                    <td data-label="Restaurante & Soda">
                      <span className="rest-name">{r.nombre}</span>
                    </td>
                    <td data-label="Teléfono">
                      {r.telefono
                        ? <a href={`tel:${r.telefono}`} className="rest-tel">{r.telefono}</a>
                        : <span className="rest-na">—</span>}
                    </td>
                    <td data-label="Distrito & Cantón">
                      {[r.distrito, r.canton].filter(Boolean).join(', ') || <span className="rest-na">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── Tabla 2: Miradores & Sitios ───────────────────────── */}
      <section className="rest-section">
        <div className="rest-section-header rest-header-teal">
          <span className="rest-section-icon">🏔️</span>
          <h3>Miradores y Sitios de Recreación</h3>
        </div>
        {miradores.length === 0 ? (
          <p className="rest-empty">No hay miradores registrados aún.</p>
        ) : (
          <div className="rest-table-wrap">
            <table className="rest-table">
              <thead>
                <tr>
                  <th>Sitio</th>
                  <th><LocationIcon /> Cantón</th>
                </tr>
              </thead>
              <tbody>
                {miradores.map((m) => (
                  <tr key={m._id}>
                    <td data-label="Sitio">
                      <span className="rest-name">{m.sitio}</span>
                    </td>
                    <td data-label="Cantón">
                      {m.canton || <span className="rest-na">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── Tabla 3: Áreas Silvestres Protegidas ──────────────── */}
      <section className="rest-section">
        <div className="rest-section-header rest-header-earth">
          <TreeIcon />
          <h3>Áreas Silvestres Protegidas Cercanas</h3>
        </div>
        {areas.length === 0 ? (
          <p className="rest-empty">No hay áreas protegidas registradas aún.</p>
        ) : (
          <div className="rest-table-wrap">
            <table className="rest-table rest-table-single">
              <thead>
                <tr>
                  <th>Área Silvestre Protegida</th>
                </tr>
              </thead>
              <tbody>
                {areas.map((a) => (
                  <tr key={a._id}>
                    <td data-label="Área Silvestre Protegida">
                      <span className="rest-name rest-area-name">
                        <TreeIcon /> {a.nombre}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── Footer flotante: botón Volver ─────────────────────── */}
      <div className="rest-footer" style={{ height: 0, padding: 0, overflow: 'visible' }}>
        <button className="btn-volver" onClick={() => navigate(-1)}>
          ← Volver
        </button>
      </div>
    </div>
  );
}
