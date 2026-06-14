import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDocumentos } from '../api';

function fileIcon(fileType) {
  if (!fileType) return '📄';
  if (fileType.includes('pdf'))         return '📕';
  if (fileType.includes('word') || fileType.includes('document')) return '📘';
  if (fileType.includes('excel') || fileType.includes('sheet'))   return '📗';
  if (fileType.includes('powerpoint') || fileType.includes('presentation')) return '📙';
  if (fileType.includes('text') || fileType.includes('csv'))     return '📃';
  return '📄';
}

export default function DocumentosPage() {
  const navigate  = useNavigate();
  const [docs,     setDocs]     = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [catFilter, setCatFilter] = useState('');

  useEffect(() => {
    getDocumentos().then(setDocs).finally(() => setLoading(false));
    window.scrollTo({ top: 0 });
  }, []);

  const categories = [...new Set(docs.map(d => d.category).filter(Boolean))];
  const filtered   = catFilter ? docs.filter(d => d.category === catFilter) : docs;

  return (
    <div className="documentos-page">
      <div className="documentos-header">
        <h1>Documentos</h1>
        <p className="documentos-subtitle">Consulta y descarga los documentos disponibles</p>
      </div>

      {/* Filtros por categoría */}
      {categories.length > 0 && (
        <div className="documentos-cats">
          <button
            className={`doc-cat-btn${catFilter === '' ? ' active' : ''}`}
            onClick={() => setCatFilter('')}
          >Todos</button>
          {categories.map(cat => (
            <button
              key={cat}
              className={`doc-cat-btn${catFilter === cat ? ' active' : ''}`}
              onClick={() => setCatFilter(cat)}
            >{cat}</button>
          ))}
        </div>
      )}

      {/* Lista */}
      <div className="documentos-list">
        {loading && [1, 2, 3, 4].map(i => (
          <div key={i} className="doc-card doc-card--skeleton" />
        ))}

        {!loading && filtered.length === 0 && (
          <p className="documentos-empty">No hay documentos disponibles.</p>
        )}

        {!loading && filtered.map(doc => (
          <a
            key={doc._id}
            href={doc.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="doc-card"
            download={doc.fileName || undefined}
          >
            <span className="doc-icon">{fileIcon(doc.fileType)}</span>
            <div className="doc-info">
              {doc.category && <span className="doc-category">{doc.category}</span>}
              <h3 className="doc-title">{doc.title}</h3>
              {doc.description && <p className="doc-desc">{doc.description}</p>}
              {doc.fileName && <p className="doc-filename">{doc.fileName}</p>}
            </div>
            <span className="doc-download-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
            </span>
          </a>
        ))}
      </div>

      <div className="documentos-footer">
        <button className="btn-volver" onClick={() => navigate('/')}>Volver</button>
      </div>
    </div>
  );
}
