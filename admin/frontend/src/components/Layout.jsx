import { Outlet, NavLink, useNavigate } from 'react-router-dom';

export default function Layout() {
  const navigate = useNavigate();
  const email    = localStorage.getItem('admin_email') || 'Admin';

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_email');
    navigate('/login');
  };

  const navItems = [
    { to: '/sections',  label: '📝 Secciones' },
    { to: '/config',    label: '⚙️ Configuración' },
    { to: '/navlinks',  label: '🔗 Menú' },
    { to: '/reditems',  label: '🌿 Red de Turismo' },
  ];

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span>🌐</span>
          <span>Explore Admin</span>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
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

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
