import Navbar           from './components/Navbar';
import Hero             from './components/Hero';
import Nosotros         from './components/Nosotros';
import Servicios        from './components/Servicios';
import Galeria          from './components/Galeria';
import Proyectos        from './components/Proyectos';
import ExploreOccidente from './components/ExploreOccidente';
import MapaTuristico    from './components/MapaTuristico';
import Contacto         from './components/Contacto';
import Footer           from './components/Footer';
import useSmoothScroll  from './hooks/useSmoothScroll';
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
        <Servicios />
        <Galeria />
        <Proyectos />
        <ExploreOccidente />
        <MapaTuristico />
        <Contacto />
      </main>
      <Footer />
    </>
  );
}
