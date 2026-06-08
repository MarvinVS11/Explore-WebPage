import useSection from '../hooks/useSection';
import useSiteConfig from '../hooks/useSiteConfig';
import DynamicImage from './DinamicImage';
import Skeleton from './Skeleton';

export default function RedTurismo() {
  const { data, images, loading }           = useSection('red');
  const { redItems, loading: loadingItems } = useSiteConfig();

  const galeria = images
    .filter(img => img.isActive !== false)
    .sort((a, b) => a.order - b.order);

  if (loading || loadingItems) {
    return (
      <section id="proyectos" className="red-turismo">
        <div className="section-header">
          <Skeleton height="2rem" width="60%" />
        </div>
        <div className="red-grid">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} height="52px" borderRadius="50px" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="proyectos" className="red-turismo section-reveal">
      <div className="section-header">
        <h2>{data?.title}</h2>
        <p>{data?.body}</p>
      </div>

      {galeria.length > 0 && (
        <div className="red-galeria">
          {galeria.map(img => (
            <div key={img._id} className="red-galeria-item">
              <DynamicImage
                src={img.url}
                alt={img.alt || ''}
                className="red-galeria-img"
              />
            </div>
          ))}
        </div>
      )}

      <div className="red-grid">
        {redItems.map((item) => (
          <a
            key={item._id}
            href={item.href}
            target={item.type === 'internal' ? '_self' : '_blank'}
            rel="noreferrer"
            className="red-btn"
          >
            {item.iconUrl && (
              <img
                src={item.iconUrl}
                alt={item.label}
                className="red-btn-icon"
              />
            )}
            {item.label}
          </a>
        ))}
      </div>
    </section>
  );
}
