const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });
const mongoose   = require('mongoose');
const SiteConfig = require('../models/SiteConfig');
const Section    = require('../models/Section');
const Image      = require('../models/Image');
const NavLink    = require('../models/NavLink');
const RedItem    = require('../models/RedItem');

// ─── Datos ────────────────────────────────────────────────────

const siteConfig = {
  key:             'main',
  siteName:        'Explore Occidente Costa Rica',
  logoUrl:         '/images/logo.png',
  faviconUrl:      '/images/favicon.ico',
  videoUrl:        '/video/video.mp4',
  whatsappUrl:     'https://wa.link/n15mpf',
  facebookUrl:     'https://www.facebook.com/Exploreoccidentecr',
  instagramUrl:    'https://www.instagram.com/exploreoccidentecr/',
  whatsappImgUrl:  'http://exploreoccidentecr.com/imagenes/redes/whatapp.png',
  facebookImgUrl:  'http://exploreoccidentecr.com/imagenes/redes/facebook.png',
  instagramImgUrl: 'http://exploreoccidentecr.com/imagenes/redes/instagram.png',
  footerCopyright: '© 2025 Explore Occidente Costa Rica. Todos los derechos reservados.',
};

const navLinks = [
  { label: 'Inicio',                    href: '#inicio',      order: 1, isActive: true },
  { label: 'Nosotros',                  href: '#nosotros',    order: 2, isActive: true },
  { label: 'Red de Turismo Sostenible', href: '#redturismo',  order: 3, isActive: true },
  { label: 'Mapa Turístico',            href: '#turisteando', order: 4, isActive: true },
  { label: 'Contacto',                  href: '#contacto',    order: 5, isActive: true },
];

const sections = [
  {
    key:       'hero',
    title:     'Explore Occidente Costa Rica',
    subtitle:  'Turismo Sostenible · San Ramón, Alajuela',
    body:      'Descubrí la magia de los bosques nubosos, cascadas y cultura local de la región de Occidente.',
    ctaText:   'Explorar actividades',
    ctaLink:   '#redturismo',
    isVisible: true,
    extraData: {},
  },
  {
    key:       'nosotros',
    title:     'Nosotros',
    subtitle:  '',
    body:      'Explore Occidente Costa Rica es una plataforma de la Fundación Bosque Nuboso de Occidente, que busca apoyar la consolidación de emprendimientos turísticos de la región de Occidente, a través del mercadeo digital, capacitación y operación turística.',
    ctaText:   'Visitar Fundación',
    ctaLink:   'http://bosquenuboso.org/',
    isVisible: true,
    extraData: {},
  },
  {
    key:       'red',
    title:     'Red de Turismo Sostenible',
    subtitle:  '',
    body:      'La Red de Turismo Sostenible es un conjunto de emprendimientos ecoturísticos que muestran la riqueza de la biodiversidad de la región de Occidente.',
    ctaText:   '',
    ctaLink:   '',
    isVisible: true,
    extraData: {},
  },
  {
    key:       'mapa',
    title:     'Mapa de la Red de Turismo Sostenible',
    subtitle:  '',
    body:      'El mapa contiene la ubicación de los sitios de hospedaje, tours, actividades y otros elementos complementarios de la actividad turística.',
    ctaText:   '',
    ctaLink:   '',
    isVisible: true,
    extraData: {
      mapEmbedUrl: 'https://www.google.com/maps/d/u/0/embed?mid=1E8wb0VlpUl18BVHpe1mrQafre1eXSZnB&ehbc=2E312F&z=11',
    },
  },
  {
    key:       'contacto',
    title:     'Contacto',
    subtitle:  '',
    body:      'Escríbanos qué actividades le gustaría hacer o en qué lugar le gustaría hospedarse.',
    ctaText:   'Enviar mensaje',
    ctaLink:   '',
    isVisible: true,
    extraData: {
      direccion: '300 mts Norte y 200 Oeste de Maxi Pali, San Ramón, Alajuela, Costa Rica',
      horario:   'Lunes a Domingo 8:00 am a 5:00 pm',
      telefono:  '+(506) 8313-6600',
      email:     'exploreoccidente@gmail.com',
    },
  },
];

