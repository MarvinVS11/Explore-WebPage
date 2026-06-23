import { useState, useEffect } from 'react';
import {
  getRestaurantesSodas, createRestauranteSoda, updateRestauranteSoda, deleteRestauranteSoda,
  getMiradoresSitios,   createMiradorSitio,    updateMiradorSitio,    deleteMiradorSitio,
  getAreasProtegidas,   createAreaProtegida,   updateAreaProtegida,   deleteAreaProtegida,
} from '../api';
import { useToast } from '../context/ToastContext.jsx';

// ─── Restaurantes & Sodas ────────────────────────────────────────────────────
const EMPTY_REST = { nombre: '', telefono: '', distrito: '', canton: '', order: 0, isVisible: true };

function RestaurantesTab() {
  const toast = useToast();
  const [items,   setItems]   = useState([]);
  const [editing, setEditing] = useState(null);
  const [adding,  setAdding]  = useState(false);
  const [form,    setForm]    = useState(EMPTY_REST);
  const [saving,  setSaving]  = useState(false);
  const [loading, setLoading] = useState(true);

  const load = () => getRestaurantesSodas().then(setItems).catch(e => toast(e.message, 'error')).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const startAdd  = () => { setAdding(true); setEditing(null); setForm({ ...EMPTY_REST, order: items.length + 1 }); };
  const startEdit = (item) => {
    setEditing(item._id); setAdding(false);
    setForm({ nombre: item.nombre, telefono: item.telefono || '', distrito: item.distrito || '', canton: item.canton || '', order: item.order, isVisible: item.isVisible });
  };
  const cancel = () => { setEditing(null); setAdding(false); };

  const handleSave = async () => {
    if (!form.nombre.trim()) { toast('El nombre es obligatorio', 'error'); return; }
    setSaving(true);
    try {
      if (adding) {
        const created = await createRestauranteSoda(form);
        setItems(p => [...p, created]);
      } else {
        const u = await updateRestauranteSoda(editing, form);
        setItems(p => p.map(i => i._id === editing ? u : i));
      }
      cancel(); toast('Guardado', 'success');
    } catch (err) { toast(err.message, 'error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este registro?')) return;
    try { await deleteRestauranteSoda(id); setItems(p => p.filter(i => i._id !== id)); toast('Eliminado', 'success'); }
    catch (err) { toast(err.message, 'error'); }
  };

  const field = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <>
      {!adding && !editing && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <button className="btn-add" onClick={startAdd}>+ Agregar restaurante / soda</button>
        </div>
      )}

      {(adding || editing) && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 className="upload-card-title">{adding ? '➕ Nuevo restaurante / soda' : '✏️ Editar restaurante / soda'}</h3>
          <div className="edit-form">
            <div className="field">
              <label>Nombre *</label>
              <input value={form.nombre}   onChange={field('nombre')}   placeholder="Restaurante El Bambú" />
            </div>
            <div className="field">
              <label>Teléfono</label>
              <input value={form.telefono} onChange={field('telefono')} placeholder="2400-0000" />
            </div>
            <div className="field-row">
              <div className="field">
                <label>Distrito</label>
                <input value={form.distrito} onChange={field('distrito')} placeholder="San Ramón" />
              </div>
              <div className="field">
                <label>Cantón</label>
                <input value={form.canton}   onChange={field('canton')}   placeholder="Alajuela" />
              </div>
            </div>
            <div className="field-row">
              <div className="field field-sm">
                <label>Orden</label>
                <input type="number" min="0" value={form.order} onChange={e => setForm(p => ({ ...p, order: Number(e.target.value) }))} />
              </div>
              <div className="field-check" style={{ marginTop: 'auto', paddingBottom: 4 }}>
                <input type="checkbox" id="rest-visible" checked={form.isVisible} onChange={e => setForm(p => ({ ...p, isVisible: e.target.checked }))} />
                <label htmlFor="rest-visible">Visible en el sitio</label>
              </div>
            </div>
            <div className="btn-row">
              <button className="btn-save" onClick={handleSave} disabled={saving}>{saving ? 'Guardando...' : '💾 Guardar'}</button>
              <button className="btn-cancel" onClick={cancel}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {loading ? <p style={{ color: 'var(--muted)', fontSize: 13 }}>Cargando...</p> : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Restaurante &amp; Soda</th>
                <th>Teléfono</th>
                <th>Distrito</th>
                <th>Cantón</th>
                <th>Orden</th>
                <th>Visible</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr><td colSpan={7} style={{ color: 'var(--muted)', textAlign: 'center' }}>Sin registros. Agrega el primero.</td></tr>
              )}
              {items.map(item => (
                <tr key={item._id}>
                  <td><strong>{item.nombre}</strong></td>
                  <td>{item.telefono || '—'}</td>
                  <td>{item.distrito || '—'}</td>
                  <td>{item.canton || '—'}</td>
                  <td>{item.order}</td>
                  <td><span className={'badge ' + (item.isVisible ? 'badge-active' : 'badge-inactive')}>{item.isVisible ? 'Sí' : 'No'}</span></td>
                  <td className="actions">
                    <button className="btn-edit-sm"   onClick={() => startEdit(item)}>Editar</button>
                    <button className="btn-delete-sm" onClick={() => handleDelete(item._id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

// ─── Miradores & Sitios ──────────────────────────────────────────────────────
const EMPTY_MIR = { sitio: '', canton: '', order: 0, isVisible: true };

function MiradoresTab() {
  const toast = useToast();
  const [items,   setItems]   = useState([]);
  const [editing, setEditing] = useState(null);
  const [adding,  setAdding]  = useState(false);
  const [form,    setForm]    = useState(EMPTY_MIR);
  const [saving,  setSaving]  = useState(false);
  const [loading, setLoading] = useState(true);

  const load = () => getMiradoresSitios().then(setItems).catch(e => toast(e.message, 'error')).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const startAdd  = () => { setAdding(true); setEditing(null); setForm({ ...EMPTY_MIR, order: items.length + 1 }); };
  const startEdit = (item) => {
    setEditing(item._id); setAdding(false);
    setForm({ sitio: item.sitio, canton: item.canton || '', order: item.order, isVisible: item.isVisible });
  };
  const cancel = () => { setEditing(null); setAdding(false); };

  const handleSave = async () => {
    if (!form.sitio.trim()) { toast('El nombre del sitio es obligatorio', 'error'); return; }
    setSaving(true);
    try {
      if (adding) {
        const created = await createMiradorSitio(form);
        setItems(p => [...p, created]);
      } else {
        const u = await updateMiradorSitio(editing, form);
        setItems(p => p.map(i => i._id === editing ? u : i));
      }
      cancel(); toast('Guardado', 'success');
    } catch (err) { toast(err.message, 'error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este registro?')) return;
    try { await deleteMiradorSitio(id); setItems(p => p.filter(i => i._id !== id)); toast('Eliminado', 'success'); }
    catch (err) { toast(err.message, 'error'); }
  };

  const field = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <>
      {!adding && !editing && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <button className="btn-add" onClick={startAdd}>+ Agregar mirador / sitio</button>
        </div>
      )}

      {(adding || editing) && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 className="upload-card-title">{adding ? '➕ Nuevo mirador / sitio' : '✏️ Editar mirador / sitio'}</h3>
          <div className="edit-form">
            <div className="field">
              <label>Nombre del sitio *</label>
              <input value={form.sitio}  onChange={field('sitio')}  placeholder="Mirador Cerro Amigos" />
            </div>
            <div className="field">
              <label>Cantón</label>
              <input value={form.canton} onChange={field('canton')} placeholder="San Ramón" />
            </div>
            <div className="field-row">
              <div className="field field-sm">
                <label>Orden</label>
                <input type="number" min="0" value={form.order} onChange={e => setForm(p => ({ ...p, order: Number(e.target.value) }))} />
              </div>
              <div className="field-check" style={{ marginTop: 'auto', paddingBottom: 4 }}>
                <input type="checkbox" id="mir-visible" checked={form.isVisible} onChange={e => setForm(p => ({ ...p, isVisible: e.target.checked }))} />
                <label htmlFor="mir-visible">Visible en el sitio</label>
              </div>
            </div>
            <div className="btn-row">
              <button className="btn-save" onClick={handleSave} disabled={saving}>{saving ? 'Guardando...' : '💾 Guardar'}</button>
              <button className="btn-cancel" onClick={cancel}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {loading ? <p style={{ color: 'var(--muted)', fontSize: 13 }}>Cargando...</p> : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Sitio</th>
                <th>Cantón</th>
                <th>Orden</th>
                <th>Visible</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr><td colSpan={5} style={{ color: 'var(--muted)', textAlign: 'center' }}>Sin registros. Agrega el primero.</td></tr>
              )}
              {items.map(item => (
                <tr key={item._id}>
                  <td><strong>{item.sitio}</strong></td>
                  <td>{item.canton || '—'}</td>
                  <td>{item.order}</td>
                  <td><span className={'badge ' + (item.isVisible ? 'badge-active' : 'badge-inactive')}>{item.isVisible ? 'Sí' : 'No'}</span></td>
                  <td className="actions">
                    <button className="btn-edit-sm"   onClick={() => startEdit(item)}>Editar</button>
                    <button className="btn-delete-sm" onClick={() => handleDelete(item._id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

// ─── Áreas Protegidas ────────────────────────────────────────────────────────
const EMPTY_AREA = { nombre: '', order: 0, isVisible: true };

function AreasTab() {
  const toast = useToast();
  const [items,   setItems]   = useState([]);
  const [editing, setEditing] = useState(null);
  const [adding,  setAdding]  = useState(false);
  const [form,    setForm]    = useState(EMPTY_AREA);
  const [saving,  setSaving]  = useState(false);
  const [loading, setLoading] = useState(true);

  const load = () => getAreasProtegidas().then(setItems).catch(e => toast(e.message, 'error')).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const startAdd  = () => { setAdding(true); setEditing(null); setForm({ ...EMPTY_AREA, order: items.length + 1 }); };
  const startEdit = (item) => {
    setEditing(item._id); setAdding(false);
    setForm({ nombre: item.nombre, order: item.order, isVisible: item.isVisible });
  };
  const cancel = () => { setEditing(null); setAdding(false); };

  const handleSave = async () => {
    if (!form.nombre.trim()) { toast('El nombre es obligatorio', 'error'); return; }
    setSaving(true);
    try {
      if (adding) {
        const created = await createAreaProtegida(form);
        setItems(p => [...p, created]);
      } else {
        const u = await updateAreaProtegida(editing, form);
        setItems(p => p.map(i => i._id === editing ? u : i));
      }
      cancel(); toast('Guardado', 'success');
    } catch (err) { toast(err.message, 'error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este registro?')) return;
    try { await deleteAreaProtegida(id); setItems(p => p.filter(i => i._id !== id)); toast('Eliminado', 'success'); }
    catch (err) { toast(err.message, 'error'); }
  };

  return (
    <>
      {!adding && !editing && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <button className="btn-add" onClick={startAdd}>+ Agregar área protegida</button>
        </div>
      )}

      {(adding || editing) && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 className="upload-card-title">{adding ? '➕ Nueva área silvestre protegida' : '✏️ Editar área silvestre protegida'}</h3>
          <div className="edit-form">
            <div className="field">
              <label>Nombre del área *</label>
              <input
                value={form.nombre}
                onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))}
                placeholder="Reserva Biológica Alberto Manuel Brenes"
              />
            </div>
            <div className="field-row">
              <div className="field field-sm">
                <label>Orden</label>
                <input type="number" min="0" value={form.order} onChange={e => setForm(p => ({ ...p, order: Number(e.target.value) }))} />
              </div>
              <div className="field-check" style={{ marginTop: 'auto', paddingBottom: 4 }}>
                <input type="checkbox" id="area-visible" checked={form.isVisible} onChange={e => setForm(p => ({ ...p, isVisible: e.target.checked }))} />
                <label htmlFor="area-visible">Visible en el sitio</label>
              </div>
            </div>
            <div className="btn-row">
              <button className="btn-save" onClick={handleSave} disabled={saving}>{saving ? 'Guardando...' : '💾 Guardar'}</button>
              <button className="btn-cancel" onClick={cancel}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {loading ? <p style={{ color: 'var(--muted)', fontSize: 13 }}>Cargando...</p> : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nombre del Área Silvestre Protegida</th>
                <th>Orden</th>
                <th>Visible</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr><td colSpan={4} style={{ color: 'var(--muted)', textAlign: 'center' }}>Sin registros. Agrega el primero.</td></tr>
              )}
              {items.map(item => (
                <tr key={item._id}>
                  <td><strong>{item.nombre}</strong></td>
                  <td>{item.order}</td>
                  <td><span className={'badge ' + (item.isVisible ? 'badge-active' : 'badge-inactive')}>{item.isVisible ? 'Sí' : 'No'}</span></td>
                  <td className="actions">
                    <button className="btn-edit-sm"   onClick={() => startEdit(item)}>Editar</button>
                    <button className="btn-delete-sm" onClick={() => handleDelete(item._id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

// ─── Página principal con tabs ───────────────────────────────────────────────
const TABS = [
  { key: 'restaurantes', label: '🍽️ Restaurantes & Sodas' },
  { key: 'miradores',    label: '🏔️ Miradores y Sitios' },
  { key: 'areas',        label: '🌿 Áreas Protegidas' },
];

export default function RestaurantesMiradoresPage() {
  const [tab, setTab] = useState('restaurantes');

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Restaurantes, Miradores y Áreas Protegidas</h2>
      </div>
      <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 20 }}>
        Administra los elementos complementarios de la Red de Turismo Sostenible.
      </p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: '8px 18px',
              borderRadius: 8,
              border: '2px solid',
              borderColor: tab === t.key ? 'var(--accent)' : 'var(--border)',
              background: tab === t.key ? 'var(--accent)' : 'var(--white)',
              color: tab === t.key ? '#fff' : 'var(--text)',
              fontWeight: tab === t.key ? 600 : 400,
              fontSize: 13,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'restaurantes' && <RestaurantesTab />}
      {tab === 'miradores'    && <MiradoresTab />}
      {tab === 'areas'        && <AreasTab />}
    </div>
  );
}
