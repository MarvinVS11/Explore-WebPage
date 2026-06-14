import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useSite, SITES } from '../context/SiteContext.jsx';

export default function Layout() {
  const navigate  = useNavigate();
  const email     = localStorage.getItem('admin_email') || 'Admin';
  const [open, setOpen]         = useState(false);
  const [siteOpen, setSiteOpen] = useState(false);
  const { siteId, currentSite, switchSite } = useSite();

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_email');
    navigate('/login');
  };

  const navItems = [
    { to: '/sections', label: '📝 Secciones' },
    { to: '/images',   label: '🖼️ Imágenes' },
    { to: '/config',   label: '⚙️ Configuración' },
    { to: '/navlinks',  label: '🔗 Menú' },
    { to: '/proyectos',  label: '📋 Proyectos' },
    { to: '/hospedajes',         label: '🏡 Hospedajes' },
    { to: '/sitios-recreacion',  label: '🌳 Sitios de Recreación' },
    { to: '/documentos',             label: '📄 Documentos' },
    { to: '/restaurantes-miradores', label: '🍽️ Restaurantes y Miradores' },
    { to: '/reditems',               label: '🌿 Red de Turismo' },
  ];

  return (
    <div className="admin-layout">

      {/* ── Topbar — solo visible en móvil ──────────── */}
      <header className="admin-topbar">
        <button
          className="admin-hamburger"
          onClick={() => setOpen(o => !o)}
          aria-label="Abrir menú"
        >
          <span /><span /><span />
        </button>
        <span className="admin-topbar-title">
          {currentSite.icon} {currentSite.label}
        </span>
      </header>

      {open && (
        <div className="sidebar-overlay" onClick={() => setOpen(false)} />
      )}

      {/* ── Sidebar ──────────────────────────────────── */}
      <aside className={`sidebar${open ? ' sidebar--open' : ''}`}>

        {/* Selector de sitio */}
        <div
          className="site-switcher"
          onClick={() => setSiteOpen(o => !o)}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && setSiteOpen(o => !o)}
        >
          <span>{currentSite.icon} {currentSite.label}</span>
          <span className={`site-switcher-arrow${siteOpen ? ' open' : ''}`}>▾</span>
        </div>

        {siteOpen && (
          <div className="site-dropdown">
            {SITES.map(site => (
              <button
                key={site.id}
                className={'site-option' + (site.id === siteId ? ' active' : '')}
                onClick={() => {
                  switchSite(site.id);
                  setSiteOpen(false);
                  setOpen(false);
                }}
              >
                <span className="site-option-icon">{site.icon}</span>
                <span>{site.label}</span>
                {site.id === siteId && <span className="site-option-check">✓</span>}
              </button>
            ))}
          </div>
        )}

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                'sidebar-link' + (isActive ? ' active' : '')
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <span className="sidebar-email">{email}</span>
          <button className="btn-logout" onClick={logout}>Salir</button>
        </div>
      </aside>

      {/* key={siteId} fuerza remount de todas las páginas al cambiar de sitio */}
      <main className="admin-content">
        <Outlet key={siteId} />
      </main>

    </div>
  );
}
