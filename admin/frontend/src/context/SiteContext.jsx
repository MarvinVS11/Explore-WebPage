import { createContext, useContext, useState } from 'react';

export const SITES = [
  { id: 'explore', label: 'Explore Occidente', icon: '🌐' },
  { id: 'fubono',  label: 'Fubono Admin',      icon: '🌿' },
];

const SiteContext = createContext(null);

export function SiteProvider({ children }) {
  const [siteId, setSiteId] = useState(
    () => localStorage.getItem('admin_site') || 'explore'
  );

  const switchSite = (id) => {
    localStorage.setItem('admin_site', id);
    setSiteId(id);
  };

  const currentSite = SITES.find(s => s.id === siteId) || SITES[0];

  return (
    <SiteContext.Provider value={{ siteId, switchSite, currentSite, SITES }}>
      {children}
    </SiteContext.Provider>
  );
}

export const useSite = () => useContext(SiteContext);
