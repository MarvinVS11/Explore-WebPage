import useSection from '../hooks/useSection';
import useSiteConfig from '../hooks/useSiteConfig';
import Skeleton from './Skeleton';

const DEFAULT_ICONS = {
  hospedaje:    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>,
  recreacion:   <><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></>,
  aves:         <path d="M22 2l-8.5 8.5M22 2H15M22 2v7M16 8C8 8 4 12 2 22c3-4 6-5 9-5 0 3 2 5 4 5 4 0 6-3.5 6-7 0-2-.5-4-2-5 0 0-1-1-3-1z"/>,
  senderismo:   <><circle cx="12" cy="5" r="2"/><path d="M5 22l2-8 3 3 2-9 2 9 3-3 2 8"/></>,
  tour:         <><path d="M3 11l19-9-9 19-2-8-8-2z"/></>,
  restaurante:  <><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></>,
};

function getDefaultIcon(label = '') {
  const l = label.toLowerCase();
  if (l.includes('hospedaje') || l.includes('alojamiento')) return DEFAULT_ICONS.hospedaje;
  if (l.includes('recreaci'))  return DEFAULT_ICONS.recreacion;
  if (l.includes('ave'))       return DEFAULT_ICONS.aves;
  if (l.includes('senderismo') || l.includes('caminata')) return DEFAULT_ICONS.senderismo;
  if (l.includes('tour') || l.includes('chapuli'))        return DEFAULT_ICONS.tour;
  if (l.includes('restaurante') || l.includes('mirador')) return DEFAULT_ICONS.restaurante;
  return <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 3a7 7 0 1 1 0 14A7 7 0 0 1 12 5z"/>;
}

function ArrowIcon() {
  return (
    <svg className="red-card-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  );
}

export default function RedTurismo() {
  const { data, loading }                     = useSection('red');
  const { redItems, loading: loadingItems }   = useSiteConfig();

  if (loading || loadingItems) {
    return (
      <section id="redturismo" className="red-turismo">
        <div className="red-inner">
          <div className="section-header">
            <Skeleton height="1rem" width="150px" />
            <Skeleton height="2rem" width="60%" />
          </div>
          <div className="red-cards">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} height="120px" borderRadius="12px" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="redturismo" className="red-turismo section-reveal">
      <div className="red-inner">
        <div className="section-header">
          <h2>{data?.title}</h2>
          <p>{data?.body}</p>
        </div>

        <div className="red-cards">
          {redItems.map((item) => (
            <a
              key={item._id}
              href={item.href}
              target={item.type === 'internal' ? '_self' : '_blank'}
              rel="noreferrer"
              className="red-card"
            >
              <div className="red-card-icon">
                {item.iconUrl
                  ? <img src={item.iconUrl} alt="" />
                  : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      {getDefaultIcon(item.label)}
                    </svg>
                  )
                }
              </div>
              <span className="red-card-label">{item.label}</span>
              <ArrowIcon />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
