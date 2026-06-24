import { useState, useEffect, useRef } from 'react';
import { getImages, createImage, updateImage, deleteImage, uploadFile } from '../api';
import { useSite } from '../context/SiteContext';
import { useToast } from '../context/ToastContext.jsx';

const ALL_SECTIONS = [
  { key: 'hero',         label: 'Banner / Hero',                    roles: ['banner'],  sites: ['explore', 'fubono'] },
  { key: 'nosotros',     label: 'Nosotros',                         roles: ['portada'], sites: ['explore', 'fubono'] },
  { key: 'hospedajes',   label: 'Hospedajes (banner)',               roles: ['banner'],  sites: ['explore'] },
  { key: 'recreacion',   label: 'Sitios de Recreación (banner)',     roles: ['banner'],  sites: ['explore'] },
  { key: 'restaurantes', label: 'Restaurantes y Miradores (banner)', roles: ['banner'],  sites: ['explore'] },
  { key: 'galeria',      label: 'Galería de fotos',                  roles: ['galeria'], sites: ['explore', 'fubono'] },
];

const ROLE_LABELS = {
  banner:  'Banner principal',
  portada: 'Imagen de portada',
  logo:    'Logo principal',
  galeria: 'Galería',
  slider:  'Slider / Banner',
};

const EMPTY_FORM = { url: '', publicId: '', role: 'portada', alt: '', order: 0, isActive: true };

