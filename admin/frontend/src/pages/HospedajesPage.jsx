import { useState, useEffect, useRef } from 'react';
import { getHospedajes, createHospedaje, updateHospedaje, deleteHospedaje, uploadFile, uploadDocumento } from '../api';
import { useToast } from '../context/ToastContext.jsx';

const ADMIN_API = import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:5001';

// PDFs se sirven desde el backend admin via GridFS (sin problemas de auth)
const filePreviewUrl = (url) => {
  if (!url) return '#';
  if (url.startsWith('/api/files/')) return `${ADMIN_API}${url}`;
  return url;
};

const EMPTY = { title: '', description: '', imageUrl: '', mapsUrl: '', linkUrl: '', order: 0, isVisible: true };

function isPdf(url) {
  return url && (url.startsWith('/api/files/') || url.toLowerCase().includes('.pdf'));
}

export default function HospedajesPage() {
  const toast = useToast();
  const [items,        setItems]        = useState([]);
  const [editing,      setEditing]      = useState(null);
  const [adding,       setAdding]       = useState(false);
  const [form,         setForm]         = useState(EMPTY);
  const [saving,       setSaving]       = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [uploadingFile,setUploadingFile]= useState(false);
  const [loading,      setLoading]      = useState(true);
  const imgRef  = useRef();
  const fileRef = useRef();

  const load = () =>
    getHospedajes()
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

  const handleUploadImg = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImg(true);
    try {
      const { url } = await uploadFile(file, 'image');
      setForm(f => ({ ...f, imageUrl: url }));
    } catch (err) { toast(err.message, 'error'); }
    finally { setUploadingImg(false); e.target.value = ''; }
  };

  const handleUploadFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFile(true);
    try {
      if (file.type === 'application/pdf') {
        // PDFs → GridFS (evita problemas de autenticación de Cloudinary)
        const data = await uploadDocumento(file);
        setForm(f => ({ ...f, linkUrl: data.url }));
      } else {
        // Imágenes → Cloudinary
        const { url } = await uploadFile(file, 'hospedajes');
        setForm(f => ({ ...f, linkUrl: url }));
      }
      toast('Archivo subido correctamente', 'success');
    } catch (err) { toast(err.message, 'error'); }
    finally { setUploadingFile(false); e.target.value = ''; }
  };

  const handleSave = async () => {
    if (!form.title.trim()) { toast('El título es obligatorio', 'error'); return; }
    setSaving(true);
    try {
      if (adding) {
        const created = await createHospedaje(form);
        setItems(p => [...p, created]);
      } else {
        const updated = await updateHospedaje(editing, form);
        setItems(p => p.map(i => i._id === editing ? updated : i));
      }
      cancel();
      toast('Guardado correctamente', 'success');
    } catch (err) { toast(err.message, 'error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este hospedaje?')) return;
    try {
      await deleteHospedaje(id);
      setItems(p => p.filter(i => i._id !== id));
      toast('Eliminado', 'success');
    } catch (err) { toast(err.message, 'error'); }
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

            <div className="field">
              <label>Enlace de Google Maps</label>
              <input {...f('mapsUrl')} placeholder="https://maps.google.com/..." />
            </div>

            {/* Imagen miniatura */}
            <div className="field">
              <label>Imagen del hospedaje <span className="field-hint">(miniatura en la lista)</span></label>
              <div className="upload-row" style={{ marginBottom: 8 }}>
                <input ref={imgRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUploadImg} />
                <button type="button" className="btn-upload" onClick={() => imgRef.current.click()} disabled={uploadingImg}>
                  {uploadingImg ? '⏳ Subiendo...' : '🖼️ Subir imagen'}
                </button>
                <span className="upload-hint">JPG, PNG, WebP</span>
              </div>
              {form.imageUrl && !isPdf(form.imageUrl) && (
                <img src={form.imageUrl} alt="preview"
                  style={{ maxHeight: 120, maxWidth: '100%', borderRadius: 8, objectFit: 'cover', marginBottom: 6 }}
                  onError={e => { e.target.onerror = null; e.target.src = '/images/placeholder.webp'; }}
                />
              )}
              <input {...f('imageUrl')} placeholder="O pega una URL de imagen" style={{ marginTop: 4 }} />
            </div>

            {/* Archivo a mostrar (imagen o PDF) */}
            <div className="field">
              <label>Archivo a mostrar <span className="field-hint">(imagen o PDF — se abre en nueva pestaña al hacer clic)</span></label>
              <div className="upload-row" style={{ marginBottom: 8 }}>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*,application/pdf"
                  style={{ display: 'none' }}
                  onChange={handleUploadFile}
                />
                <button type="button" className="btn-upload" onClick={() => fileRef.current.click()} disabled={uploadingFile}>
                  {uploadingFile ? '⏳ Subiendo...' : '📎 Subir imagen o PDF'}
                </button>
                <span className="upload-hint">JPG, PNG, WebP, PDF · máx 150 MB</span>
              </div>

              {form.linkUrl && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, padding: '0.5rem 0.75rem', background: 'var(--bg-alt)', borderRadius: 8, border: '1px solid var(--border)' }}>
                  {isPdf(form.linkUrl)
                    ? <span style={{ fontSize: 24 }}>📄</span>
                    : <img src={form.linkUrl} alt="preview" style={{ height: 40, width: 40, objectFit: 'cover', borderRadius: 4 }} onError={e => { e.target.style.display = 'none'; }} />
                  }
                  <a
                    href={filePreviewUrl(form.linkUrl)}
                    target="_blank" rel="noreferrer"
                    style={{ fontSize: 12, color: 'var(--primary)', wordBreak: 'break-all', flex: 1 }}>
                    {isPdf(form.linkUrl) ? 'PDF cargado — clic para ver' : 'Imagen cargada — clic para ver'}
                  </a>
                  <button type="button" className="btn-delete-sm" onClick={() => setForm(p => ({ ...p, linkUrl: '' }))}>✕</button>
                </div>
              )}

              <input {...f('linkUrl')} placeholder="O pega una URL directamente (imagen o PDF)" style={{ marginTop: 4 }} />
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
              {item.linkUrl && (
                <p style={{ fontSize: 12, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  {isPdf(item.linkUrl) ? '📄' : '🖼️'}
                  <a
                    href={filePreviewUrl(item.linkUrl)}
                    target="_blank" rel="noreferrer" style={{ color: 'var(--primary)' }}>
                    {isPdf(item.linkUrl) ? 'Ver PDF' : 'Ver archivo'}
                  </a>
                </p>
              )}
              {item.mapsUrl && <p style={{ fontSize: 12, color: 'var(--muted)' }}>📍 Google Maps</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
