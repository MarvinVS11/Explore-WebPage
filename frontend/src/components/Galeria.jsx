import { useState, useEffect, useCallback } from 'react';
import { getSection, getImages } from '../api';
import Skeleton from './Skeleton';

export default function Galeria() {
  const [data,    setData]    = useState(null);
  const [images,  setImages]  = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getSection('galeria'), getImages('galeria')])
      .then(([section, imgs]) => {
        setData(section);
        setImages(imgs.filter(img => img.isActive !== false));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const prev = useCallback(() =>
    setCurrent(c => (c - 1 + images.length) % images.length),
  [images.length]);

  const next = useCallback(() =>
    setCurrent(c => (c + 1) % images.length),
  [images.length]);

  if (loading) {
    return (
      <section id="galeria" className="galeria section-reveal">
        <div className="section-header galeria-header">
          <Skeleton height="2rem" width="40%" />
          <Skeleton height="1rem" width="60%" />
        </div>
        <Skeleton height="420px" borderRadius="16px" />
      </section>
    );
  }

  if (!data?.isVisible || images.length === 0) {
    return <section id="galeria" aria-hidden="true" style={{ padding: 0, margin: 0 }} />;
  }

  return (
    <section id="galeria" className="galeria section-reveal">
      <div className="section-header galeria-header">
        <h2>{data.title}</h2>
        {data.body && <p>{data.body}</p>}
      </div>

      <div className="galeria-carousel">
        {images.length > 1 && (
          <button
            className="carousel-btn carousel-btn--prev"
            onClick={prev}
            aria-label="Imagen anterior"
          >
            ‹
          </button>
        )}

        <div className="carousel-track">
          {images.map((img, i) => (
            <div
              key={img._id}
              className={'carousel-slide' + (i === current ? ' active' : '')}
              aria-hidden={i !== current}
            >
              <img src={img.url} alt={img.alt || ''} loading="lazy" />
              {img.alt && <p className="carousel-caption">{img.alt}</p>}
            </div>
          ))}
        </div>

        {images.length > 1 && (
          <button
            className="carousel-btn carousel-btn--next"
            onClick={next}
            aria-label="Imagen siguiente"
          >
            ›
          </button>
        )}
      </div>

      {images.length > 1 && (
        <div className="carousel-dots">
          {images.map((_, i) => (
            <button
              key={i}
              className={'carousel-dot' + (i === current ? ' active' : '')}
              onClick={() => setCurrent(i)}
              aria-label={`Ver imagen ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
