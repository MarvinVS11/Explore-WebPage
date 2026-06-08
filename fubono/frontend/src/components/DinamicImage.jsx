import { getImageUrl } from '../api';

export default function DynamicImage({
  src,
  alt       = '',
  fallback  = '/images/placeholder.webp',
  className = '',
  style     = {},
}) {
  return (
    <img
      src={src ? getImageUrl(src) : fallback}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={className}
      style={style}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = fallback;
      }}
    />
  );
}
