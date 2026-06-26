import useSection from '../hooks/useSection';
import Skeleton from './Skeleton';

export default function ExploreOccidente() {
  const { data, images, loading } = useSection('explore-occidente');

  const imagen = images.find(img => img.isActive !== false);

  if (loading) {
    return (
      <section id="explore-occidente" className="explore-occidente">
        <div className="explore-occidente-inner">
          <Skeleton height="2rem" width="50%" />
          <Skeleton height="200px" width="200px" borderRadius="12px" />
          <Skeleton height="1rem" />
          <Skeleton height="1rem" width="80%" />
        </div>
      </section>
    );
  }

  if (data?.isVisible === false) return null;
  if (!data && !imagen) return null;

  return (
    <section id="explore-occidente" className="explore-occidente section-reveal">
      <div className="explore-occidente-inner">

        <h2 className="explore-occidente-titulo">
          {data?.title || 'Explore Occidente'}
        </h2>

        {imagen && (
          <div className="explore-occidente-img-wrap">
            <img
              src={imagen.url}
              alt={imagen.alt || 'Explore Occidente'}
              className="explore-occidente-img"
            />
          </div>
        )}

        {data?.body && (
          <p className="explore-occidente-texto">{data.body}</p>
        )}

        {data?.ctaText && data?.ctaLink && (
          <a
            href={data.ctaLink}
            target="_blank"
            rel="noreferrer"
            className="btn-primary"
          >
            {data.ctaText}
          </a>
        )}

      </div>
    </section>
  );
}
