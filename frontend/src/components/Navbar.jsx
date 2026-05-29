import { useState } from 'react';
import useSiteConfig from '../hooks/useSiteConfig';
import { getImageUrl } from '../api';

export default function Navbar() {
  const { config, navLinks, loading } = useSiteConfig();
  const [menuOpen, setMenuOpen] = useState(false);

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
          {loading
            ? [1,2,3,4,5].map(i => <li key={i}><div className="nav-skeleton" /></li>)
            : navLinks.map(link => (
                <li key={link._id}>
                  <a href={link.href} onClick={() => setMenuOpen(false)}>
                    {link.label}
                  </a>
                </li>
              ))
          }
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
        {navLinks.map(link => (
          <li key={link._id}>
            <a href={link.href} onClick={() => setMenuOpen(false)}>
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}