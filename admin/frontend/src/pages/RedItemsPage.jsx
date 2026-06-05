import { useState, useEffect } from 'react';
import { getRedItems, createRedItem, updateRedItem, deleteRedItem } from '../api';

const EMPTY = { label: '', href: '', type: 'internal', iconUrl: '', order: 0, isActive: true };

export default function RedItemsPage() {
  const [items,   setItems]   = useState([]);
  const [editing, setEditing] = useState(null);
  const [adding,  setAdding]  = useState(false);
  const [form,    setForm]    = useState(EMPTY);
  const [saving,  setSaving]  = useState(false);
  const [msg,     setMsg]     = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRedItems()
      .then(setItems)
      .catch(err => setMsg('❌ ' + err.message))
      .finally(() => setLoading(false));
  }, []);

  const startEdit = (item) => {
    setEditing(item._id);
    setAdding(false);
    setForm({ label: item.label, href: item.href, type: item.type, iconUrl: item.iconUrl, order: item.order, isActive: item.isActive });
    setMsg('');
  };

  const startAdd = () => {
    setAdding(true);
    setEditing(null);
    setForm({ ...EMPTY, order: items.length + 1 });
    setMsg('');
  };

  const handleSave = async () => {
    setSaving(true);
    setMsg('');
    try {
      if (adding) {
        const created = await createRedItem(form);
        setItems(prev => [...prev, created]);
      } else {
        const updated = await updateRedItem(editing, form);
        setItems(prev => prev.map(i => i._id === editing ? updated : i));
      }
      setEditing(null);
      setAdding(false);
      setMsg('✅ Guardado correctamente');
    } catch (err) {
      setMsg('❌ ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este ítem?')) return;
    try {
      await deleteRedItem(id);
      setItems(prev => prev.filter(i => i._id !== id));
      setMsg('✅ Ítem eliminado');
    } catch (err) {
      setMsg('❌ ' + err.message);
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
      {msg && <p className="status-msg">{msg}</p>}

      {isFormOpen && (
        <div className="card form-card">
          <h3>{adding ? 'Nuevo ítem' : 'Editar ítem'}</h3>
          <div className="field-row">
            <div className="field">
              <label>Etiqueta</label>
              <input value={form.label} onChange={e => setForm({...form, label: e.target.value})} />
            </div>
            <div className="field">
              <label>Href / URL</label>
              <input value={form.href} onChange={e => setForm({...form, href: e.target.value})} />
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label>Tipo</label>
              <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                <option value="internal">Internal (link de la página)</option>
                <option value="external">External (URL externa)</option>
                <option value="pdf">PDF</option>
              </select>
            </div>
            <div className="field field-sm">
              <label>Orden</label>
              <input type="number" value={form.order} onChange={e => setForm({...form, order: +e.target.value})} />
            </div>
          </div>
          <div className="field">
            <label>URL del ícono (opcional)</label>
            <input value={form.iconUrl} onChange={e => setForm({...form, iconUrl: e.target.value})} />
          </div>
          <div className="field-check">
            <input
              type="checkbox"
              id="isActiveItem"
              checked={form.isActive}
              onChange={e => setForm({...form, isActive: e.target.checked})}
            />
            <label htmlFor="isActiveItem">Activo</label>
          </div>
          <div className="btn-row">
            <button className="btn-save" onClick={handleSave} disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
            <button className="btn-cancel" onClick={() => { setEditing(null); setAdding(false); }}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Orden</th><th>Etiqueta</th><th>Href</th><th>Tipo</th><th>Activo</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item._id}>
                <td>{item.order}</td>
                <td>{item.label}</td>
                <td><code>{item.href.slice(0, 40)}{item.href.length > 40 ? '…' : ''}</code></td>
                <td><span className={`badge badge-${item.type}`}>{item.type}</span></td>
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