export default function ImagesPage() {
  const { siteId } = useSite();
  const toast = useToast();
  const SECTIONS = ALL_SECTIONS.filter(s => s.sites.includes(siteId));
  const [section,    setSection]    = useState('nosotros');
  const [images,     setImages]     = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [form,       setForm]       = useState(EMPTY_FORM);
  const [saving,      setSaving]     = useState(false);
  const [uploading,   setUploading]  = useState(false);
  const [editingId,   setEditingId]  = useState(null);
  const [previewUrl,  setPreviewUrl] = useState('');
  const fileRef  = useRef();
  const formRef  = useRef();

  // Debounce preview so rapid URL keystrokes don't fire network requests continuously
  useEffect(() => {
    if (!form.url) { setPreviewUrl(''); return; }
    const t = setTimeout(() => setPreviewUrl(form.url), 450);
    return () => clearTimeout(t);
  }, [form.url]);

  const currentSection = SECTIONS.find(s => s.key === section);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const data = await getImages(section);
        if (!cancelled) setImages(data);
      } catch (err) {
        if (!cancelled) toast(err.message, 'error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [section]);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url, publicId } = await uploadFile(file, 'image');
      setForm(prev => ({ ...prev, url, publicId: publicId || '' }));
      setPreviewUrl(url);
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSave = async () => {
    if (!form.url.trim()) { toast('La URL de la imagen es requerida', 'error'); return; }
    setSaving(true);
    try {
      if (editingId) {
        const updated = await updateImage(editingId, form);
        setImages(prev => prev.map(img => img._id === editingId ? updated : img));
        toast('Imagen actualizada', 'success');
      } else {
        const created = await createImage({ ...form, section });
        setImages(prev => [...prev, created]);
        toast('Imagen agregada', 'success');
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (img) => {
    setEditingId(img._id);
    setForm({ url: img.url, publicId: img.publicId || '', role: img.role, alt: img.alt || '', order: img.order, isActive: img.isActive });
    setPreviewUrl(img.url);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta imagen?')) return;
    try {
      await deleteImage(id);
      setImages(prev => prev.filter(img => img._id !== id));
      toast('Imagen eliminada', 'success');
    } catch (err) {
      toast(err.message, 'error');
    }
  };

  const cancelEdit = () => { setEditingId(null); setForm(EMPTY_FORM); setPreviewUrl(''); };

  return (
    <div className="page">
      <h2 className="page-title">Imágenes de secciones</h2>

      {/* Tabs */}
      <div className="section-tabs">
        {SECTIONS.map(s => (
          <button
            key={s.key}
            className={'tab-btn' + (section === s.key ? ' active' : '')}
            onClick={() => { setSection(s.key); setForm({ ...EMPTY_FORM, role: s.roles[0] }); setEditingId(null); setPreviewUrl(''); }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Lista de imágenes */}
      {loading ? (
        <p className="page-loading">Cargando imágenes...</p>
      ) : (
        <div className="img-list">
          {images.length === 0 && (
            <p style={{ color: 'var(--muted)', fontSize: 13 }}>
              No hay imágenes para esta sección todavía.
            </p>
          )}
          {images.map(img => (
            <div key={img._id} className={'img-row' + (!img.isActive ? ' img-row--inactive' : '')}>
              <img
                src={img.url}
                alt={img.alt || 'imagen'}
                className="img-thumb"
                onError={e => { e.target.onerror = null; e.target.src = '/images/placeholder.webp'; }}
              />
              <div className="img-meta">
                <span className="card-key">{ROLE_LABELS[img.role] || img.role}</span>
                <p className="img-alt">{img.alt || <em style={{ color: 'var(--muted)' }}>Sin alt</em>}</p>
                <p className="img-url-small">{img.url}</p>
              </div>
              <div className="img-actions">
                <span className={'badge ' + (img.isActive ? 'badge-internal' : 'badge-external')}>
                  {img.isActive ? 'Activa' : 'Oculta'}
                </span>
                <button className="btn-edit-sm" onClick={() => handleEdit(img)}>Editar</button>
                <button className="btn-delete-sm" onClick={() => handleDelete(img._id)}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Formulario agregar / editar */}
      <div ref={formRef} className="card" style={{ marginTop: 24 }}>
        <h3 className="upload-card-title">
          {editingId ? '✏️ Editar imagen' : '➕ Agregar imagen'}
        </h3>

        {/* Upload */}
        <div className="upload-row" style={{ marginBottom: 12 }}>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileUpload} />
          <button className="btn-upload" onClick={() => fileRef.current.click()} disabled={uploading}>
            {uploading ? '⏳ Subiendo...' : '📤 Subir desde PC'}
          </button>
          <span className="upload-hint">JPG, PNG, WebP · máx 10 MB</span>
        </div>

        {/* Preview — uses debounced URL to avoid rapid network requests while typing */}
        {previewUrl && (
          <div className="media-preview">
            <img
              src={previewUrl}
              alt="preview"
              style={{ display: 'block', width: '100%', maxHeight: 160, objectFit: 'cover', borderRadius: 6 }}
              onError={e => { e.target.onerror = null; e.target.src = ''; e.target.style.display = 'none'; }}
            />
          </div>
        )}

        <div className="edit-form">
          <div className="field">
            <label>URL de la imagen</label>
            <input
              value={form.url}
              onChange={e => setForm({ ...form, url: e.target.value })}
              placeholder="https://... o /images/foto.jpg"
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label>Rol</label>
              <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                {currentSection.roles.map(r => (
                  <option key={r} value={r}>{ROLE_LABELS[r] || r}</option>
                ))}
              </select>
            </div>
            <div className="field field-sm">
              <label>Orden</label>
              <input
                type="number"
                min="0"
                value={form.order}
                onChange={e => setForm({ ...form, order: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="field">
            <label>Texto alternativo (alt)</label>
            <input
              value={form.alt}
              onChange={e => setForm({ ...form, alt: e.target.value })}
              placeholder="Descripción de la imagen para accesibilidad"
            />
          </div>

          <div className="field-check">
            <input
              type="checkbox"
              id="img-active"
              checked={form.isActive}
              onChange={e => setForm({ ...form, isActive: e.target.checked })}
            />
            <label htmlFor="img-active">Visible en el sitio</label>
          </div>

          <div className="btn-row">
            <button className="btn-save" onClick={handleSave} disabled={saving}>
              {saving ? 'Guardando...' : editingId ? '💾 Actualizar' : '💾 Guardar imagen'}
            </button>
            {editingId && (
              <button className="btn-cancel" onClick={cancelEdit}>Cancelar</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
