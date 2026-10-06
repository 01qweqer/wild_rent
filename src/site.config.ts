// Shop contacts and global settings.
// Values marked TODO are placeholders — replace them with the real ones.

export const SITE = {
  name: 'Wild Rent',
  tagline: 'Прокат туристического и рыболовного снаряжения',
  description:
    'Аренда палаток, спальников, туристической мебели и рыболовного снаряжения. Смотрите фото, выбирайте и бронируйте через WhatsApp.',

  // WhatsApp number in international format, digits only (no "+", spaces or dashes).
  // TODO: replace with the real number.
  whatsapp: '77000000000',

  // Phone shown on the site as text. TODO: replace.
  phone: '+7 700 000 00 00',

  // TODO: replace with the real city / address / working hours.
  city: 'Алматы',
  address: 'Адрес уточняйте в WhatsApp',
  hours: 'Ежедневно, 10:00–20:00',

  // Leave empty ('') to hide the link.
  instagram: '',

  // Logo file in the public/ folder. Replace public/logo.svg with the real logo
  // (or put logo.png there and change this to 'logo.png').
  logo: 'logo.svg',

  currency: '₸',
  priceUnit: 'сутки',
} as const;
