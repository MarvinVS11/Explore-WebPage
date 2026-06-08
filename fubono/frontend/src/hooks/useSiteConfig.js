import { useState, useEffect } from 'react';
import { getSiteConfig, getNavLinks, getRedItems } from '../api';

export default function useSiteConfig() {
  const [config,   setConfig]   = useState(null);
  const [navLinks, setNavLinks] = useState([]);
  const [redItems, setRedItems] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    Promise.all([getSiteConfig(), getNavLinks(), getRedItems()])
      .then(([cfg, links, items]) => {
        setConfig(cfg);
        setNavLinks(links);
        setRedItems(items);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { config, navLinks, redItems, loading };
}
