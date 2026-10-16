const BASE = 'https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P'

export const ASSETS = {
  MARS_BG: `${BASE}/3c83091e-4046-4fd6-adbb-2edb728be79a.mp4`,
  TO_EARTH: `${BASE}/fc3ded42-e845-41f3-a830-5cab512d79cd.mp4`,
  TO_VENUS: `${BASE}/b30f64d9-1637-477a-83df-d0fc6461a422.mp4`,
  TO_MARS: `${BASE}/5fc5651c-3b5d-4171-b507-87f7e635d1b4.mp4`,
  MERCURY: `${BASE}/d6fb8b6b-c15e-4aaa-9cf7-45bbb5e33372.jpg`,
  LOGO: `${BASE}/eb7e0f53-50cd-4af5-abc4-8b9a52cdc01b.svg`,
}

export const planets = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune']

export const states = {
  mars: {
    name: 'Mars',
    next: 'Earth',
    number: '[03]',
    portal: ASSETS.TO_EARTH,
    background: 'mars-background',
    facts: [
      ['Distance:', 'About 228 million km (1.5 astronomical units).'],
      ['Year:', 'One Martian year is equal to 687 Earth days.'],
      ['Temperature:', 'Around -60 °C, dropping to -125 °C at the poles in winter.'],
      ['Atmosphere:', 'Very thin, consisting of 95% carbon dioxide, with frequent dust storms.'],
    ],
  },
  earth: {
    name: 'Earth',
    next: 'Venus',
    number: '[02]',
    portal: ASSETS.TO_VENUS,
    background: 'earth-background',
    facts: [
      ['Distance:', '149.6 million km from the Sun.'],
      ['Year:', '365.25 Earth days.'],
      ['Temperature:', 'Average surface temperature around 15 °C.'],
      ['Atmosphere:', 'Mostly nitrogen and oxygen, supporting life and liquid water.'],
    ],
  },
  venus: {
    name: 'Venus',
    next: 'Mercury',
    number: '[06]',
    image: ASSETS.MERCURY,
    background: 'venus-background',
    facts: [
      ['Distance:', '108.2 million km from the Sun.'],
      ['Year:', '225 Earth days.'],
      ['Temperature:', 'Around 465 °C — the hottest planet in the Solar System.'],
      ['Atmosphere:', 'Extremely dense, mostly carbon dioxide, with clouds of sulfuric acid.'],
    ],
  },
}
