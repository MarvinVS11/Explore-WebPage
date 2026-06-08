import Navbar          from './components/Navbar';
import Hero            from './components/Hero';
import Nosotros        from './components/Nosotros';
import Galeria         from './components/Galeria';
import RedTurismo      from './components/RedTurismo';
import MapaTuristico   from './components/MapaTuristico';
import Contacto        from './components/Contacto';
import Footer          from './components/Footer';
import useSmoothScroll   from './hooks/useSmoothScroll';
import useScrollReveal  from './hooks/useScrollReveal';

export default function Home() {
  useSmoothScroll();
  useScrollReveal();

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Nosotros />
        <Galeria />
        <RedTurismo />
        <MapaTuristico />
        <Contacto />
      </main>
      <Footer />
    </>
  );
}