/** Flag asset path for a driver nationality (same mapping as championship cards). */
export function getFlagForNationality(nationality: string): string {
  const flagMap: Record<string, string> = {
    Australia: '/assets/flags/flagAustralian.jpg',
    'Great Britain': '/assets/flags/flagBritish.jpg',
    'United Kingdom': '/assets/flags/flagBritish.jpg',
    Netherlands: '/assets/flags/flagDutch.jpg',
    Spain: '/assets/flags/flagSpanish.png',
    Monaco: '/assets/flags/flagMonaco.png',
    Canada: '/assets/flags/flagCanadian.jpg',
    Denmark: '/assets/flags/flagDanish.jpg',
    Japan: '/assets/flags/flagJapan.jpg',
    Thailand: '/assets/flags/flagThai.jpg',
    Germany: '/assets/flags/flagGerman.jpg',
    'New Zealand': '/assets/flags/flagAustralian.jpg',
    Argentina: '/assets/flags/flagSpanish.png',
    Finland: '/assets/flags/flagFinnish.jpg',
    China: '/assets/flags/flagChina.jpg',
    France: '/assets/flags/flagFrench.jpg',
    Mexico: '/assets/flags/flagMexican.jpg',
    'United States': '/assets/flags/flagAmerican.jpg',
    USA: '/assets/flags/flagAmerican.jpg',
    Austria: '/assets/flags/flagGerman.jpg',
  };

  return flagMap[nationality] || '/assets/flags/flagBritish.jpg';
}
