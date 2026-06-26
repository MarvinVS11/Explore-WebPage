import { useEffect, useState } from 'react';

function ModalShell({ closing, onClose, handleClose, children }) {
  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className={`modal-panel${closing ? ' closing' : ''}`}
        onClick={e => e.stopPropagation()}
        onAnimationEnd={() => { if (closing) onClose(); }}
      >
        <button className="modal-close" onClick={handleClose} aria-label="Cerrar">✕</button>
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  );
}

function MarketingContent({ data }) {
  return (
    <>
      {data.title && <h2 className="modal-title">{data.title}</h2>}
      {data.body  && <p  className="modal-body">{data.body}</p>}

      {data.beneficiosTitle && <h3 className="modal-section-title">{data.beneficiosTitle}</h3>}
      {data.beneficiosBody  && <p  className="modal-body">{data.beneficiosBody}</p>}

      {data.categoriasTitle && data.categorias?.length > 0 && (
        <>
          <h3 className="modal-section-title">{data.categoriasTitle}</h3>
          <table className="modal-table">
            <thead>
              <tr>
                {data.categorias.map(c => <th key={c.nombre}>{c.nombre}</th>)}
              </tr>
            </thead>
            <tbody>
              <tr>
                {data.categorias.map(c => <td key={c.nombre}>{c.descripcion}</td>)}
              </tr>
              <tr className="modal-table-price">
                {data.categorias.map(c => <td key={c.nombre}><strong>{c.precio}</strong></td>)}
              </tr>
            </tbody>
          </table>
        </>
      )}

      {data.tablaTitle && data.tabla?.length > 0 && (
        <>
          <h3 className="modal-section-title">{data.tablaTitle}</h3>
          <table className="modal-table">
            <thead>
              <tr>
                <th>Beneficio</th>
                {data.categorias?.map(c => <th key={c.nombre}>{c.nombre}</th>)}
              </tr>
            </thead>
            <tbody>
              {data.tabla.map((fila, i) => (
                <tr key={i}>
                  <td>{fila.beneficio}</td>
                  <td className="modal-table-center">{fila.premium}</td>
                  <td className="modal-table-center">{fila.standard}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </>
  );
}

function GenericContent({ data }) {
  return (
    <>
      {data.title && <h2 className="modal-title">{data.title}</h2>}
      {data.body  && <p  className="modal-body">{data.body}</p>}
      {data.subtitle && <p className="modal-subtitle">{data.subtitle}</p>}

      {data.items?.length > 0 && (
        <div className="modal-items">
          {data.items.map((item, i) => (
            <div key={i} className="modal-item">
              <div className="modal-item-text">
                {item.title       && <h3 className="modal-item-title">{item.title}</h3>}
                {item.description && <p  className="modal-item-desc">{item.description}</p>}
              </div>
              {item.imageUrl && (
                <img src={item.imageUrl} alt={item.title || ''} className="modal-item-img" />
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default function Modal({ data, onClose }) {
  const [closing, setClosing] = useState(false);

  const handleClose = () => setClosing(true);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') handleClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, []);

  if (!data) return null;

  return (
    <ModalShell closing={closing} onClose={onClose} handleClose={handleClose}>
      {data.type === 'marketing'
        ? <MarketingContent data={data} />
        : <GenericContent   data={data} />
      }
    </ModalShell>
  );
}
