import useSection from '../hooks/useSection';
import Skeleton from './Skeleton';

export default function MapaTuristico() {
  const { data, loading } = useSection('mapa');

  if (loading) {
    return (
      <section id="turisteando" className="mapa">
        <div className="section-header">
          <Skeleton height="2rem" width="50%" />
          <Skeleton height="1rem" width="80%" />
        </div>
        <Skeleton height="440px" borderRadius="12px" />
      </section>
    );
  }

  const mapUrl = data?.extraData?.mapEmbedUrl;

  return (
    <section id="turisteando" className="mapa section-reveal">
      <div className="section-header">
        <h2>{data?.title}</h2>
        <p>{data?.body}</p>
      </div>

      {mapUrl && (
        <div className="mapa-embed">
          <iframe
            src={mapUrl}
            title="Mapa Turístico Fundación Bosque Nuboso de Occidente"
            allowFullScreen
            loading="lazy"
          />
        </div>
      )}
    </section>
  );
}
