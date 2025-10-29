// Weapons data from Arc Raiders Wiki
// Source: https://arcraiders.wiki/wiki/Weapons

export const WEAPONS = [
  // Assault Rifles
  {
    id: 'kettle',
    name: 'Kettle',
    type: 'Assault Rifle',
    damage: 10,
    fireMode: 'Single',
    ammoType: 'Light Ammo',
    range: 42.8,
    image: 'https://arcraiders.wiki/wiki/Special:FilePath/Kettle.png'
  },
  {
    id: 'rattler',
    name: 'Rattler',
    type: 'Assault Rifle',
    damage: 9,
    fireMode: 'Auto',
    ammoType: 'Medium Ammo',
    range: 56.2,
    image: 'https://arcraiders.wiki/wiki/Special:FilePath/Rattler.png'
  },
  {
    id: 'arpeggio',
    name: 'Arpeggio',
    type: 'Assault Rifle',
    damage: 9.5,
    fireMode: 'Burst',
    ammoType: 'Medium Ammo',
    range: 55.9,
    image: 'https://arcraiders.wiki/wiki/Special:FilePath/Arpeggio.png'
  },
  {
    id: 'tempest',
    name: 'Tempest',
    type: 'Assault Rifle',
    damage: 10,
    fireMode: 'Auto',
    ammoType: 'Medium Ammo',
    range: 55.9,
    image: 'https://arcraiders.wiki/wiki/Special:FilePath/Tempest.png'
  },
  {
    id: 'bettina',
    name: 'Bettina',
    type: 'Assault Rifle',
    damage: 14,
    fireMode: 'Auto',
    ammoType: 'Heavy Ammo',
    range: 51.3,
    image: 'https://arcraiders.wiki/wiki/Special:FilePath/Bettina.png'
  },

  // Battle Rifles
  {
    id: 'ferro',
    name: 'Ferro',
    type: 'Battle Rifle',
    damage: 40,
    fireMode: 'Single',
    ammoType: 'Heavy Ammo',
    range: 53.1,
    image: 'https://arcraiders.wiki/wiki/Special:FilePath/Ferro.png'
  },
  {
    id: 'renegade',
    name: 'Renegade',
    type: 'Battle Rifle',
    damage: 35,
    fireMode: 'Single',
    ammoType: 'Medium Ammo',
    range: 68.8,
    image: 'https://arcraiders.wiki/wiki/Special:FilePath/Renegade.png'
  },

  // Submachine Guns
  {
    id: 'stitcher',
    name: 'Stitcher',
    type: 'Submachine Gun',
    damage: 7,
    fireMode: 'Auto',
    ammoType: 'Light Ammo',
    range: 42.1,
    image: 'https://arcraiders.wiki/wiki/Special:FilePath/Stitcher.png'
  },
  {
    id: 'bobcat',
    name: 'Bobcat',
    type: 'Submachine Gun',
    damage: 6,
    fireMode: 'Auto',
    ammoType: 'Light Ammo',
    range: 44,
    image: 'https://arcraiders.wiki/wiki/Special:FilePath/Bobcat.png'
  },

  // Shotguns
  {
    id: 'il_toro',
    name: 'Il Toro',
    type: 'Shotgun',
    damage: 67.5,
    fireMode: 'Single',
    ammoType: 'Shotgun Ammo',
    range: 20,
    image: 'https://arcraiders.wiki/wiki/Special:FilePath/Il_Toro.png'
  },
  {
    id: 'vulcano',
    name: 'Vulcano',
    type: 'Shotgun',
    damage: 49.5,
    fireMode: 'Single',
    ammoType: 'Shotgun Ammo',
    range: 26,
    image: 'https://arcraiders.wiki/wiki/Special:FilePath/Vulcano.png'
  },

  // Pistols
  {
    id: 'hairpin',
    name: 'Hairpin',
    type: 'Pistol',
    damage: 20,
    fireMode: 'Single',
    ammoType: 'Light Ammo',
    range: 38.6,
    image: 'https://arcraiders.wiki/wiki/Special:FilePath/Hairpin.png'
  },
  {
    id: 'burletta',
    name: 'Burletta',
    type: 'Pistol',
    damage: 10,
    fireMode: 'Single',
    ammoType: 'Light Ammo',
    range: 41.7,
    image: 'https://arcraiders.wiki/wiki/Special:FilePath/Burletta.png'
  },
  {
    id: 'anvil',
    name: 'Anvil',
    type: 'Pistol',
    damage: 40,
    fireMode: 'Single',
    ammoType: 'Heavy Ammo',
    range: 50.2,
    image: 'https://arcraiders.wiki/wiki/Special:FilePath/Anvil.png'
  },
  {
    id: 'venator',
    name: 'Venator',
    type: 'Pistol',
    damage: 18,
    fireMode: 'Single',
    ammoType: 'Medium Ammo',
    range: 48.4,
    image: 'https://arcraiders.wiki/wiki/Special:FilePath/Venator.png'
  },

  // Light Machine Guns
  {
    id: 'torrente',
    name: 'Torrente',
    type: 'Light Machine Gun',
    damage: 8,
    fireMode: 'Auto',
    ammoType: 'Medium Ammo',
    range: 49.9,
    image: 'https://arcraiders.wiki/wiki/Special:FilePath/Torrente.png'
  },

  // Sniper Rifles
  {
    id: 'osprey',
    name: 'Osprey',
    type: 'Sniper Rifle',
    damage: 45,
    fireMode: 'Single',
    ammoType: 'Medium Ammo',
    range: 80.3,
    image: 'https://arcraiders.wiki/wiki/Special:FilePath/Osprey.png'
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    type: 'Sniper Rifle',
    damage: 55,
    fireMode: 'Single',
    ammoType: 'Energy Clip',
    range: 71.7,
    image: 'https://arcraiders.wiki/wiki/Special:FilePath/Jupiter.png'
  },

  // Special
  {
    id: 'equalizer',
    name: 'Equalizer',
    type: 'Special',
    damage: 8,
    fireMode: 'Auto',
    ammoType: 'Energy Clip',
    range: 68.6,
    image: 'https://arcraiders.wiki/wiki/Special:FilePath/Equalizer.png'
  }
]

// Group weapons by type for easier organization
export const WEAPON_TYPES = [
  'Assault Rifle',
  'Battle Rifle',
  'Submachine Gun',
  'Shotgun',
  'Pistol',
  'Light Machine Gun',
  'Sniper Rifle',
  'Special'
]
