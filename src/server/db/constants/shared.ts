// From https://tabler-icons.io/
export const iconNames = [
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
  'map-pin-question',
  'charging-pile',
  'motorbike',
  'ladder',
  'scuba-diving',
  'building-bridge-2',
  'fall',
  'corner-right-down',
  'wash',
  'wall',
  'anchor',
  'pool',
  'palette',
  'camera',
  'paper-bag',
  'stretching-2',
  'square',
  'bus-stop',
  'info-circle',
  'route',
  'bus',
  'shoe',
  'kayak',
  'arrows-down-up',
  'swimming',
  'diamond',
  'chart-bubble',
  'arrow-fork',
  'map-pin',
] as const
export type IconName = (typeof iconNames)[number]

export const colorNames = [
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
export type ColorName = (typeof colorNames)[number]
