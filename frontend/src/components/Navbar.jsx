import { useState } from 'react';
import useSiteConfig from '../hooks/useSiteConfig';
import { getImageUrl } from '../api';

export default function Navbar() {
  const { config } = useSiteConfig();
  const [menuOpen, setMenuOpen] = useState(false);

  const menuItems = [
    { label: 'Inicio', href: '#inicio' },
    { label: 'Nosotros', href: '#nosotros' },
    { label: 'Red de Turismo', href: '#redturismo' },
    { label: 'Mapa Turístico', href: '#turisteando' },
    { label: 'Contacto', href: '#contacto' },
  ];

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
          {menuItems.map((item) => (
            <li key={item.href}>
              <a href={item.href} onClick={() => setMenuOpen(false)}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Botón hamburguesa — solo móvil */}
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

      {/* Menú móvil desplegable */}
      <ul className={`navbar-mobile ${menuOpen ? 'active' : ''}`}>
        {menuItems.map((item) => (
          <li key={item.href}>
            <a href={item.href} onClick={() => setMenuOpen(false)}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}