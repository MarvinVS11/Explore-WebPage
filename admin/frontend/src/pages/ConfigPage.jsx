import { useState, useEffect, useRef } from 'react';
import { getConfig, updateConfig, uploadFile } from '../api';

const TEXT_FIELDS = [
  { key: 'siteName',        label: 'Nombre del sitio' },
  { key: 'faviconUrl',      label: 'URL del favicon' },
  { key: 'footerCopyright', label: 'Texto de copyright' },
];

const SOCIAL_FIELDS = [
  { key: 'whatsapp',  label: 'WhatsApp',  urlKey: 'whatsappUrl',     imgKey: 'whatsappImgUrl',  emoji: '💬' },
  { key: 'facebook',  label: 'Facebook',  urlKey: 'facebookUrl',     imgKey: 'facebookImgUrl',  emoji: '📘' },
  { key: 'instagram', label: 'Instagram', urlKey: 'instagramUrl',    imgKey: 'instagramImgUrl', emoji: '📷' },
];

export default function ConfigPage() {
  const [form,         setForm]         = useState({});
  const [saving,       setSaving]       = useState(false);
  const [loading,      setLoading]      = useState(true);
  const [msg,          setMsg]          = useState('');
  const [uploadingImg, setUploadingImg] = useState(false);
  const [uploadingVid, setUploadingVid] = useState(false);
  const [vidProgress,  setVidProgress]  = useState('');
  const [uploadingSocial, setUploadingSocial] = useState({});

  const videoInputRef = useRef();
  const logoInputRef  = useRef();
  const socialRefs    = useRef({});

  useEffect(() => {
    getConfig('main')
      .then(data => setForm(data))
      .catch(err => setMsg('❌ ' + err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMsg('');
    try {
      await updateConfig('main', form);
      setMsg('✅ Configuración guardada correctamente');
    } catch (err) {
      setMsg('❌ ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingVid(true);
    setVidProgress('0%');
    setMsg('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'nezf1ovv');

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://api.cloudinary.com/v1_1/diuqs187g/video/upload');

    xhr.upload.onprogress = (ev) => {
      if (ev.lengthComputable) {
        setVidProgress(`${Math.round((ev.loaded / ev.total) * 100)}%`);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const result = JSON.parse(xhr.responseText);
        setForm(prev => ({ ...prev, videoUrl: result.secure_url }));
        setMsg('✅ Video subido. Guardá los cambios para aplicarlo.');
      } else {
        setMsg('❌ Error al subir el video a Cloudinary');
      }
      setVidProgress('');
      setUploadingVid(false);
      e.target.value = '';
    };

    xhr.onerror = () => {
      setMsg('❌ Error de conexión al subir el video');
      setVidProgress('');
      setUploadingVid(false);
      e.target.value = '';
    };

    xhr.send(formData);
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImg(true);
    setMsg('');
    try {
      const { url } = await uploadFile(file, 'image');
      setForm(prev => ({ ...prev, logoUrl: url }));
      setMsg('✅ Logo subido. Guardá los cambios para aplicarlo.');
    } catch (err) {
      setMsg('❌ ' + err.message);
    } finally {
      setUploadingImg(false);
      e.target.value = '';
    }
  };

  const handleSocialImgUpload = async (e, imgKey, label) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingSocial(prev => ({ ...prev, [imgKey]: true }));
    setMsg('');
    try {
      const { url } = await uploadFile(file, 'image');
      setForm(prev => ({ ...prev, [imgKey]: url }));
      setMsg(`✅ Imagen de ${label} subida. Guardá los cambios para aplicarla.`);
    } catch (err) {
      setMsg('❌ ' + err.message);
    } finally {
      setUploadingSocial(prev => ({ ...prev, [imgKey]: false }));
      e.target.value = '';
    }
  };

  if (loading) return <div className="page-loading">Cargando configuración...</div>;

  return (
    <div className="page">
      <h2 className="page-title">Configuración del sitio</h2>
      {msg && <p className="status-msg">{msg}</p>}

      {/* ── Video de fondo ──────────────────────────── */}
      <div className="card upload-card">
        <h3 className="upload-card-title">🎬 Video de fondo (Hero)</h3>

        {form.videoUrl && (
          <div className="media-preview">
            <video
              src={form.videoUrl}
              controls
              muted
              style={{ width: '100%', maxHeight: 200, borderRadius: 8 }}
            />
            <p className="media-url">{form.videoUrl}</p>
          </div>
        )}

        <div className="upload-row">
          <input
            ref={videoInputRef}
            type="file"
            accept="video/mp4,video/webm,video/ogg"
            style={{ display: 'none' }}
            onChange={handleVideoUpload}
          />
          <button
            className="btn-upload"
            onClick={() => videoInputRef.current.click()}
            disabled={uploadingVid}
          >
            {uploadingVid ? '⏳ Subiendo...' : '📤 Subir video'}
          </button>
          {vidProgress && <span className="upload-progress">{vidProgress}</span>}
          <span className="upload-hint">MP4, WebM · máx 150 MB</span>
        </div>

        <div className="field" style={{ marginTop: 12 }}>
          <label>O pegá la URL del video</label>
          <input
            value={form.videoUrl || ''}
            onChange={e => setForm({ ...form, videoUrl: e.target.value })}
            placeholder="https://... o /video/video.mp4"
          />
        </div>
      </div>

      {/* ── Logo ────────────────────────────────────── */}
      <div className="card upload-card">
        <h3 className="upload-card-title">🖼️ Logo del sitio</h3>

        {form.logoUrl && (
          <div className="media-preview">
            <img
              src={form.logoUrl}
              alt="Logo"
              style={{ maxHeight: 80, objectFit: 'contain' }}
              onError={e => e.target.style.display = 'none'}
            />
            <p className="media-url">{form.logoUrl}</p>
          </div>
        )}

        <div className="upload-row">
          <input
            ref={logoInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            style={{ display: 'none' }}
            onChange={handleLogoUpload}
          />
          <button
            className="btn-upload"
            onClick={() => logoInputRef.current.click()}
            disabled={uploadingImg}
          >
            {uploadingImg ? '⏳ Subiendo...' : '📤 Subir logo'}
          </button>
          <span className="upload-hint">JPG, PNG, WebP · máx 5 MB</span>
        </div>

        <div className="field" style={{ marginTop: 12 }}>
          <label>O pegá la URL del logo</label>
          <input
            value={form.logoUrl || ''}
            onChange={e => setForm({ ...form, logoUrl: e.target.value })}
            placeholder="https://... o /images/logo.png"
          />
        </div>
      </div>

      {/* ── Redes sociales ──────────────────────────── */}
      <div className="card upload-card">
        <h3 className="upload-card-title">📲 Redes sociales</h3>

        {SOCIAL_FIELDS.map(({ key, label, urlKey, imgKey, emoji }) => (
          <div key={key} className="social-config-block">
            <p className="social-config-label">{emoji} {label}</p>

            <div className="field">
              <label>Link de {label}</label>
              <input
                value={form[urlKey] || ''}
                onChange={e => setForm({ ...form, [urlKey]: e.target.value })}
                placeholder={`https://wa.me/... o https://www.${key}.com/...`}
              />
            </div>

            <div className="field">
              <label>Ícono / imagen</label>
              <div className="social-img-row">
                {form[imgKey] && (
                  <img
                    src={form[imgKey]}
                    alt={`Ícono ${label}`}
                    className="social-img-preview"
                    onError={e => e.target.style.display = 'none'}
                  />
                )}
                <div style={{ flex: 1 }}>
                  <div className="upload-row" style={{ marginBottom: 8 }}>
                    <input
                      ref={el => socialRefs.current[key] = el}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/svg+xml"
                      style={{ display: 'none' }}
                      onChange={e => handleSocialImgUpload(e, imgKey, label)}
                    />
                    <button
                      className="btn-upload"
                      onClick={() => socialRefs.current[key]?.click()}
                      disabled={uploadingSocial[imgKey]}
                    >
                      {uploadingSocial[imgKey] ? '⏳ Subiendo...' : '📤 Subir imagen'}
                    </button>
                    <span className="upload-hint">PNG, SVG, WebP</span>
                  </div>
                  <input
                    value={form[imgKey] || ''}
                    onChange={e => setForm({ ...form, [imgKey]: e.target.value })}
                    placeholder="https://... o pegá la URL del ícono"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 13 }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Datos generales ──────────────────────────── */}
      <div className="card">
        <h3 className="upload-card-title">⚙️ Datos generales</h3>
        {TEXT_FIELDS.map(({ key, label }) => (
          <div className="field" key={key}>
            <label>{label}</label>
            <input
              value={form[key] || ''}
              onChange={e => setForm({ ...form, [key]: e.target.value })}
            />
          </div>
        ))}
      </div>

      <div className="btn-row" style={{ marginTop: 8 }}>
        <button className="btn-save" onClick={handleSave} disabled={saving}>
          {saving ? 'Guardando...' : '💾 Guardar todos los cambios'}
        </button>
      </div>
    </div>
  );
}
