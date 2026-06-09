import { useState, useEffect } from 'react';
import { getSections, updateSection } from '../api';
import { useSite } from '../context/SiteContext';

const ALL_SECTION_LABELS = {
  hero:        'Hero (inicio)',
  nosotros:    'Nosotros',
  servicios:   'Nuestros Servicios',
  galeria:     'Galería de fotos',
  red:         'Red de Turismo Sostenible',
  hospedajes:  'Hospedajes',
  mapa:        'Mapa Turístico',
  contacto:    'Contacto',
};

const EXPLORE_HIDDEN = ['servicios'];
const FUBONO_HIDDEN  = ['hospedajes'];

function ExtraFields({ sectionKey, extra, onChange }) {
  const set = (field, value) => onChange({ ...extra, [field]: value });

  if (sectionKey === 'servicios') {
    const CARDS = [
      { id: 'asesorias', defaultLabel: 'Asesorías y consultorías' },
      { id: 'marketing', defaultLabel: 'Marketing turístico' },
      { id: 'charlas',   defaultLabel: 'Charlas y conferencias' },
      { id: 'cursos',    defaultLabel: 'Cursos formativos' },
    ];
    return (
      <>
        {CARDS.map(card => (
          <div key={card.id} className="extra-group">
            <p className="extra-group-title">🪧 {card.defaultLabel}</p>
            <div className="field-row">
              <div className="field">
                <label>Etiqueta del card</label>
                <input
                  value={extra[`${card.id}_label`] || ''}
                  onChange={e => set(`${card.id}_label`, e.target.value)}
                  placeholder={card.defaultLabel}
                />
              </div>
              <div className="field field-sm">
                <label>Enlace (href)</label>
                <input
                  value={extra[`${card.id}_href`] || ''}
                  onChange={e => set(`${card.id}_href`, e.target.value)}
                  placeholder="#contacto"
                />
              </div>
            </div>
          </div>
        ))}
      </>
    );
  }

  if (sectionKey === 'nosotros') {
    return (
      <>
        <div className="field">
          <label>Misión</label>
          <textarea
            rows={4}
            value={extra.mision || ''}
            onChange={e => set('mision', e.target.value)}
            placeholder="Nuestra misión es..."
          />
        </div>
        <div className="field">
          <label>Visión</label>
          <textarea
            rows={4}
            value={extra.vision || ''}
            onChange={e => set('vision', e.target.value)}
            placeholder="Nuestra visión es..."
          />
        </div>
      </>
    );
  }

  if (sectionKey === 'mapa') {
    return (
      <div className="field">
        <label>URL de inserción del mapa (Google Maps embed)</label>
        <input
          value={extra.mapEmbedUrl || ''}
          onChange={e => set('mapEmbedUrl', e.target.value)}
          placeholder="https://www.google.com/maps/embed?pb=..."
        />
      </div>
    );
  }

  if (sectionKey === 'contacto') {
    return (
      <>
        <div className="field">
          <label>Dirección</label>
          <input
            value={extra.direccion || ''}
            onChange={e => set('direccion', e.target.value)}
            placeholder="San Ramón, Alajuela, Costa Rica"
          />
        </div>
        <div className="field-row">
          <div className="field">
            <label>Teléfono / WhatsApp</label>
            <input
              value={extra.telefono || ''}
              onChange={e => set('telefono', e.target.value)}
              placeholder="+50688888888"
            />
          </div>
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              value={extra.email || ''}
              onChange={e => set('email', e.target.value)}
              placeholder="info@ejemplo.com"
            />
          </div>
        </div>
        <div className="field">
          <label>Horario de atención</label>
          <input
            value={extra.horario || ''}
            onChange={e => set('horario', e.target.value)}
            placeholder="Lunes a viernes, 8:00 am – 5:00 pm"
          />
        </div>
      </>
    );
  }

  return null;
}

export default function SectionsPage() {
  const { siteId } = useSite();
  const [sections, setSections] = useState([]);
  const [editing,  setEditing]  = useState(null);
  const [form,     setForm]     = useState({});
  const [extra,    setExtra]    = useState({});
  const [saving,   setSaving]   = useState(false);
  const [msg,      setMsg]      = useState('');
  const [loading,  setLoading]  = useState(true);

  const hidden = siteId === 'explore' ? EXPLORE_HIDDEN : FUBONO_HIDDEN;
  const SECTION_LABELS = Object.fromEntries(
    Object.entries(ALL_SECTION_LABELS).filter(([k]) => !hidden.includes(k))
  );

  const KNOWN_KEYS = Object.keys(SECTION_LABELS);

  useEffect(() => {
    getSections()
      .then(dbSections => {
        const merged = KNOWN_KEYS.map(key => {
          const found = dbSections.find(s => s.key === key);
          return found || { key, title: '', subtitle: '', body: '', ctaText: '', ctaLink: '', isVisible: false, extraData: {} };
        });
        setSections(merged);
      })
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
    });
    setExtra(section.extraData || {});
    setMsg('');
  };

  const handleSave = async () => {
    setSaving(true);
    setMsg('');
    try {
      const updated = await updateSection(editing, { ...form, extraData: extra });
      setSections(prev => prev.map(s => s.key === editing ? updated : s));
      setEditing(null);
      setMsg('✅ Sección guardada correctamente');
    } catch (err) {
      setMsg('❌ ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const f = (field) => ({
    value:    form[field],
    onChange: e => setForm({ ...form, [field]: e.target.value }),
  });

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
                  <label>Título <span className="field-hint">(aparece como heading principal en el sitio)</span></label>
                  <input {...f('title')} />
                </div>

                {section.key === 'hero' && (
                  <div className="field">
                    <label>Subtítulo</label>
                    <input {...f('subtitle')} />
                  </div>
                )}

                {section.key !== 'hero' && (
                  <div className="field">
                    <label>Descripción</label>
                    <textarea rows={4} {...f('body')} />
                  </div>
                )}

                {(section.key === 'hero' || section.key === 'nosotros') && (
                  <div className="field-row">
                    <div className="field">
                      <label>Texto del botón</label>
                      <input {...f('ctaText')} />
                    </div>
                    <div className="field">
                      <label>Link del botón</label>
                      <input {...f('ctaLink')} />
                    </div>
                  </div>
                )}

                <ExtraFields
                  sectionKey={section.key}
                  extra={extra}
                  onChange={setExtra}
                />

                <div className="field-check">
                  <input
                    type="checkbox"
                    id={`vis-${section.key}`}
                    checked={form.isVisible}
                    onChange={e => setForm({ ...form, isVisible: e.target.checked })}
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
