import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';

export default function Layout() {
  const navigate       = useNavigate();
  const email          = localStorage.getItem('admin_email') || 'Admin';
  const [open, setOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_email');
    navigate('/login');
  };

  const navItems = [
    { to: '/sections', label: '📝 Secciones' },
    { to: '/images',   label: '🖼️ Imágenes' },
    { to: '/config',   label: '⚙️ Configuración' },
    { to: '/navlinks', label: '🔗 Menú' },
    { to: '/reditems', label: '🌿 Red de Turismo' },
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
        <span className="admin-topbar-title">Explore Admin</span>
      </header>

      {/* ── Overlay para cerrar el sidebar ──────────── */}
      {open && (
        <div className="sidebar-overlay" onClick={() => setOpen(false)} />
      )}

      {/* ── Sidebar ──────────────────────────────────── */}
      <aside className={`sidebar${open ? ' sidebar--open' : ''}`}>
        <div className="sidebar-brand">
          <span>🌐</span>
          <span>Explore Admin</span>
        </div>
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

      {/* ── Contenido principal ───────────────────────── */}
      <main className="admin-content">
        <Outlet />
      </main>

    </div>
  );
}
