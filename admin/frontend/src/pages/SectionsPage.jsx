import { useState, useEffect } from 'react';
import { getSections, updateSection } from '../api';

const SECTION_LABELS = {
  hero:     'Hero (inicio)',
  nosotros: 'Nosotros',
  red:      'Red de Turismo Sostenible',
  mapa:     'Mapa Turístico',
  contacto: 'Contacto',
};

export default function SectionsPage() {
  const [sections, setSections] = useState([]);
  const [editing,  setEditing]  = useState(null);
  const [form,     setForm]     = useState({});
  const [saving,   setSaving]   = useState(false);
  const [msg,      setMsg]      = useState('');
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    getSections()
      .then(setSections)
      .catch(err => setMsg('❌ ' + err.message))
      .finally(() => setLoading(false));
  }, []);

  const startEdit = (section) => {
    setEditing(section.key);
    setForm({
      title:     section.title     || '',
      subtitle:  section.subtitle  || '',
      body:      section.body      || '',
      ctaText:   section.ctaText   || '',
      ctaLink:   section.ctaLink   || '',
      isVisible: section.isVisible ?? true,
      extraData: JSON.stringify(section.extraData || {}, null, 2),
    });
    setMsg('');
  };

  const handleSave = async () => {
    setSaving(true);
    setMsg('');
    try {
      let extraData = {};
      try { extraData = JSON.parse(form.extraData); } catch { extraData = {}; }

      const updated = await updateSection(editing, { ...form, extraData });
      setSections(prev => prev.map(s => s.key === editing ? updated : s));
      setEditing(null);
      setMsg('✅ Sección guardada correctamente');
    } catch (err) {
      setMsg('❌ ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="page-loading">Cargando secciones...</div>;

  return (
    <div className="page">
      <h2 className="page-title">Secciones del sitio</h2>
      {msg && <p className="status-msg">{msg}</p>}

      <div className="cards">
        {sections.map(section => (
          <div key={section.key} className="card">
            <div className="card-header">
              <div>
                <span className="card-key">{section.key}</span>
                <h3>{SECTION_LABELS[section.key] || section.key}</h3>
              </div>
              {editing !== section.key && (
                <button className="btn-edit" onClick={() => startEdit(section)}>
                  Editar
                </button>
              )}
            </div>

            {editing === section.key ? (
              <div className="edit-form">
                <div className="field">
                  <label>Título</label>
                  <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
                </div>
                <div className="field">
                  <label>Subtítulo</label>
                  <input value={form.subtitle} onChange={e => setForm({...form, subtitle: e.target.value})} />
                </div>
                <div className="field">
                  <label>Cuerpo / Descripción</label>
                  <textarea rows={4} value={form.body} onChange={e => setForm({...form, body: e.target.value})} />
                </div>
                <div className="field-row">
                  <div className="field">
                    <label>Texto del botón CTA</label>
                    <input value={form.ctaText} onChange={e => setForm({...form, ctaText: e.target.value})} />
                  </div>
                  <div className="field">
                    <label>Link del botón CTA</label>
                    <input value={form.ctaLink} onChange={e => setForm({...form, ctaLink: e.target.value})} />
                  </div>
                </div>
                <div className="field">
                  <label>Datos extra (JSON)</label>
                  <textarea
                    rows={5}
                    className="code-textarea"
                    value={form.extraData}
                    onChange={e => setForm({...form, extraData: e.target.value})}
                  />
                </div>
                <div className="field-check">
                  <input
                    type="checkbox"
                    id={`vis-${section.key}`}
                    checked={form.isVisible}
                    onChange={e => setForm({...form, isVisible: e.target.checked})}
                  />
                  <label htmlFor={`vis-${section.key}`}>Visible en el sitio</label>
                </div>
                <div className="btn-row">
                  <button className="btn-save" onClick={handleSave} disabled={saving}>
                    {saving ? 'Guardando...' : 'Guardar'}
                  </button>
                  <button className="btn-cancel" onClick={() => setEditing(null)}>
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="card-preview">
                {section.title && <p><strong>Título:</strong> {section.title}</p>}
                {section.body  && <p className="preview-body">{section.body.slice(0, 120)}…</p>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
