import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage     from './pages/LoginPage';
import SectionsPage  from './pages/SectionsPage';
import ConfigPage    from './pages/ConfigPage';
import NavLinksPage  from './pages/NavLinksPage';
import RedItemsPage  from './pages/RedItemsPage';
import ProyectosPage   from './pages/ProyectosPage';
import HospedajesPage       from './pages/HospedajesPage';
import SitiosRecreacionPage from './pages/SitiosRecreacionPage';
import DocumentosPage             from './pages/DocumentosPage';
import RestaurantesMiradoresPage  from './pages/RestaurantesMiradoresPage';
import ImagesPage    from './pages/ImagesPage';
import Layout        from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/sections" replace />} />
          <Route path="sections" element={<SectionsPage />} />
          <Route path="config"   element={<ConfigPage />} />
          <Route path="navlinks" element={<NavLinksPage />} />
          <Route path="reditems"  element={<RedItemsPage />} />
          <Route path="proyectos" element={<ProyectosPage />} />
          <Route path="images"      element={<ImagesPage />} />
          <Route path="hospedajes"         element={<HospedajesPage />} />
          <Route path="sitios-recreacion" element={<SitiosRecreacionPage />} />
          <Route path="documentos"             element={<DocumentosPage />} />
          <Route path="restaurantes-miradores" element={<RestaurantesMiradoresPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
