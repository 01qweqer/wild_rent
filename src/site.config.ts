// Shop contacts and global settings.

export const SITE = {
  name: 'Wild Rent',
  tagline: 'Прокат туристического и рыболовного снаряжения',
  description:
    'Аренда палаток, спальников, туристической мебели и рыболовного снаряжения. Смотрите фото, выбирайте и бронируйте через WhatsApp.',

  // WhatsApp number in international format, digits only (no "+", spaces or dashes).
  whatsapp: '77007577315',

  // Phone shown on the site as text.
  phone: '+7 700 757 73 15',

  city: 'Астана',
  address: 'Адрес уточняйте в WhatsApp',
  // Working hours, e.g. 'Ежедневно, 10:00–20:00'. Leave empty ('') to hide.
  hours: 'Ежедневно, 9:00–20:00',

  // Leave empty ('') to hide the link.
  instagram: '',

  // Logo file in the public/ folder. Replace public/logo.svg with the real logo
  // (or put logo.png there and change this to 'logo.png').
  logo: 'logo.svg',

  currency: '₸',
  priceUnit: 'сутки',
} as const;
