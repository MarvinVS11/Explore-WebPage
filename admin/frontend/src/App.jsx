import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage     from './pages/LoginPage';
import SectionsPage  from './pages/SectionsPage';
import ConfigPage    from './pages/ConfigPage';
import NavLinksPage  from './pages/NavLinksPage';
import RedItemsPage  from './pages/RedItemsPage';
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
          <Route path="reditems" element={<RedItemsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
