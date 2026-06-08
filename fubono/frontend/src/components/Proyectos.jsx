import { useState, useEffect } from 'react';
import { getProyectos } from '../api';

function ImagePlaceholder({ side }) {
  return (
    <div className="proyecto-img-placeholder" aria-label={`Imagen ${side}`}>
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="10" width="40" height="30" rx="4" />
        <circle cx="16" cy="22" r="4" />
        <path d="M4 34l10-8 8 6 6-5 16 13" />
      </svg>
      <span>Agregar imagen</span>
    </div>
  );
}

export default function Proyectos() {
  const [projects, setProjects] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [openIdx,  setOpenIdx]  = useState(0);

  useEffect(() => {
    getProyectos()
      .then(data => { setProjects(data); })
      .finally(() => setLoading(false));
  }, []);

  const toggle = (idx) => setOpenIdx(openIdx === idx ? null : idx);

  if (loading) return (
    <section id="proyectos" className="proyectos">
      <div className="proyectos-inner">
        <div className="section-header">
          <div style={{ height: '2rem', background: 'var(--verde-light)', borderRadius: 8, width: '40%', marginBottom: '1rem' }} />
        </div>
        {[1,2,3].map(i => (
          <div key={i} style={{ height: '56px', background: 'var(--bg-alt)', borderRadius: 8, marginBottom: '0.75rem' }} />
        ))}
      </div>
    </section>
  );

  if (projects.length === 0) return null;

  return (
    <section id="proyectos" className="proyectos section-reveal">
      <div className="proyectos-inner">
        <div className="section-header">
          <h2>Nuestros Proyectos</h2>
          <p>Iniciativas de conservación, turismo sostenible y educación ambiental en la región de Occidente</p>
        </div>

        <div className="proyectos-list">
          {projects.map((project, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={project._id} className={`proyecto-item${isOpen ? ' proyecto-item--open' : ''}`}>

                <button
                  className="proyecto-header"
                  onClick={() => toggle(idx)}
                  aria-expanded={isOpen}
                >
                  <h3 className="proyecto-title">{project.title}</h3>
                  <span className="proyecto-chevron" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </button>

                <div className="proyecto-body" aria-hidden={!isOpen}>
                  <div className="proyecto-body-inner">
                  <div className="proyecto-grid">

                    {project.imgLeftUrl
                      ? <img src={project.imgLeftUrl} alt={project.title} className="proyecto-img" />
                      : <ImagePlaceholder side="izquierda" />
                    }

                    <div className="proyecto-content">
                      <p className="proyecto-description">{project.description}</p>

                      {project.links?.filter(l => !l.isPrimary).length > 0 && (
                        <ul className="proyecto-links">
                          {project.links.filter(l => !l.isPrimary).map((link) => (
                            <li key={link._id || link.label}>
                              <a
                                href={link.href}
                                target="_blank"
                                rel="noreferrer"
                                className="proyecto-link"
                              >
                                {link.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}

                      {project.links?.filter(l => l.isPrimary).length > 0 && (
                        <div className="proyecto-btns">
                          {project.links.filter(l => l.isPrimary).map((link) => (
                            <a
                              key={link._id || link.label}
                              href={link.href}
                              target="_blank"
                              rel="noreferrer"
                              className="proyecto-link-primary"
                            >
                              {link.label}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>

                    {project.imgRightUrl
                      ? <img src={project.imgRightUrl} alt={project.title} className="proyecto-img" />
                      : <ImagePlaceholder side="derecha" />
                    }

                  </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
