import { useState, useEffect, useRef } from 'react';
import { getSections, updateSection, uploadFile } from '../api';
import { useSite } from '../context/SiteContext';
import { useToast } from '../context/ToastContext.jsx';

const ALL_SECTION_LABELS = {
  hero:               'Hero (inicio)',
  nosotros:           'Nosotros',
  servicios:          'Nuestros Servicios',
  galeria:            'Galería de fotos',
  red:                'Red de Turismo Sostenible',
  hospedajes:         'Hospedajes',
  recreacion:         'Sitios de Recreación',
  restaurantes:       'Restaurantes y Miradores',
  'explore-occidente': 'Explore Occidente',
  mapa:               'Mapa Turístico',
  contacto:           'Contacto',
};

const EXPLORE_HIDDEN = ['servicios', 'explore-occidente'];
const FUBONO_HIDDEN  = ['hospedajes', 'recreacion', 'restaurantes'];

function PopupItemEditor({ item, onChange, onRemove }) {
  const fileRef    = useRef();
  const [uploading, setUploading] = useState(false);

  const set = (field, value) => onChange({ ...item, [field]: value });

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await uploadFile(file, 'image');
      set('imageUrl', url);
    } catch {
      // silencioso — el campo URL queda vacío para que reintenten
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 8, padding: '0.75rem', marginBottom: '0.5rem', background: 'var(--bg)' }}>
      <div className="field">
        <label>Título del ítem</label>
        <input value={item.title || ''} onChange={e => set('title', e.target.value)} placeholder="Ej: Turismo 360" />
      </div>
      <div className="field">
        <label>Descripción del ítem</label>
        <textarea rows={2} value={item.description || ''} onChange={e => set('description', e.target.value)} placeholder="Descripción del ítem..." />
      </div>
      <div className="field">
        <label>Imagen (opcional)</label>
        <input value={item.imageUrl || ''} onChange={e => set('imageUrl', e.target.value)} placeholder="https://..." style={{ marginBottom: 6 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUpload} />
          <button className="btn-upload" type="button" onClick={() => fileRef.current.click()} disabled={uploading}>
            {uploading ? '⏳ Subiendo...' : '📤 Subir imagen'}
          </button>
          {item.imageUrl && (
            <img src={item.imageUrl} alt="" style={{ height: 40, borderRadius: 4, objectFit: 'cover' }}
              onError={e => { e.target.style.display = 'none'; }} />
          )}
        </div>
      </div>
      <button className="btn-delete-sm" type="button" onClick={onRemove} style={{ marginTop: 4 }}>
        Eliminar ítem
      </button>
    </div>
  );
}

const ROW_STYLE = { border: '1px solid var(--border)', borderRadius: 8, padding: '0.75rem', marginBottom: '0.5rem', background: 'var(--bg)' };

