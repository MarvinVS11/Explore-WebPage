import { useState, useEffect, useRef } from 'react';
import {
  getDocumentos, createDocumento, updateDocumento,
  deleteDocumento, uploadDocumento,
} from '../api';
import { useToast } from '../context/ToastContext.jsx';

const EMPTY = { title: '', description: '', category: '', fileUrl: '', fileName: '', fileType: '', order: 0, isVisible: true };

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
  const toast = useToast();
  const [items,     setItems]     = useState([]);
  const [editing,   setEditing]   = useState(null);
  const [adding,    setAdding]    = useState(false);
  const [form,      setForm]      = useState(EMPTY);
  const [saving,    setSaving]    = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading,   setLoading]   = useState(true);
  const [catFilter, setCatFilter] = useState('');
  const fileRef = useRef();

  const load = (cat = catFilter) =>
    getDocumentos(cat)
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
    setForm({
      title: item.title, description: item.description, category: item.category,
      fileUrl: item.fileUrl, fileName: item.fileName, fileType: item.fileType,
      order: item.order, isVisible: item.isVisible,
    });
  };

  const cancel = () => { setEditing(null); setAdding(false); };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url, fileName, fileType } = await uploadDocumento(file);
      setForm(f => ({ ...f, fileUrl: url, fileName: fileName || file.name, fileType: fileType || file.type }));
    } catch (err) { toast(err.message, 'error'); }
    finally { setUploading(false); e.target.value = ''; }
  };

  const handleSave = async () => {
    if (!form.title.trim()) { toast('El título es obligatorio', 'error'); return; }
    if (!form.fileUrl.trim()) { toast('Debes subir un archivo o pegar una URL', 'error'); return; }
    setSaving(true);
    try {
      if (adding) {
        const created = await createDocumento(form);
        setItems(p => [...p, created]);
      } else {
        const updated = await updateDocumento(editing, form);
        setItems(p => p.map(i => i._id === editing ? updated : i));
      }
      cancel();
      toast('Guardado correctamente', 'success');
    } catch (err) { toast(err.message, 'error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este documento?')) return;
    try {
      await deleteDocumento(id);
      setItems(p => p.filter(i => i._id !== id));
      toast('Eliminado', 'success');
    } catch (err) { toast(err.message, 'error'); }
  };

  const f = (field) => ({
    value: form[field],
    onChange: e => setForm(p => ({ ...p, [field]: e.target.value })),
  });

  // Categorías únicas para filtro
  const categories = [...new Set(items.map(i => i.category).filter(Boolean))];

  if (loading) return <div className="page-loading">Cargando documentos...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Documentos</h2>
        {!adding && !editing && (
          <button className="btn-add" onClick={startAdd}>+ Agregar documento</button>
        )}
      </div>

      {/* Filtro por categoría */}
      {categories.length > 0 && !adding && !editing && (
        <div style={{ marginBottom: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            className={`tag-filter${catFilter === '' ? ' active' : ''}`}
            onClick={() => { setCatFilter(''); load(''); }}
          >Todos</button>
          {categories.map(cat => (
            <button
              key={cat}
              className={`tag-filter${catFilter === cat ? ' active' : ''}`}
              onClick={() => { setCatFilter(cat); load(cat); }}
            >{cat}</button>
          ))}
        </div>
      )}

      {/* Formulario */}
      {(adding || editing) && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 className="upload-card-title">{adding ? '➕ Nuevo documento' : '✏️ Editar documento'}</h3>
          <div className="edit-form">
            <div className="field-row">
              <div className="field">
                <label>Título *</label>
                <input {...f('title')} placeholder="Nombre del documento" />
              </div>
              <div className="field field-sm">
                <label>Categoría</label>
                <input {...f('category')} placeholder="Ej: Informes, Reglamentos..." />
              </div>
            </div>
            <div className="field">
              <label>Descripción</label>
              <textarea rows={3} {...f('description')} placeholder="Descripción breve..." />
            </div>

            {/* Archivo */}
            <div className="field">
              <label>Archivo *</label>
              <div className="upload-row" style={{ marginBottom: 8 }}>
                <input
                  ref={fileRef} type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv"
                  style={{ display: 'none' }}
                  onChange={handleUpload}
                />
                <button type="button" className="btn-upload" onClick={() => fileRef.current.click()} disabled={uploading}>
                  {uploading ? '⏳ Subiendo...' : '📤 Subir archivo'}
                </button>
                <span className="upload-hint">PDF, Word, Excel, PowerPoint, TXT · máx 150 MB</span>
              </div>
              {form.fileUrl && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'var(--surface)', borderRadius: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 20 }}>{fileIcon(form.fileType)}</span>
                  <span style={{ fontSize: 13, color: 'var(--text)', wordBreak: 'break-all' }}>
                    {form.fileName || form.fileUrl}
                  </span>
                  <a href={form.fileUrl} target="_blank" rel="noreferrer" style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--verde)' }}>Ver</a>
                </div>
              )}
              <input {...f('fileUrl')} placeholder="O pega una URL directamente" style={{ marginTop: 4 }} />
            </div>

            <div className="field-row">
              <div className="field field-sm">
                <label>Orden</label>
                <input type="number" min="0" value={form.order}
                  onChange={e => setForm(p => ({ ...p, order: Number(e.target.value) }))} />
              </div>
              <div className="field-check" style={{ marginTop: 'auto' }}>
                <input type="checkbox" id="doc-visible" checked={form.isVisible}
                  onChange={e => setForm(p => ({ ...p, isVisible: e.target.checked }))} />
                <label htmlFor="doc-visible">Visible en el sitio</label>
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
          <p style={{ color: 'var(--muted)', fontSize: 13 }}>No hay documentos. Haz clic en "+ Agregar documento" para comenzar.</p>
        )}
        {items.map(item => (
          <div key={item._id} className="card">
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: 32, flexShrink: 0 }}>{fileIcon(item.fileType)}</span>
                <div>
                  {item.category && <span className="card-key">{item.category}</span>}
                  <h3>{item.title}</h3>
                  {item.fileName && <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{item.fileName}</p>}
                </div>
              </div>
              <div className="img-actions">
                <span className={'badge ' + (item.isVisible ? 'badge-active' : 'badge-inactive')}>
                  {item.isVisible ? 'Visible' : 'Oculto'}
                </span>
                <a href={item.fileUrl} target="_blank" rel="noreferrer"
                  style={{ fontSize: 12, padding: '4px 10px', background: 'var(--surface)', borderRadius: 6, color: 'var(--verde)', border: '1px solid var(--border)', textDecoration: 'none' }}>
                  Ver
                </a>
                {editing !== item._id && (
                  <>
                    <button className="btn-edit-sm" onClick={() => startEdit(item)}>Editar</button>
                    <button className="btn-delete-sm" onClick={() => handleDelete(item._id)}>Eliminar</button>
                  </>
                )}
              </div>
            </div>
            {item.description && (
              <div className="card-preview">
                <p className="preview-body">{item.description.slice(0, 120)}{item.description.length > 120 ? '…' : ''}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
