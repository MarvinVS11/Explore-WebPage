import React from 'react';

const Skeleton = ({ width = '100%', height = '1rem' }) => {
  return (
    <div className="skeleton" style={{ width, height, backgroundColor: '#e0e0e0', borderRadius: '4px' }} />
  );
};

export default Skeleton;
