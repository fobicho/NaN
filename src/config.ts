export const SITE = {
  name: 'NaN',
  title: 'NaN',
  description:
    'Páginas web y herramientas a medida para resolver necesidades concretas.',
  url: 'https://fobicho.tech',
  locale: 'es_ES',
  logo: '/nan-wordmark.png',
  symbol: '/nan-symbol-mark.png',
  email: 'fobichin@gmail.com',
};

export const GITHUB_USER = 'fobicho';

/** Numero de WhatsApp con clave de pais y solo digitos, sin + ni espacios. */
export const WHATSAPP = '56952985729';

/** Repos que aparecen primero, en este orden, y con tarjeta destacada. */
export const PINNED: string[] = ['Cytlex'];

/** Identidades originales de proyectos disponibles en este equipo. */
export const PROJECT_MEDIA: Record<string, string> = {
  Cytlex: '/projects/cytlex.svg',
  fiNaNce: '/nan-symbol-mark.png',
};

/** Repos que no se muestran en el portafolio. */
export const HIDDEN: string[] = ['L0V3'];

export const SOCIAL = [
  { label: 'GitHub', href: `https://github.com/${GITHUB_USER}`, icon: true },
];

/** Cargo usado en los metadatos estructurados del sitio. */
export const ROLE = 'Ingeniero en Tecnologías de la Información';
