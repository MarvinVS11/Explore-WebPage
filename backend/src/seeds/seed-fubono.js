const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });
const connectDB  = require('../config/db');
const SiteConfig = require('../models/SiteConfig');
const Section    = require('../models/Section');
const NavLink    = require('../models/NavLink');
const RedItem    = require('../models/RedItem');

const SITE_ID = 'fubono';

const siteConfig = {
  key:             'main',
  siteId:          SITE_ID,
  siteName:        'Fundación Bosque Nuboso de Occidente',
  logoUrl:         '',
  faviconUrl:      '',
  videoUrl:        '',
  whatsappUrl:     '',
  facebookUrl:     '',
  instagramUrl:    '',
  footerCopyright: '© 2025 Fundación Bosque Nuboso de Occidente. Todos los derechos reservados.',
};

const sections = [
  {
    siteId:    SITE_ID,
    key:       'hero',
    title:     'Fubono',
    subtitle:  'Fundación Bosque Nuboso de Occidente',
    body:      'Conservamos el bosque nuboso de la región de Occidente de Costa Rica para las generaciones futuras.',
    ctaText:   'Conocer más',
    ctaLink:   '#nosotros',
    isVisible: true,
    extraData: {},
  },
  {
    siteId:    SITE_ID,
    key:       'galeria',
    title:     'Galería',
    subtitle:  '',
    body:      '',
    ctaText:   '',
    ctaLink:   '',
    isVisible: false,
    extraData: {},
  },
  {
    siteId:    SITE_ID,
    key:       'servicios',
    title:     'Nuestros Servicios',
    subtitle:  'Impulsamos el turismo sostenible con soluciones integrales para la región',
    body:      '',
    ctaText:   '',
    ctaLink:   '',
    isVisible: true,
    extraData: {
      asesorias_label: 'Asesorías y consultorías',
      asesorias_href:  '#contacto',
      marketing_label: 'Marketing turístico',
      marketing_href:  '#contacto',
      charlas_label:   'Charlas y conferencias',
      charlas_href:    '#contacto',
      cursos_label:    'Cursos formativos',
      cursos_href:     '#contacto',
    },
  },
  {
    siteId:    SITE_ID,
    key:       'nosotros',
    title:     'Quiénes somos',
    subtitle:  '',
    body:      'La Fundación Bosque Nuboso de Occidente (Fubono) trabaja por la conservación y el uso sostenible de los recursos naturales del bosque nuboso en la región de Occidente, Costa Rica.',
    ctaText:   '',
    ctaLink:   '',
    isVisible: true,
    extraData: {},
  },
  {
    siteId:    SITE_ID,
    key:       'red',
    title:     'Nuestra Red',
    subtitle:  '',
    body:      'Conoce los proyectos y aliados que forman parte de nuestra red de conservación y turismo sostenible.',
    ctaText:   '',
    ctaLink:   '',
    isVisible: true,
    extraData: {},
  },
  {
    siteId:    SITE_ID,
    key:       'mapa',
    title:     'Mapa de la región',
    subtitle:  '',
    body:      'Ubicación de nuestros proyectos y áreas de conservación en la región de Occidente.',
    ctaText:   '',
    ctaLink:   '',
    isVisible: true,
    extraData: { mapEmbedUrl: '' },
  },
  {
    siteId:    SITE_ID,
    key:       'contacto',
    title:     'Contáctenos',
    subtitle:  '',
    body:      'Escríbanos para conocer más sobre nuestros proyectos o cómo colaborar.',
    ctaText:   'Enviar mensaje',
    ctaLink:   '',
    isVisible: true,
    extraData: {
      direccion: 'San Ramón, Alajuela, Costa Rica',
      horario:   'Lunes a Viernes 8:00 am a 5:00 pm',
      telefono:  '',
      email:     '',
    },
  },
];

const navLinks = [
  { siteId: SITE_ID, label: 'Inicio',      href: '#inicio',      order: 1, isActive: true },
  { siteId: SITE_ID, label: 'Nosotros',    href: '#nosotros',    order: 2, isActive: true },
  { siteId: SITE_ID, label: 'Servicios',   href: '#servicios',   order: 3, isActive: true },
  { siteId: SITE_ID, label: 'Galería',     href: '#galeria',     order: 4, isActive: true },
  { siteId: SITE_ID, label: 'Nuestra Red', href: '#redturismo',  order: 5, isActive: true },
  { siteId: SITE_ID, label: 'Mapa',        href: '#turisteando', order: 6, isActive: true },
  { siteId: SITE_ID, label: 'Contacto',    href: '#contacto',    order: 7, isActive: true },
];

async function seedFubono() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI no está definida en el .env del backend');
    }

    console.log('🔌 Conectando a MongoDB...');
    await connectDB();
    console.log('✅ Conectado');

    // Borra solo datos de Fubono — Explore no se toca
    await Promise.all([
      SiteConfig.deleteMany({ siteId: SITE_ID }),
      Section.deleteMany({ siteId: SITE_ID }),
      NavLink.deleteMany({ siteId: SITE_ID }),
      RedItem.deleteMany({ siteId: SITE_ID }),
    ]);
    console.log('🗑  Datos Fubono anteriores eliminados');

    await SiteConfig.create(siteConfig);
    await Section.insertMany(sections);
    await NavLink.insertMany(navLinks);

    console.log('🌱 Seed Fubono completado:');
    console.log(`   • SiteConfig : 1`);
    console.log(`   • Sections   : ${sections.length} (hero, servicios, nosotros, red, galeria, mapa, contacto)`);
    console.log(`   • NavLinks   : ${navLinks.length} (Inicio, Nosotros, Servicios, Galería, Nuestra Red, Mapa, Contacto)`);
    console.log('');
    console.log('💡 Ahora ve al panel admin → "Fubono Admin" para personalizar el contenido.');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

seedFubono();
