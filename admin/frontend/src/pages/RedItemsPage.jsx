import { useState, useEffect, useRef } from 'react';
import { getRedItems, createRedItem, updateRedItem, deleteRedItem, uploadDocumento } from '../api';
import { useToast } from '../context/ToastContext.jsx';

const EMPTY = { label: '', href: '', type: 'internal', iconUrl: '', documentUrl: '', order: 0, isActive: true };

export default function RedItemsPage() {
  const toast = useToast();
  const [items,     setItems]     = useState([]);
  const [editing,   setEditing]   = useState(null);
  const [adding,    setAdding]    = useState(false);
  const [form,      setForm]      = useState(EMPTY);
  const [saving,    setSaving]    = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading,   setLoading]   = useState(true);
  const docRef = useRef();

  useEffect(() => {
    getRedItems()
      .then(setItems)
      .catch(err => toast(err.message, 'error'))
      .finally(() => setLoading(false));
  }, []);

  const startEdit = (item) => {
    setEditing(item._id);
    setAdding(false);
    setForm({
      label: item.label, href: item.href || '', type: item.type,
      iconUrl: item.iconUrl, documentUrl: item.documentUrl || '',
      order: item.order, isActive: item.isActive,
    });
  };

  const startAdd = () => {
    setAdding(true);
    setEditing(null);
    setForm({ ...EMPTY, order: items.length + 1 });
  };

  const cancel = () => { setEditing(null); setAdding(false); };

  const handleDocUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await uploadDocumento(file);
      setForm(f => ({ ...f, documentUrl: url }));
      toast('Documento subido correctamente', 'success');
    } catch (err) { toast(err.message, 'error'); }
    finally { setUploading(false); e.target.value = ''; }
  };

  const handleSave = async () => {
    if (!form.label.trim()) { toast('La etiqueta es obligatoria', 'error'); return; }
    setSaving(true);
    try {
      if (adding) {
        const created = await createRedItem(form);
        setItems(prev => [...prev, created]);
      } else {
        const updated = await updateRedItem(editing, form);
        setItems(prev => prev.map(i => i._id === editing ? updated : i));
      }
      cancel();
      toast('Guardado correctamente', 'success');
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este ítem?')) return;
    try {
      await deleteRedItem(id);
      setItems(prev => prev.filter(i => i._id !== id));
      toast('Ítem eliminado', 'success');
    } catch (err) {
      toast(err.message, 'error');
    }
  };

  const isFormOpen = editing || adding;

  if (loading) return <div className="page-loading">Cargando ítems...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Red de Turismo Sostenible</h2>
        {!isFormOpen && (
          <button className="btn-add" onClick={startAdd}>+ Agregar ítem</button>
        )}
      </div>

      {isFormOpen && (
        <div className="card form-card" style={{ marginBottom: 24 }}>
          <h3 className="upload-card-title">{adding ? '➕ Nuevo ítem' : '✏️ Editar ítem'}</h3>
          <div className="edit-form">
            <div className="field-row">
              <div className="field">
                <label>Etiqueta *</label>
                <input value={form.label} onChange={e => setForm({...form, label: e.target.value})} placeholder="Ej: Observación de aves" />
              </div>
              <div className="field field-sm">
                <label>Orden</label>
                <input type="number" value={form.order} onChange={e => setForm({...form, order: +e.target.value})} />
              </div>
            </div>

            <div className="field-row">
              <div className="field">
                <label>Tipo de enlace</label>
                <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                  <option value="internal">Interno (sección de la página)</option>
                  <option value="external">Externo (URL externa)</option>
                  <option value="pdf">Documento / PDF</option>
                </select>
              </div>
              <div className="field">
                <label>URL del enlace {form.type === 'pdf' ? '(opcional si sube documento abajo)' : ''}</label>
                <input value={form.href} onChange={e => setForm({...form, href: e.target.value})}
                  placeholder={form.type === 'internal' ? '#seccion' : 'https://...'} />
              </div>
            </div>

            {/* Documento adjunto */}
            <div className="field" style={{ background: 'var(--surface)', padding: '1rem', borderRadius: 10, border: '1px solid var(--border)' }}>
              <label style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>📎 Documento adjunto</label>
              <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10 }}>
                Si subes un documento, el ítem mostrará un botón de descarga en el sitio cliente.
              </p>
              <div className="upload-row" style={{ marginBottom: 8 }}>
                <input
                  ref={docRef} type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv"
                  style={{ display: 'none' }}
                  onChange={handleDocUpload}
                />
                <button type="button" className="btn-upload" onClick={() => docRef.current.click()} disabled={uploading}>
                  {uploading ? '⏳ Subiendo...' : '📤 Subir documento'}
                </button>
                <span className="upload-hint">PDF, Word, Excel · máx 150 MB</span>
              </div>
              {form.documentUrl ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: 'var(--bg)', borderRadius: 8 }}>
                  <span>📕</span>
                  <span style={{ fontSize: 12, flex: 1, wordBreak: 'break-all', color: 'var(--text)' }}>{form.documentUrl}</span>
                  <a href={form.documentUrl} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: 'var(--verde)' }}>Ver</a>
                  <button type="button" onClick={() => setForm(f => ({ ...f, documentUrl: '' }))}
                    style={{ fontSize: 11, color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer' }}>
                    Quitar
                  </button>
                </div>
              ) : (
                <input value={form.documentUrl} onChange={e => setForm(f => ({ ...f, documentUrl: e.target.value }))}
                  placeholder="O pega una URL de documento directamente" style={{ marginTop: 4 }} />
              )}
            </div>

            <div className="field">
              <label>URL del ícono (opcional)</label>
              <input value={form.iconUrl} onChange={e => setForm({...form, iconUrl: e.target.value})} placeholder="https://..." />
            </div>

            <div className="field-check">
              <input type="checkbox" id="isActiveItem" checked={form.isActive}
                onChange={e => setForm({...form, isActive: e.target.checked})} />
              <label htmlFor="isActiveItem">Activo</label>
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

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Orden</th><th>Etiqueta</th><th>Tipo</th><th>Documento</th><th>Activo</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item._id}>
                <td>{item.order}</td>
                <td>{item.label}</td>
                <td><span className={`badge badge-${item.type}`}>{item.type}</span></td>
                <td>
                  {item.documentUrl
                    ? <a href={item.documentUrl} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: 'var(--verde)' }}>📕 Ver doc</a>
                    : <span style={{ color: 'var(--muted)', fontSize: 12 }}>—</span>
                  }
                </td>
                <td>{item.isActive ? '✅' : '❌'}</td>
                <td className="actions">
                  <button className="btn-edit-sm" onClick={() => startEdit(item)}>Editar</button>
                  <button className="btn-delete-sm" onClick={() => handleDelete(item._id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