function MarketingPopupEditor({ extra, onChange }) {
  const set = (key, val) => onChange({ ...extra, [key]: val });

  const getCats  = ()          => extra['marketing_popup_categorias'] || [];
  const setCats  = (arr)       => set('marketing_popup_categorias', arr);
  const addCat   = ()          => setCats([...getCats(), { nombre: '', descripcion: '', precio: '' }]);
  const removeCat = (i)        => setCats(getCats().filter((_, idx) => idx !== i));
  const updateCat = (i, f, v)  => setCats(getCats().map((c, idx) => idx === i ? { ...c, [f]: v } : c));

  const getTabla  = ()          => extra['marketing_popup_tabla'] || [];
  const setTabla  = (arr)       => set('marketing_popup_tabla', arr);
  const addFila   = ()          => setTabla([...getTabla(), { beneficio: '', premium: '', standard: '' }]);
  const removeFila = (i)        => setTabla(getTabla().filter((_, idx) => idx !== i));
  const updateFila = (i, f, v)  => setTabla(getTabla().map((r, idx) => idx === i ? { ...r, [f]: v } : r));

  return (
    <details style={{ marginTop: '0.75rem' }}>
      <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: 13, color: 'var(--primary)', marginBottom: '0.5rem' }}>
        📋 Contenido del popup Marketing (tablas)
      </summary>

      <div className="field">
        <label>Título del popup</label>
        <input value={extra['marketing_popup_title'] || ''} onChange={e => set('marketing_popup_title', e.target.value)} placeholder="Marketing Turístico Explore & Connect Membership" />
      </div>
      <div className="field">
        <label>Texto introductorio</label>
        <textarea rows={3} value={extra['marketing_popup_body'] || ''} onChange={e => set('marketing_popup_body', e.target.value)} placeholder="Si su deseo es que su emprendimiento se posicione..." />
      </div>

      <div className="field">
        <label>Título sección beneficios</label>
        <input value={extra['marketing_popup_beneficios_title'] || ''} onChange={e => set('marketing_popup_beneficios_title', e.target.value)} placeholder="Beneficios de afiliarse" />
      </div>
      <div className="field">
        <label>Descripción de beneficios</label>
        <textarea rows={3} value={extra['marketing_popup_beneficios_body'] || ''} onChange={e => set('marketing_popup_beneficios_body', e.target.value)} placeholder="Ser parte del sistema de membresías..." />
      </div>

      <div className="field">
        <label>Título tabla de categorías</label>
        <input value={extra['marketing_popup_categorias_title'] || ''} onChange={e => set('marketing_popup_categorias_title', e.target.value)} placeholder="Categorías de membresías" />
      </div>
      <div className="field">
        <label style={{ marginBottom: '0.5rem', display: 'block' }}>Columnas de categorías (ej: Premium, Standard)</label>
        {getCats().map((cat, i) => (
          <div key={i} style={ROW_STYLE}>
            <div className="field">
              <label>Nombre de la categoría</label>
              <input value={cat.nombre} onChange={e => updateCat(i, 'nombre', e.target.value)} placeholder="Premium" />
            </div>
            <div className="field">
              <label>Descripción</label>
              <textarea rows={2} value={cat.descripcion} onChange={e => updateCat(i, 'descripcion', e.target.value)} placeholder="Esta membresía es para..." />
            </div>
            <div className="field">
              <label>Precio / condiciones</label>
              <input value={cat.precio} onChange={e => updateCat(i, 'precio', e.target.value)} placeholder="$240 anuales · Modalidad: semestral" />
            </div>
            <button className="btn-delete-sm" type="button" onClick={() => removeCat(i)}>Eliminar categoría</button>
          </div>
        ))}
        <button className="btn-edit" type="button" onClick={addCat} style={{ marginTop: '0.25rem' }}>+ Agregar categoría</button>
      </div>

      <div className="field">
        <label>Título tabla comparativa</label>
        <input value={extra['marketing_popup_tabla_title'] || ''} onChange={e => set('marketing_popup_tabla_title', e.target.value)} placeholder="¿Qué incluye cada categoría de membresía?" />
      </div>
      <div className="field">
        <label style={{ marginBottom: '0.5rem', display: 'block' }}>Filas de la tabla comparativa</label>
        {getTabla().map((fila, i) => (
          <div key={i} style={{ ...ROW_STYLE, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '0.5rem', alignItems: 'center' }}>
            <input value={fila.beneficio} onChange={e => updateFila(i, 'beneficio', e.target.value)} placeholder="Beneficio" />
            <input value={fila.premium}   onChange={e => updateFila(i, 'premium',   e.target.value)} placeholder="Premium (ej: ✓ o 25%)" />
            <input value={fila.standard}  onChange={e => updateFila(i, 'standard',  e.target.value)} placeholder="Standard (ej: ✓ o 15%)" />
            <button className="btn-delete-sm" type="button" onClick={() => removeFila(i)} style={{ whiteSpace: 'nowrap' }}>✕</button>
          </div>
        ))}
        <button className="btn-edit" type="button" onClick={addFila} style={{ marginTop: '0.25rem' }}>+ Agregar fila</button>
      </div>
    </details>
  );
}

