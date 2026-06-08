import { useState, useEffect } from 'react';
import { getSection, getImages } from '../api';

export default function useSection(key) {
  const [data,    setData]    = useState(null);
  const [images,  setImages]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([getSection(key), getImages(key)])
      .then(([section, imgs]) => { setData(section); setImages(imgs); })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [key]);

  return { data, images, loading, error };
}
