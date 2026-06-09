import useSection from '../hooks/useSection';
import DynamicImage from './DinamicImage';
import Skeleton from './Skeleton';

export default function Nosotros() {
  const { data, images, loading } = useSection('nosotros');

  const portada = images.find(img => img.role === 'portada' && img.isActive !== false)
                ?? images.find(img => img.isActive !== false);

  if (loading) {
    return (
      <section id="nosotros" className="nosotros">
        <Skeleton height="340px" borderRadius="0" />
        <div className="nosotros-inner">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <Skeleton height="2rem" width="60%" />
            <Skeleton height="1rem" />
            <Skeleton height="1rem" width="80%" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="nosotros" className="nosotros section-reveal">

      {portada && (
        <div className="nosotros-portada">
          <DynamicImage
            src={portada.url}
            alt={portada.alt || 'Nosotros'}
            className="nosotros-portada-img"
          />
        </div>
      )}

      {!portada && (
        <div className="nosotros-portada nosotros-portada--empty" aria-hidden="true" />
      )}

      <div className="nosotros-inner">
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

    </section>
  );
}
