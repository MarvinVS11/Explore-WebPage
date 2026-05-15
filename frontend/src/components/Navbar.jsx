import React from 'react';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar__brand">Explore WebPage</div>
      <ul className="navbar__links">
        <li><a href="#hero">Inicio</a></li>
        <li><a href="#nosotros">Nosotros</a></li>
        <li><a href="#red-turismo">Red Turismo</a></li>
        <li><a href="#mapa-turistico">Mapa Turístico</a></li>
        <li><a href="#contacto">Contacto</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
