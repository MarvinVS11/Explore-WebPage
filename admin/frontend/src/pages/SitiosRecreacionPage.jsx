import { useState, useEffect, useRef } from 'react';
import {
  getSitiosRecreacion, createSitioRecreacion,
  updateSitioRecreacion, deleteSitioRecreacion, uploadFile,
} from '../api';
import { useToast } from '../context/ToastContext.jsx';

const EMPTY = { title: '', description: '', imageUrl: '', mapsUrl: '', linkUrl: '', order: 0, isVisible: true };

export default function SitiosRecreacionPage() {
  const toast = useToast();
  const [items,     setItems]     = useState([]);
  const [editing,   setEditing]   = useState(null);
  const [adding,    setAdding]    = useState(false);
  const [form,      setForm]      = useState(EMPTY);
  const [saving,    setSaving]    = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading,   setLoading]   = useState(true);
  const fileRef = useRef();

  const load = () =>
    getSitiosRecreacion()
      .then(setItems)
      .catch(e => toast(e.message, 'error'))
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const startAdd = () => {
    setAdding(true); setEditing(null);
    setForm({ ...EMPTY, order: items.length + 1 });
  };

  const startEdit = (item) => {
    setEditing(item._id); setAdding(false);
    setForm({ title: item.title, description: item.description, imageUrl: item.imageUrl,
              mapsUrl: item.mapsUrl, linkUrl: item.linkUrl, order: item.order, isVisible: item.isVisible });
  };

  const cancel = () => { setEditing(null); setAdding(false); };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await uploadFile(file, 'image');
      setForm(f => ({ ...f, imageUrl: url }));
    } catch (err) { toast(err.message, 'error'); }
    finally { setUploading(false); e.target.value = ''; }
  };

  const handleSave = async () => {
    if (!form.title.trim()) { toast('El título es obligatorio', 'error'); return; }
    setSaving(true);
    try {
      if (adding) {
        const created = await createSitioRecreacion(form);
        setItems(p => [...p, created]);
      } else {
        const updated = await updateSitioRecreacion(editing, form);
        setItems(p => p.map(i => i._id === editing ? updated : i));
      }
      cancel();
      toast('Guardado correctamente', 'success');
    } catch (err) { toast(err.message, 'error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este sitio de recreación?')) return;
    try {
      await deleteSitioRecreacion(id);
      setItems(p => p.filter(i => i._id !== id));
      toast('Eliminado', 'success');
    } catch (err) { toast(err.message, 'error'); }
  };

  const f = (field) => ({
    value: form[field],
    onChange: e => setForm(p => ({ ...p, [field]: e.target.value })),
  });

  if (loading) return <div className="page-loading">Cargando sitios de recreación...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Sitios de Recreación</h2>
        {!adding && !editing && (
          <button className="btn-add" onClick={startAdd}>+ Agregar sitio</button>
        )}
      </div>

      {/* Formulario */}
      {(adding || editing) && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 className="upload-card-title">{adding ? '➕ Nuevo sitio de recreación' : '✏️ Editar sitio'}</h3>
          <div className="edit-form">
            <div className="field">
              <label>Título</label>
              <input {...f('title')} placeholder="Nombre del sitio" />
            </div>
            <div className="field">
              <label>Descripción</label>
              <textarea rows={4} {...f('description')} placeholder="Descripción del sitio..." />
            </div>
            <div className="field-row">
              <div className="field">
                <label>Enlace del sitio (Ver más)</label>
                <input {...f('linkUrl')} placeholder="https://..." />
              </div>
              <div className="field">
                <label>Enlace de Google Maps</label>
                <input {...f('mapsUrl')} placeholder="https://maps.google.com/..." />
              </div>
            </div>

            {/* Imagen */}
            <div className="field">
              <label>Imagen del sitio</label>
              <div className="upload-row" style={{ marginBottom: 8 }}>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUpload} />
                <button type="button" className="btn-upload" onClick={() => fileRef.current.click()} disabled={uploading}>
                  {uploading ? '⏳ Subiendo...' : '📤 Subir desde PC'}
                </button>
                <span className="upload-hint">JPG, PNG, WebP · máx 10 MB</span>
              </div>
              {form.imageUrl && (
                <img src={form.imageUrl} alt="preview"
                  style={{ maxHeight: 140, maxWidth: '100%', borderRadius: 8, objectFit: 'cover', marginTop: 6 }}
                  onError={e => { e.target.onerror = null; e.target.src = '/images/placeholder.webp'; }}
                />
              )}
              <input {...f('imageUrl')} placeholder="O pega una URL directamente" style={{ marginTop: 8 }} />
            </div>

            <div className="field-row">
              <div className="field field-sm">
                <label>Orden</label>
                <input type="number" min="0" value={form.order}
                  onChange={e => setForm(p => ({ ...p, order: Number(e.target.value) }))} />
              </div>
              <div className="field-check" style={{ marginTop: 'auto' }}>
                <input type="checkbox" id="recreacion-visible" checked={form.isVisible}
                  onChange={e => setForm(p => ({ ...p, isVisible: e.target.checked }))} />
                <label htmlFor="recreacion-visible">Visible en el sitio</label>
              </div>
            </div>

            <div className="btn-row">
              <button className="btn-save" onClick={handleSave} disabled={saving}>
                {saving ? 'Guardando...' : '💾 Guardar'}
              </button>
              <button className="btn-cancel" onClick={cancel}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Lista */}
      <div className="cards">
        {items.length === 0 && !adding && (
          <p style={{ color: 'var(--muted)', fontSize: 13 }}>No hay sitios. Haz clic en "+ Agregar sitio" para comenzar.</p>
        )}
        {items.map(item => (
          <div key={item._id} className="card">
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {item.imageUrl && (
                  <img src={item.imageUrl} alt={item.title}
                    style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }}
                    onError={e => { e.target.onerror = null; e.target.src = '/images/placeholder.webp'; }}
                  />
                )}
                <div>
                  <span className="card-key">#{item.order}</span>
                  <h3>{item.title}</h3>
                </div>
              </div>
              <div className="img-actions">
                <span className={'badge ' + (item.isVisible ? 'badge-active' : 'badge-inactive')}>
                  {item.isVisible ? 'Visible' : 'Oculto'}
                </span>
                {editing !== item._id && (
                  <>
                    <button className="btn-edit-sm" onClick={() => startEdit(item)}>Editar</button>
                    <button className="btn-delete-sm" onClick={() => handleDelete(item._id)}>Eliminar</button>
                  </>
                )}
              </div>
            </div>
            <div className="card-preview">
              {item.description && <p className="preview-body">{item.description.slice(0, 120)}{item.description.length > 120 ? '…' : ''}</p>}
              {item.linkUrl && <p style={{ fontSize: 12, color: 'var(--muted)' }}>🔗 {item.linkUrl}</p>}
              {item.mapsUrl && <p style={{ fontSize: 12, color: 'var(--muted)' }}>📍 {item.mapsUrl}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
