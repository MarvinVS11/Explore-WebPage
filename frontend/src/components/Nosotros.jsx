import useSection from '../hooks/useSection';
import DynamicImage from './DinamicImage';
import Skeleton from './Skeleton';

export default function Nosotros() {
  const { data, images, loading } = useSection('nosotros');

  const logo    = images.find(img => img.role === 'logo' && img.isActive !== false);
  const galeria = images.filter(img => img.role === 'galeria' && img.isActive !== false)
                        .sort((a, b) => a.order - b.order);

  if (loading) {
    return (
      <section id="nosotros" className="nosotros">
        <div className="nosotros-inner">
          <Skeleton height="200px" borderRadius="12px" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Skeleton height="1rem" width="120px" />
            <Skeleton height="2rem" width="80%" />
            <Skeleton height="1rem" />
            <Skeleton height="1rem" />
            <Skeleton height="1rem" width="70%" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="nosotros" className="nosotros section-reveal">
      <div className="nosotros-inner">

        {logo && (
          <div className="nosotros-img">
            <DynamicImage
              src={logo.url}
              alt={logo.alt || 'Fundación Bosque Nuboso'}
            />
          </div>
        )}

        <div className="nosotros-text">
          <h2>{data?.title}</h2>
          <p>{data?.body}</p>
          {data?.ctaText && (
            <a
              href={data.ctaLink}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary"
            >
              {data.ctaText}
            </a>
          )}
        </div>

      </div>

      {galeria.length > 0 && (
        <div className="nosotros-galeria">
          {galeria.map(img => (
            <div key={img._id} className="nosotros-galeria-item">
              <DynamicImage
                src={img.url}
                alt={img.alt || ''}
                className="nosotros-galeria-img"
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
