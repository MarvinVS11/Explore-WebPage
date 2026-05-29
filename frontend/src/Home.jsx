import Navbar        from './components/Navbar';
import Hero          from './components/Hero';
import Nosotros      from './components/Nosotros';
import RedTurismo    from './components/RedTurismo';
import MapaTuristico from './components/MapaTuristico';
import Contacto      from './components/Contacto';
import Footer        from './components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Nosotros />
        <RedTurismo />
        <MapaTuristico />
        <Contacto />
      </main>
      <Footer />
    </>
  );
}