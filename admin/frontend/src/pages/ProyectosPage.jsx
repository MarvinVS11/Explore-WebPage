import { useState, useEffect, useRef } from 'react';
import {
  getProyectos, createProyecto, updateProyecto, deleteProyecto, uploadProyectoImage,
} from '../api';
import { useToast } from '../context/ToastContext.jsx';

const EMPTY_LINK = { label: '', href: '', isPrimary: false };

const EMPTY_PROJECT = {
  title: '', description: '', order: 1, isVisible: true, links: [],
};

function LinkEditor({ links, onChange }) {
  const add    = () => onChange([...links, { ...EMPTY_LINK, _id: Date.now() }]);
  const remove = (idx) => onChange(links.filter((_, i) => i !== idx));
  const update = (idx, field, value) =>
    onChange(links.map((l, i) => i === idx ? { ...l, [field]: value } : l));

  return (
    <div className="link-editor">
      <div className="field-label-row">
        <label>Enlaces</label>
        <button type="button" className="btn-add-sm" onClick={add}>+ Agregar enlace</button>
      </div>
      {links.length === 0 && (
        <p className="empty-hint">Sin enlaces. Haz clic en "+ Agregar enlace".</p>
      )}
      {links.map((link, idx) => (
        <div key={link._id || idx} className="link-row">
          <div className="field">
            <label>Etiqueta</label>
            <input
              value={link.label}
              onChange={e => update(idx, 'label', e.target.value)}
              placeholder="Ej: Ver más, Descargar PDF..."
            />
          </div>
          <div className="field">
            <label>URL / Enlace</label>
            <input
              value={link.href}
              onChange={e => update(idx, 'href', e.target.value)}
              placeholder="https://... o #seccion"
            />
          </div>
          <div className="field-check" style={{ alignSelf: 'flex-end', paddingBottom: '0.5rem' }}>
            <input
              type="checkbox"
              id={`primary-${idx}`}
              checked={link.isPrimary}
              onChange={e => update(idx, 'isPrimary', e.target.checked)}
            />
            <label htmlFor={`primary-${idx}`}>Estilo botón</label>
          </div>
          <button type="button" className="btn-delete-sm" onClick={() => remove(idx)}>✕</button>
        </div>
      ))}
    </div>
  );
}

function ImageUploader({ projectId, side, currentUrl, onUploaded }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError]         = useState('');
  const inputRef = useRef();

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const updated = await uploadProyectoImage(projectId, side, file);
      onUploaded(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const label = side === 'left' ? 'Imagen izquierda' : 'Imagen derecha';

  return (
    <div className="img-uploader">
      <p className="img-uploader-label">{label}</p>
      {currentUrl
        ? <img src={currentUrl} alt={label} className="img-uploader-preview" />
        : <div className="img-uploader-empty">Sin imagen</div>
      }
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFile}
      />
      <button
        type="button"
        className="btn-upload"
        onClick={() => inputRef.current.click()}
        disabled={uploading}
      >
        {uploading ? 'Subiendo...' : currentUrl ? 'Cambiar imagen' : 'Subir imagen'}
      </button>
      {error && <p className="error-msg">{error}</p>}
    </div>
  );
}

