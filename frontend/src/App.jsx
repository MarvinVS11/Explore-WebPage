import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import HospedajesPage from './pages/HospedajesPage';

export default function App() {
  return (
    <Routes>
      <Route path="/"            element={<Home />} />
      <Route path="/hospedajes"  element={<HospedajesPage />} />
    </Routes>
  );
}
