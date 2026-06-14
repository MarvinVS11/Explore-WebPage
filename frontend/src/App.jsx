import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import HospedajesPage from './pages/HospedajesPage';
import SitiosRecreacionPage from './pages/SitiosRecreacionPage';

export default function App() {
  return (
    <Routes>
      <Route path="/"                  element={<Home />} />
      <Route path="/hospedajes"        element={<HospedajesPage />} />
      <Route path="/sitios-recreacion" element={<SitiosRecreacionPage />} />
    </Routes>
  );
}