export default function ProyectosPage() {
  const toast = useToast();
  const [projects, setProjects] = useState([]);
  const [editing,  setEditing]  = useState(null);
  const [adding,   setAdding]   = useState(false);
  const [form,     setForm]     = useState(EMPTY_PROJECT);
  const [links,    setLinks]    = useState([]);
  const [saving,   setSaving]   = useState(false);
  const [loading,  setLoading]  = useState(true);

  const load = () =>
    getProyectos()
      .then(setProjects)
      .catch(err => toast(err.message, 'error'))
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const startAdd = () => {
    setAdding(true);
    setEditing(null);
    setForm({ ...EMPTY_PROJECT, order: projects.length + 1 });
    setLinks([]);
  };

  const startEdit = (p) => {
    setEditing(p._id);
    setAdding(false);
    setForm({
      title:       p.title,
      description: p.description,
      order:       p.order,
      isVisible:   p.isVisible,
    });
    setLinks(p.links || []);
  };

  const cancel = () => { setEditing(null); setAdding(false); };

  const handleSave = async () => {
    if (!form.title.trim()) { toast('El título es obligatorio', 'error'); return; }
    setSaving(true);
    try {
      const cleanLinks = links.map(({ _id, ...rest }) => rest);
      const body = { ...form, links: cleanLinks };
      if (adding) {
        const created = await createProyecto(body);
        setProjects(prev => [...prev, created]);
      } else {
        const updated = await updateProyecto(editing, body);
        setProjects(prev => prev.map(p => p._id === editing ? updated : p));
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
    if (!confirm('¿Eliminar este proyecto?')) return;
    try {
      await deleteProyecto(id);
      setProjects(prev => prev.filter(p => p._id !== id));
      toast('Proyecto eliminado', 'success');
    } catch (err) {
      toast(err.message, 'error');
    }
  };

  const handleImageUploaded = (updated) => {
    setProjects(prev => prev.map(p => p._id === updated._id ? updated : p));
  };

  const f = (field) => ({
    value:    form[field],
    onChange: e => setForm({ ...form, [field]: e.target.value }),
  });

  const isFormOpen = editing !== null || adding;
  const editingProject = editing ? projects.find(p => p._id === editing) : null;

  if (loading) return <div className="page-loading">Cargando proyectos...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Proyectos</h2>
        {!isFormOpen && (
          <button className="btn-add" onClick={startAdd}>+ Nuevo proyecto</button>
        )}
      </div>

      {/* ── Formulario ── */}
      {isFormOpen && (
        <div className="card form-card">
          <h3>{adding ? 'Nuevo proyecto' : 'Editar proyecto'}</h3>

          <div className="field">
            <label>Título <span className="field-required">*</span></label>
            <input {...f('title')} placeholder="Nombre del proyecto" />
          </div>

          <div className="field">
            <label>Descripción</label>
            <textarea rows={5} {...f('description')} placeholder="Descripción del proyecto..." />
          </div>

          <div className="field-row">
            <div className="field field-sm">
              <label>Orden</label>
              <input type="number" value={form.order} onChange={e => setForm({ ...form, order: +e.target.value })} />
            </div>
            <div className="field-check" style={{ alignSelf: 'flex-end', paddingBottom: '0.6rem' }}>
              <input
                type="checkbox"
                id="isVisible"
                checked={form.isVisible}
                onChange={e => setForm({ ...form, isVisible: e.target.checked })}
              />
              <label htmlFor="isVisible">Visible en el sitio</label>
            </div>
          </div>

          <LinkEditor links={links} onChange={setLinks} />

          {/* Imágenes — solo disponibles al editar (se necesita el ID del proyecto) */}
          {editing && editingProject && (
            <div className="img-uploaders-row">
              <ImageUploader
                projectId={editing}
                side="left"
                currentUrl={editingProject.imgLeftUrl}
                onUploaded={handleImageUploaded}
              />
              <ImageUploader
                projectId={editing}
                side="right"
                currentUrl={editingProject.imgRightUrl}
                onUploaded={handleImageUploaded}
              />
            </div>
          )}
          {adding && (
            <p className="field-hint" style={{ marginTop: '0.5rem' }}>
              💡 Podrás subir las imágenes después de guardar el proyecto.
            </p>
          )}

          <div className="btn-row">
            <button className="btn-save" onClick={handleSave} disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
            <button className="btn-cancel" onClick={cancel}>Cancelar</button>
          </div>
        </div>
      )}

      {/* ── Lista de proyectos ── */}
      <div className="cards">
        {projects.length === 0 && !isFormOpen && (
          <p className="empty-hint">No hay proyectos. Haz clic en "+ Nuevo proyecto".</p>
        )}
        {projects.map(project => (
          <div key={project._id} className="card">
            <div className="card-header">
              <div>
                <span className="card-key">#{project.order}</span>
                <h3>{project.title}</h3>
                <span className={`badge ${project.isVisible ? 'badge-active' : 'badge-inactive'}`}>
                  {project.isVisible ? 'Visible' : 'Oculto'}
                </span>
              </div>
              {editing !== project._id && (
                <div className="action-btns">
                  <button className="btn-edit" onClick={() => startEdit(project)}>Editar</button>
                  <button className="btn-delete-sm" onClick={() => handleDelete(project._id)}>Eliminar</button>
                </div>
              )}
            </div>

            <div className="card-preview">
              {project.description && (
                <p className="preview-body">{project.description.slice(0, 120)}…</p>
              )}
              {project.links?.length > 0 && (
                <p><strong>Enlaces:</strong> {project.links.map(l => l.label).join(' · ')}</p>
              )}
              <div className="card-images-preview">
                {project.imgLeftUrl  && <img src={project.imgLeftUrl}  alt="Izquierda" />}
                {project.imgRightUrl && <img src={project.imgRightUrl} alt="Derecha" />}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