const images = [
  {
    url:      '/images/hero-default.webp',
    section:  'hero',
    role:     'hero',
    alt:      'Bosque nuboso Occidente Costa Rica',
    linkUrl:  '',
    order:    1,
    isActive: true,
  },
  {
    url:      'http://exploreoccidentecr.com/imagenes/inicio/FUBONONEGRO.png',
    section:  'nosotros',
    role:     'logo',
    alt:      'Logo Fundación Bosque Nuboso de Occidente',
    linkUrl:  'http://bosquenuboso.org/',
    order:    1,
    isActive: true,
  },
  {
    url:      'http://exploreoccidentecr.com/imagenes/sliders/LOGO_ALARGADOv2.2.png',
    section:  'red',
    role:     'slider',
    alt:      'Logo Red de Turismo Sostenible',
    linkUrl:  '',
    order:    1,
    isActive: true,
  },
  {
    url:      'http://exploreoccidentecr.com/imagenes/sliders/Todos.png',
    section:  'red',
    role:     'galeria',
    alt:      'Actividades Red de Turismo Sostenible',
    linkUrl:  '',
    order:    2,
    isActive: true,
  },
  {
    url:      '/images/logo.png',
    section:  'footer',
    role:     'logo',
    alt:      'Logo Explore Occidente Costa Rica',
    linkUrl:  '',
    order:    1,
    isActive: true,
  },
];

const redItems = [
  { label: 'Hospedajes',               href: 'http://exploreoccidentecr.com/Cliente/Hospedaje',                    type: 'internal', iconUrl: '', order: 1, isActive: true },
  { label: 'Sitios de Recreación',     href: 'http://exploreoccidentecr.com/Cliente/ToursActivities',              type: 'internal', iconUrl: '', order: 2, isActive: true },
  { label: 'Observación de Aves',      href: 'http://exploreoccidentecr.com/imagenes/Docs/Observacion_Aves.pdf',   type: 'pdf',      iconUrl: '', order: 3, isActive: true },
  { label: 'Senderismo',               href: 'http://exploreoccidentecr.com/imagenes/Docs/Senderismo.pdf',         type: 'pdf',      iconUrl: '', order: 4, isActive: true },
  { label: 'Chapulitour',              href: 'http://exploreoccidentecr.com/Cliente/Chapulitour',                   type: 'internal', iconUrl: '', order: 5, isActive: true },
  { label: 'Restaurantes y miradores', href: 'http://exploreoccidentecr.com/Cliente/ElementosComplementarios',     type: 'internal', iconUrl: '', order: 6, isActive: true },
];

// ─── Runner ───────────────────────────────────────────────────

async function runSeed() {
  try {
    console.log('Conectando a MongoDB Atlas...');
    console.log('URI:', process.env.MONGO_URI ? '✅ Encontrada' : '❌ No encontrada — verificá el .env');

    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI no está definida. Verificá el archivo backend/.env');
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB Atlas');

    await Promise.all([
      SiteConfig.deleteMany({}),
      Section.deleteMany({}),
      Image.deleteMany({}),
      NavLink.deleteMany({}),
      RedItem.deleteMany({}),
    ]);
    console.log('🗑  Colecciones limpias');

    await SiteConfig.create(siteConfig);
    await Section.insertMany(sections);
    await Image.insertMany(images);
    await NavLink.insertMany(navLinks);
    await RedItem.insertMany(redItems);

    console.log('🌱 Seed completado:');
    console.log(`   • SiteConfig : 1 documento`);
    console.log(`   • Sections   : ${sections.length} documentos`);
    console.log(`   • Images     : ${images.length} documentos`);
    console.log(`   • NavLinks   : ${navLinks.length} documentos`);
    console.log(`   • RedItems   : ${redItems.length} documentos`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Error en seed:', err.message);
    process.exit(1);
  }
}

runSeed();