function ExtraFields({ sectionKey, extra, onChange }) {
  const set = (field, value) => onChange({ ...extra, [field]: value });

  if (sectionKey === 'servicios') {
    const CARDS = [
      { id: 'asesorias', defaultLabel: 'Asesorías y consultorías' },
      { id: 'marketing', defaultLabel: 'Marketing turístico' },
      { id: 'charlas',   defaultLabel: 'Charlas y conferencias' },
      { id: 'cursos',    defaultLabel: 'Cursos formativos' },
    ];

    const getItems = (id) => extra[`${id}_popup_items`] || [];

    const setItems = (id, items) => onChange({ ...extra, [`${id}_popup_items`]: items });

    const addItem = (id) =>
      setItems(id, [...getItems(id), { title: '', description: '', imageUrl: '' }]);

    const removeItem = (id, idx) =>
      setItems(id, getItems(id).filter((_, i) => i !== idx));

    const updateItem = (id, idx, updated) => {
      const items = getItems(id).map((item, i) => i === idx ? updated : item);
      setItems(id, items);
    };

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
                <label>Enlace href (sin popup)</label>
                <input
                  value={extra[`${card.id}_href`] || ''}
                  onChange={e => set(`${card.id}_href`, e.target.value)}
                  placeholder="#contacto"
                />
              </div>
            </div>

            {card.id === 'marketing' ? (
              <MarketingPopupEditor extra={extra} onChange={onChange} />
            ) : (
              <details style={{ marginTop: '0.75rem' }}>
                <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: 13, color: 'var(--primary)', marginBottom: '0.5rem' }}>
                  📋 Contenido del popup (si se configura, ignora el enlace href)
                </summary>

                <div className="field">
                  <label>Título del popup</label>
                  <input
                    value={extra[`${card.id}_popup_title`] || ''}
                    onChange={e => set(`${card.id}_popup_title`, e.target.value)}
                    placeholder={card.defaultLabel}
                  />
                </div>

                <div className="field">
                  <label>Descripción</label>
                  <textarea
                    rows={3}
                    value={extra[`${card.id}_popup_body`] || ''}
                    onChange={e => set(`${card.id}_popup_body`, e.target.value)}
                    placeholder="Texto introductorio del servicio..."
                  />
                </div>

                <div className="field">
                  <label>Subtítulo (texto secundario en mayúsculas)</label>
                  <input
                    value={extra[`${card.id}_popup_subtitle`] || ''}
                    onChange={e => set(`${card.id}_popup_subtitle`, e.target.value)}
                    placeholder="LE OFRECEMOS EL SERVICIO EN LAS SIGUIENTES ÁREAS"
                  />
                </div>

                <div className="field">
                  <label style={{ marginBottom: '0.5rem', display: 'block' }}>Ítems del popup</label>
                  {getItems(card.id).map((item, idx) => (
                    <PopupItemEditor
                      key={idx}
                      item={item}
                      onChange={updated => updateItem(card.id, idx, updated)}
                      onRemove={() => removeItem(card.id, idx)}
                    />
                  ))}
                  <button
                    className="btn-edit"
                    type="button"
                    onClick={() => addItem(card.id)}
                    style={{ marginTop: '0.25rem' }}
                  >
                    + Agregar ítem
                  </button>
                </div>
              </details>
            )}
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
  const toast = useToast();
  const [sections, setSections] = useState([]);
  const [editing,  setEditing]  = useState(null);
  const [form,     setForm]     = useState({});
  const [extra,    setExtra]    = useState({});
  const [saving,   setSaving]   = useState(false);
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
      .catch(err => toast(err.message, 'error'))
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
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await updateSection(editing, { ...form, extraData: extra });
      setSections(prev => prev.map(s => s.key === editing ? updated : s));
      setEditing(null);
      toast('Sección guardada correctamente', 'success');
    } catch (err) {
      toast(err.message, 'error');
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

                {(section.key === 'hero' || section.key === 'nosotros' || section.key === 'explore-occidente') && (
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
