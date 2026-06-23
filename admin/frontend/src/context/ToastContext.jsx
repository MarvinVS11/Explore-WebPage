import { createContext, useContext, useState, useCallback, useRef } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const counter = useRef(0);

  const addToast = useCallback((message, type = 'success') => {
    const id = ++counter.current;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      {/* Contenedor de toasts — centrado en pantalla */}
      <div
        style={{
          position:       'fixed',
          top:            '1.5rem',
          left:           '50%',
          translate:      '-50% 0',
          zIndex:         99999,
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          gap:            '0.5rem',
          pointerEvents:  'none',
        }}
      >
        {toasts.map(t => (
          <div
            key={t.id}
            className={`toast show align-items-center text-bg-${t.type === 'error' ? 'danger' : 'success'} border-0`}
            role="alert"
            style={{
              minWidth:     '300px',
              maxWidth:     '480px',
              pointerEvents: 'auto',
              animation:    'toast-in 0.25s ease',
            }}
          >
            <div className="d-flex">
              <div className="toast-body fw-semibold">
                {t.type === 'success' ? '✅ ' : '❌ '}{t.message}
              </div>
              <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                onClick={() => removeToast(t.id)}
                aria-label="Cerrar"
              />
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast debe usarse dentro de ToastProvider');
  return ctx.addToast;
}
