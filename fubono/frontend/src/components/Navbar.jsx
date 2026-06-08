import { useState, useEffect } from 'react';
import useSiteConfig from '../hooks/useSiteConfig';
import { getImageUrl } from '../api';

const FALLBACK_LINKS = [
  { _id: 'inicio',      label: 'Inicio',         href: '#inicio',      isActive: true, order: 1 },
  { _id: 'nosotros',    label: 'Nosotros',        href: '#nosotros',    isActive: true, order: 2 },
  { _id: 'redturismo',  label: 'Red de Turismo',  href: '#redturismo',  isActive: true, order: 3 },
  { _id: 'turisteando', label: 'Mapa Turístico',  href: '#turisteando', isActive: true, order: 4 },
  { _id: 'contacto',    label: 'Contacto',        href: '#contacto',    isActive: true, order: 5 },
];

export default function Navbar() {
  const { config, navLinks } = useSiteConfig();
  const [menuOpen, setMenuOpen]   = useState(false);
  const [scrolled, setScrolled]   = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const items = (navLinks?.length ? navLinks : FALLBACK_LINKS)
    .filter(l => l.isActive)
    .sort((a, b) => a.order - b.order);

  const navClass = `navbar${scrolled ? ' navbar--scrolled' : ''}`;

  return (
    <nav className={navClass}>
      <div className="navbar-inner">

        <a href="#inicio" className="navbar-logo">
          {config?.logoUrl
            ? <img src={getImageUrl(config.logoUrl)} alt={config?.siteName || 'Logo'} />
            : <span className="navbar-brand">{config?.siteName || 'Fundación Bosque Nuboso de Occidente'}</span>
          }
        </a>

        <ul className="navbar-links">
          {items.map((item) => (
            <li key={item._id || item.href}>
              <a href={item.href} onClick={() => setMenuOpen(false)}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          className="navbar-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
        >
          <span className={menuOpen ? 'bar open' : 'bar'} />
          <span className={menuOpen ? 'bar open' : 'bar'} />
          <span className={menuOpen ? 'bar open' : 'bar'} />
        </button>
      </div>

      <ul className={`navbar-mobile ${menuOpen ? 'active' : ''}`}>
        {items.map((item) => (
          <li key={item._id || item.href}>
            <a href={item.href} onClick={() => setMenuOpen(false)}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
