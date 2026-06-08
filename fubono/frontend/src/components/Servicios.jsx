import useSection from '../hooks/useSection';
import Skeleton from './Skeleton';

const ICON = {
  viewBox: '0 0 64 64',
  fill: 'none',
  stroke: 'white',
  strokeWidth: '2.5',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  width: '100%',
  height: '100%',
};

function IconAsesoria() {
  return (
    <svg {...ICON}>
      <circle cx="20" cy="14" r="8" />
      <path d="M6 40C6 29 12 24 20 24s14 5 14 16" />
      <path d="M36 6h20a4 4 0 014 4v13a4 4 0 01-4 4H40l-6 7V27h-2a4 4 0 01-2-3.5V10a4 4 0 014-4z" />
      <line x1="42" y1="14" x2="54" y2="14" />
      <line x1="42" y1="21" x2="50" y2="21" />
      <rect x="36" y="36" width="22" height="24" rx="3" />
      <rect x="42" y="32" width="10" height="7" rx="2" />
      <line x1="41" y1="46" x2="53" y2="46" />
      <line x1="41" y1="52" x2="53" y2="52" />
      <line x1="41" y1="58" x2="48" y2="58" />
    </svg>
  );
}

function IconMarketing() {
  return (
    <svg {...ICON}>
      <rect x="4" y="24" width="13" height="16" rx="3" />
      <path d="M17 24L50 10v44L17 40z" />
      <path d="M54 20 Q62 32 54 44" strokeWidth="2.5" fill="none" />
      <path d="M10 40 L15 55 Q17 59 22 57 L20 42" />
    </svg>
  );
}

function IconCharla() {
  return (
    <svg {...ICON}>
      <circle cx="32" cy="8" r="7" />
      <path d="M20 24h24l5 20H15z" />
      <line x1="32" y1="15" x2="32" y2="24" />
      <rect x="28" y="14" width="8" height="5" rx="2" />
      <circle cx="12" cy="54" r="6" />
      <path d="M4 64 C4 57 7 52 12 52 C17 52 20 57 20 64" />
      <circle cx="32" cy="54" r="6" />
      <path d="M24 64 C24 57 27 52 32 52 C37 52 40 57 40 64" />
      <circle cx="52" cy="54" r="6" />
      <path d="M44 64 C44 57 47 52 52 52 C57 52 60 57 60 64" />
    </svg>
  );
}

function IconCurso() {
  return (
    <svg {...ICON}>
      <path d="M32 54V12C24 8 12 10 6 14V56C12 52 24 50 32 54z" />
      <path d="M32 54V12C40 8 52 10 58 14V56C52 52 40 50 32 54z" />
      <line x1="13" y1="22" x2="27" y2="22" />
      <line x1="13" y1="30" x2="27" y2="30" />
      <line x1="13" y1="38" x2="23" y2="38" />
      <polygon points="32,2 50,8 32,14 14,8" />
      <line x1="50" y1="8" x2="50" y2="18" />
      <circle cx="50" cy="20" r="2" fill="white" />
      <path d="M22 12v8c0 5 5 8 10 8s10-3 10-8v-8" />
    </svg>
  );
}

const CARD_DEFS = [
  { id: 'asesorias', Icon: IconAsesoria, defaultLabel: 'Asesorías y consultorías', gradient: 'linear-gradient(135deg, #15BDC5 0%, #4DC87A 100%)' },
  { id: 'marketing', Icon: IconMarketing, defaultLabel: 'Marketing turístico',       gradient: 'linear-gradient(135deg, #12B5C0 0%, #3DC472 100%)' },
  { id: 'charlas',   Icon: IconCharla,   defaultLabel: 'Charlas y conferencias',    gradient: 'linear-gradient(135deg, #0FAFC0 0%, #38C070 100%)' },
  { id: 'cursos',    Icon: IconCurso,    defaultLabel: 'Cursos formativos',          gradient: 'linear-gradient(135deg, #0CAABE 0%, #33BC6A 100%)' },
];

export default function Servicios() {
  const { data, loading } = useSection('servicios');

  if (loading) {
    return (
      <section id="servicios" className="servicios">
        <Skeleton height="2rem" width="30%" />
        <div className="servicios-grid" style={{ marginTop: '2rem' }}>
          {[1, 2, 3, 4].map(i => <Skeleton key={i} height="180px" borderRadius="1.25rem" />)}
        </div>
      </section>
    );
  }

  if (data?.isVisible === false) return null;

  const extra = data?.extraData || {};

  return (
    <section id="servicios" className="servicios section-reveal">
      <div className="servicios-inner">
        <div className="section-header">
          <h2>{data?.title || 'Nuestros Servicios'}</h2>
          {(data?.subtitle || data?.body) && (
            <p>{data.subtitle || data.body}</p>
          )}
        </div>
        <div className="servicios-grid">
          {CARD_DEFS.map(({ id, Icon, defaultLabel, gradient }) => {
            const label = extra[`${id}_label`] || defaultLabel;
            const href  = extra[`${id}_href`]  || '#contacto';
            return (
              <a
                key={id}
                href={href}
                className="servicio-card"
                style={{ background: gradient }}
                aria-label={label}
              >
                <div className="servicio-icon"><Icon /></div>
                <span className="servicio-label">{label}</span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
