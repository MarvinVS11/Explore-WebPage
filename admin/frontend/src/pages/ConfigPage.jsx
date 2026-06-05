import { useState, useEffect, useRef } from 'react';
import { getConfig, updateConfig, uploadFile } from '../api';

const TEXT_FIELDS = [
  { key: 'siteName',        label: 'Nombre del sitio' },
  { key: 'logoUrl',         label: 'URL del logo' },
  { key: 'faviconUrl',      label: 'URL del favicon' },
  { key: 'whatsappUrl',     label: 'Link de WhatsApp' },
  { key: 'facebookUrl',     label: 'Link de Facebook' },
  { key: 'instagramUrl',    label: 'Link de Instagram' },
  { key: 'whatsappImgUrl',  label: 'Imagen ícono WhatsApp' },
  { key: 'facebookImgUrl',  label: 'Imagen ícono Facebook' },
  { key: 'instagramImgUrl', label: 'Imagen ícono Instagram' },
  { key: 'footerCopyright', label: 'Texto de copyright' },
];

export default function ConfigPage() {
  const [form,         setForm]         = useState({});
  const [saving,       setSaving]       = useState(false);
  const [loading,      setLoading]      = useState(true);
  const [msg,          setMsg]          = useState('');
  const [uploadingImg, setUploadingImg] = useState(false);
  const [uploadingVid, setUploadingVid] = useState(false);
  const [vidProgress,  setVidProgress]  = useState('');

  const videoInputRef = useRef();
  const logoInputRef  = useRef();

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

  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingVid(true);
    setVidProgress(`Subiendo ${file.name}...`);
    setMsg('');
    try {
      const { url } = await uploadFile(file, 'video');
      setForm(prev => ({ ...prev, videoUrl: url }));
      setVidProgress('');
      setMsg('✅ Video subido. Guardá los cambios para aplicarlo.');
    } catch (err) {
      setVidProgress('');
      setMsg('❌ ' + err.message);
    } finally {
      setUploadingVid(false);
      e.target.value = '';
    }
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

      {/* ── Resto de campos ──────────────────────────── */}
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
