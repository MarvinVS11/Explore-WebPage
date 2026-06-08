export default function Skeleton({ height = '1rem', width = '100%', borderRadius = '6px' }) {
  return (
    <div
      style={{
        height,
        width,
        borderRadius,
        background: 'linear-gradient(90deg, #e0e8e4 25%, #eef3f0 50%, #e0e8e4 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
      }}
    />
  );
}
