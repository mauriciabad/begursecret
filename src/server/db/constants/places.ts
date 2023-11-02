export const placeCategories = [
  'beach',
  'cove',
  'viewpoint',
  'historic',
  'park',
  'table',
  'coast',
  'coast-rocks',
  'coast-sand',
  'coast-pebbles',
  'coast-concrete',
  'coast-no-walking-access',
] as const
export type PlaceCategory = keyof typeof placeCategories

// From https://tabler-icons.io/
export const placeCategoriesIcons = [
  'beach',
  'flag',
  'scuba-mask',
  'trees',
  'building-castle',
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
