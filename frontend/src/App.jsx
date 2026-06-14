import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import HospedajesPage from './pages/HospedajesPage';
import SitiosRecreacionPage from './pages/SitiosRecreacionPage';
import DocumentosPage from './pages/DocumentosPage';

export default function App() {
  return (
    <Routes>
      <Route path="/"                  element={<Home />} />
      <Route path="/hospedajes"        element={<HospedajesPage />} />
      <Route path="/sitios-recreacion" element={<SitiosRecreacionPage />} />
      <Route path="/documentos"        element={<DocumentosPage />} />
    </Routes>
  );
}
