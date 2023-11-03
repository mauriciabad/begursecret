// Don't reorder these values, they are used to generate the database enum.
export const amountOfPeople = [
  'none',
  'few',
  'some',
  'many',
  'crowded',
] as const
export type AmountOfPeople = keyof typeof amountOfPeople

// Don't reorder these values, they are used to generate the database enum.
export const difficulty = [
  'accessible',
  'normal',
  'smallEffort',
  'hard',
  'dangerous',
] as const
export type Difficulty = keyof typeof difficulty

// Don't reorder these values, they are used to generate the database enum.
export const groundType = ['sand', 'pebbles', 'rocks', 'concrete'] as const
export type GroundType = keyof typeof groundType
