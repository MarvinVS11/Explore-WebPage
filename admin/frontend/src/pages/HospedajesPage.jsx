import { useState, useEffect, useRef } from 'react';
import { getHospedajes, createHospedaje, updateHospedaje, deleteHospedaje, uploadFile } from '../api';

const EMPTY = { title: '', description: '', imageUrl: '', mapsUrl: '', linkUrl: '', order: 0, isVisible: true };

export default function HospedajesPage() {
  const [items,     setItems]     = useState([]);
  const [editing,   setEditing]   = useState(null);
  const [adding,    setAdding]    = useState(false);
  const [form,      setForm]      = useState(EMPTY);
  const [saving,    setSaving]    = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg,       setMsg]       = useState('');
  const [loading,   setLoading]   = useState(true);
  const fileRef = useRef();

  const load = () =>
    getHospedajes()
      .then(setItems)
      .catch(e => setMsg('❌ ' + e.message))
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const startAdd = () => {
    setAdding(true); setEditing(null);
    setForm({ ...EMPTY, order: items.length + 1 });
    setMsg('');
  };

  const startEdit = (item) => {
    setEditing(item._id); setAdding(false);
    setForm({ title: item.title, description: item.description, imageUrl: item.imageUrl,
              mapsUrl: item.mapsUrl, linkUrl: item.linkUrl, order: item.order, isVisible: item.isVisible });
    setMsg('');
  };

  const cancel = () => { setEditing(null); setAdding(false); setMsg(''); };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await uploadFile(file, 'image');
      setForm(f => ({ ...f, imageUrl: url }));
    } catch (err) { setMsg('❌ ' + err.message); }
    finally { setUploading(false); e.target.value = ''; }
  };

  const handleSave = async () => {
    if (!form.title.trim()) { setMsg('❌ El título es obligatorio'); return; }
    setSaving(true); setMsg('');
    try {
      if (adding) {
        const created = await createHospedaje(form);
        setItems(p => [...p, created]);
      } else {
        const updated = await updateHospedaje(editing, form);
        setItems(p => p.map(i => i._id === editing ? updated : i));
      }
      cancel();
      setMsg('✅ Guardado correctamente');
    } catch (err) { setMsg('❌ ' + err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este hospedaje?')) return;
    try {
      await deleteHospedaje(id);
      setItems(p => p.filter(i => i._id !== id));
      setMsg('✅ Eliminado');
    } catch (err) { setMsg('❌ ' + err.message); }
  };

  const f = (field) => ({
    value: form[field],
    onChange: e => setForm(p => ({ ...p, [field]: e.target.value })),
  });

  if (loading) return <div className="page-loading">Cargando hospedajes...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Hospedajes</h2>
        {!adding && !editing && (
          <button className="btn-add" onClick={startAdd}>+ Agregar hospedaje</button>
        )}
      </div>

      {msg && <p className="status-msg">{msg}</p>}

      {/* Formulario */}
      {(adding || editing) && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 className="upload-card-title">{adding ? '➕ Nuevo hospedaje' : '✏️ Editar hospedaje'}</h3>
          <div className="edit-form">
            <div className="field">
              <label>Título</label>
              <input {...f('title')} placeholder="Nombre del hospedaje" />
            </div>
            <div className="field">
              <label>Descripción</label>
              <textarea rows={4} {...f('description')} placeholder="Descripción del hospedaje..." />
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
              <label>Imagen del hospedaje</label>
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
                <input type="checkbox" id="hosp-visible" checked={form.isVisible}
                  onChange={e => setForm(p => ({ ...p, isVisible: e.target.checked }))} />
                <label htmlFor="hosp-visible">Visible en el sitio</label>
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
          <p style={{ color: 'var(--muted)', fontSize: 13 }}>No hay hospedajes. Haz clic en "+ Agregar hospedaje" para comenzar.</p>
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
