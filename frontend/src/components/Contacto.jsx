import { useState } from 'react';
import useSection from '../hooks/useSection';
import useSiteConfig from '../hooks/useSiteConfig';
import { getImageUrl, sendContactMessage } from '../api';
import Skeleton from './Skeleton';

export default function Contacto() {
  const { data, loading }       = useSection('contacto');
  const { config }              = useSiteConfig();
  const [form, setForm]         = useState({ nombre: '', email: '', mensaje: '' });
  const [status, setStatus]     = useState('idle'); // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const extra = data?.extraData || {};

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre.trim() || !form.email.trim() || !form.mensaje.trim()) return;
    setStatus('sending');
    setErrorMsg('');
    try {
      await sendContactMessage(form);
      setStatus('success');
      setForm({ nombre: '', email: '', mensaje: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message);
      setTimeout(() => setStatus('idle'), 6000);
    }
  };

  if (loading) {
    return (
      <section id="contacto" className="contacto">
        <Skeleton height="2rem" width="40%" />
        <Skeleton height="1rem" width="70%" />
      </section>
    );
  }

  return (
    <section id="contacto" className="contacto section-reveal">
      <div className="contacto-inner">

        {/* Info de contacto */}
        <div className="contacto-info">
          <h2>{data?.title}</h2>
          <p>{data?.body}</p>

          <ul className="contacto-detalle">
            {extra.direccion && <li>📍 {extra.direccion}</li>}
            {extra.telefono  && <li>📞 {extra.telefono}</li>}
            {extra.email     && <li>✉️ {extra.email}</li>}
            {extra.horario   && <li>🕗 {extra.horario}</li>}
          </ul>

          {/* Redes sociales */}
          <div className="contacto-redes">
            {config?.whatsappUrl && (
              <a href={config.whatsappUrl} target="_blank" rel="noreferrer">
                <img
                  src={getImageUrl(config.whatsappImgUrl) || '/images/whatsapp.png'}
                  alt="WhatsApp"
                />
              </a>
            )}
            {config?.facebookUrl && (
              <a href={config.facebookUrl} target="_blank" rel="noreferrer">
                <img
                  src={getImageUrl(config.facebookImgUrl) || '/images/facebook.png'}
                  alt="Facebook"
                />
              </a>
            )}
            {config?.instagramUrl && (
              <a href={config.instagramUrl} target="_blank" rel="noreferrer">
                <img
                  src={getImageUrl(config.instagramImgUrl) || '/images/instagram.png'}
                  alt="Instagram"
                />
              </a>
            )}
          </div>
        </div>

        {/* Formulario */}
        <div className="contacto-form">
          <h3>Envíenos un mensaje</h3>
          <div className="form-group">
            <label>Nombre</label>
            <input
              type="text"
              name="nombre"
              placeholder="Juan Pérez"
              value={form.nombre}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="juan@email.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Mensaje</label>
            <textarea
              name="mensaje"
              placeholder="¿Qué actividades le interesan?"
              value={form.mensaje}
              onChange={handleChange}
              rows={4}
            />
          </div>
          {status === 'success' && (
            <p className="contacto-feedback contacto-feedback--ok">
              ✅ Mensaje enviado. Le responderemos pronto.
            </p>
          )}
          {status === 'error' && (
            <p className="contacto-feedback contacto-feedback--err">
              ❌ {errorMsg || 'No se pudo enviar el mensaje. Intente de nuevo.'}
            </p>
          )}
          <button
            className="btn-primary btn-full"
            onClick={handleSubmit}
            disabled={status === 'sending'}
          >
            {status === 'sending' ? 'Enviando…' : (data?.ctaText || 'Enviar mensaje')}
          </button>
        </div>

      </div>

      {/* WhatsApp flotante */}
      {config?.whatsappUrl && (
        <a
          href={config.whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="whatsapp-flotante"
          aria-label="Contactar por WhatsApp"
        >
          <img
            src={getImageUrl(config.whatsappImgUrl) || '/images/whatsapp.png'}
            alt="WhatsApp"
          />
        </a>
      )}
    </section>
  );
}