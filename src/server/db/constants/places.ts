// From https://tabler-icons.io/
export const placeCategoriesIcons = [
  'beach',
  'flag',
  'scuba-mask',
  'trees',
  'building-castle',
  'tower',
  'fish-hook',
  'fountain',
  'mountain',
  'ripple',
  'parking',
  'history',
  'trekking',
  'walk',
  'oval-vertical',
  'sailboat',
  'home',
  'home-off',
  'building-store',
  'building-tunnel',
  'pennant',
  'icons',
  'map-pin-question',
  'charging-pile',
  'motorbike',
  'ladder',
] as const
export type PlaceCategoryIcon = (typeof placeCategoriesIcons)[number]

export const placeCategoriesColors = [
  'gray',
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
] as const
export type PlaceCategoryColor = (typeof placeCategoriesColors)[number]
