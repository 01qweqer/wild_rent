// Shop contacts and global settings.

export const SITE = {
  name: 'Wild Rent',
  tagline: 'Прокат снаряжения для отдыха, туризма и рыбалки',
  description:
    'Прокат в Астане: палатки, шатры и надувные юрты, лодки и сапы, зимние палатки и ледобуры, мебель, казаны и самовары. Цены за сутки, бронь через WhatsApp.',

  // WhatsApp number in international format, digits only (no "+", spaces or dashes).
  whatsapp: '77007577315',

  // Phone shown on the site as text.
  phone: '+7 700 757 73 15',

  city: 'Астана',
  address: 'ул. Бурабай, 27А',
  // Link opened when the address is tapped. Leave empty ('') to show the address as plain text.
  mapUrl: 'https://2gis.kz/astana/search/%D0%91%D1%83%D1%80%D0%B0%D0%B1%D0%B0%D0%B9%2027%D0%90',
  // Working hours, e.g. 'Ежедневно, 10:00–20:00'. Leave empty ('') to hide.
  hours: 'Ежедневно, 9:00–20:00',

  // Social links. Leave empty ('') to hide.
  instagram: 'https://www.instagram.com/astana_rent_with_baga_',
  tiktok: 'https://www.tiktok.com/@astana_rent_with_baga_',

  // Round logo in the public/ folder.
  logo: 'logo.png',

  currency: '₸',
  priceUnit: 'сутки',
} as const;
