import React from 'react';

const DinamicImage = ({ src, alt, className }) => {
  return <img src={src} alt={alt || 'Imagen'} className={className} />;
};

export default DinamicImage;
