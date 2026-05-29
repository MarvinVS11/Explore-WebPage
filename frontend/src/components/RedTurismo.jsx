import useSection from '../hooks/useSection';
import useSiteConfig from '../hooks/useSiteConfig';
import Skeleton from './Skeleton';

export default function RedTurismo() {
  const { data, loading } = useSection('red');
  const { redItems, loading: loadingItems } = useSiteConfig();

  if (loading || loadingItems) {
    return (
      <section id="redturismo" className="red-turismo">
        <div className="section-header">
          <Skeleton height="1rem" width="150px" />
          <Skeleton height="2rem" width="60%" />
        </div>
        <div className="red-grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} height="52px" borderRadius="50px" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="redturismo" className="red-turismo">
      <div className="section-header">
        <span className="section-label">Red de Turismo Sostenible</span>
        <h2>{data?.title}</h2>
        <p>{data?.body}</p>
      </div>

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