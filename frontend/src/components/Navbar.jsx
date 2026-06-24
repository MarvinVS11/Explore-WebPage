import { useState } from 'react';
import useSiteConfig from '../hooks/useSiteConfig';
import { getImageUrl } from '../api';

const FALLBACK_LINKS = [
  { _id: 'inicio',      label: 'Inicio',                    href: '#inicio',      isActive: true, order: 1 },
  { _id: 'nosotros',    label: 'Nosotros',                  href: '#nosotros',    isActive: true, order: 2 },
  { _id: 'redturismo',  label: 'Red de Turismo',            href: '#redturismo',  isActive: true, order: 3 },
  { _id: 'turisteando', label: 'Mapa Turístico',            href: '#turisteando', isActive: true, order: 4 },
  { _id: 'contacto',    label: 'Contacto',                  href: '#contacto',    isActive: true, order: 5 },
];

export default function Navbar() {
  const { config, navLinks } = useSiteConfig();
  const [menuOpen, setMenuOpen] = useState(false);
  const [closing, setClosing]   = useState(false);

  const items = (navLinks?.length ? navLinks : FALLBACK_LINKS)
    .filter(l => l.isActive)
    .sort((a, b) => a.order - b.order);

  // Duración total del cierre: último ítem sale primero (0 ms),
  // primer ítem sale al final  → (n-1)*60 ms + 320 ms animación
  const closeMs = (items.length - 1) * 60 + 360;

  const openMenu = () => { setClosing(false); setMenuOpen(true); };

  const closeMenu = () => {
    if (!menuOpen || closing) return;
    setClosing(true);
    setTimeout(() => { setMenuOpen(false); setClosing(false); }, closeMs);
  };

  const toggleMenu = () => (menuOpen ? closeMenu() : openMenu());

  return (
    <nav className="navbar">
      <div className="navbar-inner">

        {/* Logo */}
        <a href="#inicio" className="navbar-logo">
          {config?.logoUrl
            ? <img src={getImageUrl(config.logoUrl)} alt={config?.siteName || 'Logo'} />
            : <span className="navbar-brand">{config?.siteName || 'Explore Occidente CR'}</span>
          }
        </a>

        {/* Links escritorio */}
        <ul className="navbar-links">
          {items.map((item) => (
            <li key={item._id || item.href}>
              <a href={item.href} onClick={closeMenu}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Botón hamburguesa — solo móvil */}
        <button
          className="navbar-hamburger"
          onClick={toggleMenu}
          aria-label="Abrir menú"
        >
          <span className={menuOpen ? 'bar open' : 'bar'} />
          <span className={menuOpen ? 'bar open' : 'bar'} />
          <span className={menuOpen ? 'bar open' : 'bar'} />
        </button>
      </div>

      {/* Menú móvil desplegable */}
      <ul
        className={`navbar-mobile ${menuOpen ? 'active' : ''} ${closing ? 'closing' : ''}`}
        style={{ '--total': items.length }}
      >
        {items.map((item, i) => (
          <li key={item._id || item.href} style={{ '--i': i }}>
            <a href={item.href} onClick={closeMenu}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
