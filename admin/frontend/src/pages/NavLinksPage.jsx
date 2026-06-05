import { useState, useEffect } from 'react';
import { getNavLinks, createNavLink, updateNavLink, deleteNavLink } from '../api';

const EMPTY = { label: '', href: '', order: 0, isActive: true };

export default function NavLinksPage() {
  const [links,   setLinks]   = useState([]);
  const [editing, setEditing] = useState(null);
  const [adding,  setAdding]  = useState(false);
  const [form,    setForm]    = useState(EMPTY);
  const [saving,  setSaving]  = useState(false);
  const [msg,     setMsg]     = useState('');
  const [loading, setLoading] = useState(true);

  const load = () =>
    getNavLinks()
      .then(setLinks)
      .catch(err => setMsg('❌ ' + err.message))
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const startEdit = (link) => {
    setEditing(link._id);
    setAdding(false);
    setForm({ label: link.label, href: link.href, order: link.order, isActive: link.isActive });
    setMsg('');
  };

  const startAdd = () => {
    setAdding(true);
    setEditing(null);
    setForm({ ...EMPTY, order: links.length + 1 });
    setMsg('');
  };

  const handleSave = async () => {
    setSaving(true);
    setMsg('');
    try {
      if (adding) {
        const created = await createNavLink(form);
        setLinks(prev => [...prev, created]);
      } else {
        const updated = await updateNavLink(editing, form);
        setLinks(prev => prev.map(l => l._id === editing ? updated : l));
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
    if (!confirm('¿Eliminar este link?')) return;
    try {
      await deleteNavLink(id);
      setLinks(prev => prev.filter(l => l._id !== id));
      setMsg('✅ Link eliminado');
    } catch (err) {
      setMsg('❌ ' + err.message);
    }
  };

  const isFormOpen = editing || adding;

  if (loading) return <div className="page-loading">Cargando links...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Links del menú</h2>
        {!isFormOpen && (
          <button className="btn-add" onClick={startAdd}>+ Agregar link</button>
        )}
      </div>
      {msg && <p className="status-msg">{msg}</p>}

      {isFormOpen && (
        <div className="card form-card">
          <h3>{adding ? 'Nuevo link' : 'Editar link'}</h3>
          <div className="field-row">
            <div className="field">
              <label>Etiqueta</label>
              <input value={form.label} onChange={e => setForm({...form, label: e.target.value})} />
            </div>
            <div className="field">
              <label>Href (ej: #inicio)</label>
              <input value={form.href} onChange={e => setForm({...form, href: e.target.value})} />
            </div>
            <div className="field field-sm">
              <label>Orden</label>
              <input type="number" value={form.order} onChange={e => setForm({...form, order: +e.target.value})} />
            </div>
          </div>
          <div className="field-check">
            <input
              type="checkbox"
              id="isActive"
              checked={form.isActive}
              onChange={e => setForm({...form, isActive: e.target.checked})}
            />
            <label htmlFor="isActive">Activo</label>
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
              <th>Orden</th><th>Etiqueta</th><th>Href</th><th>Activo</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {links.map(link => (
              <tr key={link._id}>
                <td>{link.order}</td>
                <td>{link.label}</td>
                <td><code>{link.href}</code></td>
                <td>{link.isActive ? '✅' : '❌'}</td>
                <td className="actions">
                  <button className="btn-edit-sm" onClick={() => startEdit(link)}>Editar</button>
                  <button className="btn-delete-sm" onClick={() => handleDelete(link._id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
