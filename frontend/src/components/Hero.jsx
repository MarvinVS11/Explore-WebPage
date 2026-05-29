import useSection from '../hooks/useSection';
import useSiteConfig from '../hooks/useSiteConfig';
import { getImageUrl } from '../api';
import Skeleton from './Skeleton';

export default function Hero() {
  const { data, images, loading } = useSection('hero');
  const { config } = useSiteConfig();

  const heroImg = images[0]?.url
    ? getImageUrl(images[0].url)
    : '/images/hero-default.webp';

  if (loading) {
    return (
      <section className="hero hero-skeleton">
        <div className="hero-content">
          <Skeleton height="1rem" width="200px" />
          <Skeleton height="3rem" width="90%" borderRadius="8px" />
          <Skeleton height="1rem" width="80%" />
          <Skeleton height="1rem" width="60%" />
          <Skeleton height="2.5rem" width="160px" borderRadius="50px" />
        </div>
      </section>
    );
  }

  return (
    <section
      id="inicio"
      className="hero"
      style={{
        backgroundImage: config?.videoUrl
          ? 'none'
          : `url(${heroImg})`,
      }}
    >
      {/* Video de fondo si existe */}
      {config?.videoUrl && (
        <video
          className="hero-video"
          src={config.videoUrl}
          autoPlay
          muted
          loop
          playsInline
        />
      )}

      <div className="hero-overlay" />

      <div className="hero-content">
        {data?.subtitle && (
          <span className="hero-badge">{data.subtitle}</span>
        )}
        <h1>{data?.title}</h1>
        <p>{data?.body}</p>
        {data?.ctaText && (
          <a href={data.ctaLink || '#red'} className="btn-primary">
            {data.ctaText}
          </a>
        )}
      </div>
    </section>
  );
}