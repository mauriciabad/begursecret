import colors from 'tailwindcss/colors'
import { ColorName } from '~/server/db/constants/shared'

export const colorClasses = {
  bg: {
    gray: 'bg-gray-700',
    red: 'bg-red-500',
    orange: 'bg-orange-500',
    amber: 'bg-amber-500',
    yellow: 'bg-yellow-500',
    lime: 'bg-lime-500',
    green: 'bg-green-500',
    emerald: 'bg-emerald-500',
    teal: 'bg-teal-500',
    cyan: 'bg-cyan-500',
    sky: 'bg-sky-500',
    blue: 'bg-blue-500',
    indigo: 'bg-indigo-500',
    violet: 'bg-violet-500',
    purple: 'bg-purple-500',
    fuchsia: 'bg-fuchsia-500',
    pink: 'bg-pink-500',
    rose: 'bg-rose-500',
  },
  beforeBg: {
    gray: 'before:bg-gray-700',
    red: 'before:bg-red-500',
    orange: 'before:bg-orange-500',
    amber: 'before:bg-amber-500',
    yellow: 'before:bg-yellow-500',
    lime: 'before:bg-lime-500',
    green: 'before:bg-green-500',
    emerald: 'before:bg-emerald-500',
    teal: 'before:bg-teal-500',
    cyan: 'before:bg-cyan-500',
    sky: 'before:bg-sky-500',
    blue: 'before:bg-blue-500',
    indigo: 'before:bg-indigo-500',
    violet: 'before:bg-violet-500',
    purple: 'before:bg-purple-500',
    fuchsia: 'before:bg-fuchsia-500',
    pink: 'before:bg-pink-500',
    rose: 'before:bg-rose-500',
  },
  border: {
    gray: 'border-gray-800',
    red: 'border-red-800',
    orange: 'border-orange-800',
    amber: 'border-amber-800',
    yellow: 'border-yellow-800',
    lime: 'border-lime-800',
    green: 'border-green-800',
    emerald: 'border-emerald-800',
    teal: 'border-teal-800',
    cyan: 'border-cyan-800',
    sky: 'border-sky-800',
    blue: 'border-blue-800',
    indigo: 'border-indigo-800',
    violet: 'border-violet-800',
    purple: 'border-purple-800',
    fuchsia: 'border-fuchsia-800',
    pink: 'border-pink-800',
    rose: 'border-rose-800',
  },
  border600: {
    gray: 'border-gray-900',
    red: 'border-red-600',
    orange: 'border-orange-600',
    amber: 'border-amber-600',
    yellow: 'border-yellow-600',
    lime: 'border-lime-600',
    green: 'border-green-600',
    emerald: 'border-emerald-600',
    teal: 'border-teal-600',
    cyan: 'border-cyan-600',
    sky: 'border-sky-600',
    blue: 'border-blue-600',
    indigo: 'border-indigo-600',
    violet: 'border-violet-600',
    purple: 'border-purple-600',
    fuchsia: 'border-fuchsia-600',
    pink: 'border-pink-600',
    rose: 'border-rose-600',
  },
  stroke: {
    gray: 'stroke-gray-700',
    red: 'stroke-red-500',
    orange: 'stroke-orange-500',
    amber: 'stroke-amber-500',
    yellow: 'stroke-yellow-500',
    lime: 'stroke-lime-500',
    green: 'stroke-green-500',
    emerald: 'stroke-emerald-500',
    teal: 'stroke-teal-500',
    cyan: 'stroke-cyan-500',
    sky: 'stroke-sky-500',
    blue: 'stroke-blue-500',
    indigo: 'stroke-indigo-500',
    violet: 'stroke-violet-500',
    purple: 'stroke-purple-500',
    fuchsia: 'stroke-fuchsia-500',
    pink: 'stroke-pink-500',
    rose: 'stroke-rose-500',
  },
  stroke20: {
    gray: 'stroke-gray-500/20',
    red: 'stroke-red-500/20',
    orange: 'stroke-orange-500/20',
    amber: 'stroke-amber-500/20',
    yellow: 'stroke-yellow-500/20',
    lime: 'stroke-lime-500/20',
    green: 'stroke-green-500/20',
    emerald: 'stroke-emerald-500/20',
    teal: 'stroke-teal-500/20',
    cyan: 'stroke-cyan-500/20',
    sky: 'stroke-sky-500/20',
    blue: 'stroke-blue-500/20',
    indigo: 'stroke-indigo-500/20',
    violet: 'stroke-violet-500/20',
    purple: 'stroke-purple-500/20',
    fuchsia: 'stroke-fuchsia-500/20',
    pink: 'stroke-pink-500/20',
    rose: 'stroke-rose-500/20',
  },

  text: {
    gray: 'text-gray-700',
    red: 'text-red-500',
    orange: 'text-orange-500',
    amber: 'text-amber-500',
    yellow: 'text-yellow-500',
    lime: 'text-lime-500',
    green: 'text-green-500',
    emerald: 'text-emerald-500',
    teal: 'text-teal-500',
    cyan: 'text-cyan-500',
    sky: 'text-sky-500',
    blue: 'text-blue-500',
    indigo: 'text-indigo-500',
    violet: 'text-violet-500',
    purple: 'text-purple-500',
    fuchsia: 'text-fuchsia-500',
    pink: 'text-pink-500',
    rose: 'text-rose-500',
  },
  text600: {
    gray: 'text-gray-900',
    red: 'text-red-600',
    orange: 'text-orange-600',
    amber: 'text-amber-600',
    yellow: 'text-yellow-600',
    lime: 'text-lime-600',
    green: 'text-green-600',
    emerald: 'text-emerald-600',
    teal: 'text-teal-600',
    cyan: 'text-cyan-600',
    sky: 'text-sky-600',
    blue: 'text-blue-600',
    indigo: 'text-indigo-600',
    violet: 'text-violet-600',
    purple: 'text-purple-600',
    fuchsia: 'text-fuchsia-600',
    pink: 'text-pink-600',
    rose: 'text-rose-600',
  },

  shadow: {
    gray: 'shadow-gray-700/60',
    red: 'shadow-red-500/60',
    orange: 'shadow-orange-500/60',
    amber: 'shadow-amber-500/60',
    yellow: 'shadow-yellow-500/60',
    lime: 'shadow-lime-500/60',
    green: 'shadow-green-500/60',
    emerald: 'shadow-emerald-500/60',
    teal: 'shadow-teal-500/60',
    cyan: 'shadow-cyan-500/60',
    sky: 'shadow-sky-500/60',
    blue: 'shadow-blue-500/60',
    indigo: 'shadow-indigo-500/60',
    violet: 'shadow-violet-500/60',
    purple: 'shadow-purple-500/60',
    fuchsia: 'shadow-fuchsia-500/60',
    pink: 'shadow-pink-500/60',
    rose: 'shadow-rose-500/60',
  },
  gradientBg: {
    gray: 'from-gray-900 to-gray-700',
    red: 'from-red-600 to-red-500',
    orange: 'from-orange-600 to-orange-500',
    amber: 'from-amber-600 to-amber-500',
    yellow: 'from-yellow-600 to-yellow-500',
    lime: 'from-lime-600 to-lime-500',
    green: 'from-green-600 to-green-500',
    emerald: 'from-emerald-600 to-emerald-500',
    teal: 'from-teal-600 to-teal-500',
    cyan: 'from-cyan-600 to-cyan-500',
    sky: 'from-sky-600 to-sky-500',
    blue: 'from-blue-600 to-blue-500',
    indigo: 'from-indigo-600 to-indigo-500',
    violet: 'from-violet-600 to-violet-500',
    purple: 'from-purple-600 to-purple-500',
    fuchsia: 'from-fuchsia-600 to-fuchsia-500',
    pink: 'from-pink-600 to-pink-500',
    rose: 'from-rose-600 to-rose-500',
  },
} as const satisfies {
  [x: string]: Record<ColorName, string>
}

export const allColorClasses: readonly (typeof colorClasses)[keyof typeof colorClasses][ColorName][] =
  Object.values(colorClasses).map(Object.values).flat()

export const colorValues = {
  '600': {
    gray: colors.gray['900'],
    red: colors.red['600'],
    orange: colors.orange['600'],
    amber: colors.amber['600'],
    yellow: colors.yellow['600'],
    lime: colors.lime['600'],
    green: colors.green['600'],
    emerald: colors.emerald['600'],
    teal: colors.teal['600'],
    cyan: colors.cyan['600'],
    sky: colors.sky['600'],
    blue: colors.blue['600'],
    indigo: colors.indigo['600'],
    violet: colors.violet['600'],
    purple: colors.purple['600'],
    fuchsia: colors.fuchsia['600'],
    pink: colors.pink['600'],
    rose: colors.rose['600'],
  },
  '500': {
    gray: colors.gray['700'],
    red: colors.red['500'],
    orange: colors.orange['500'],
    amber: colors.amber['500'],
    yellow: colors.yellow['500'],
    lime: colors.lime['500'],
    green: colors.green['500'],
    emerald: colors.emerald['500'],
    teal: colors.teal['500'],
    cyan: colors.cyan['500'],
    sky: colors.sky['500'],
    blue: colors.blue['500'],
    indigo: colors.indigo['500'],
    violet: colors.violet['500'],
    purple: colors.purple['500'],
    fuchsia: colors.fuchsia['500'],
    pink: colors.pink['500'],
    rose: colors.rose['500'],
  },
  '800': {
    gray: colors.gray['800'],
    red: colors.red['800'],
    orange: colors.orange['800'],
    amber: colors.amber['800'],
    yellow: colors.yellow['800'],
    lime: colors.lime['800'],
    green: colors.green['800'],
    emerald: colors.emerald['800'],
    teal: colors.teal['800'],
    cyan: colors.cyan['800'],
    sky: colors.sky['800'],
    blue: colors.blue['800'],
    indigo: colors.indigo['800'],
    violet: colors.violet['800'],
    purple: colors.purple['800'],
    fuchsia: colors.fuchsia['800'],
    pink: colors.pink['800'],
    rose: colors.rose['800'],
  },
} as const satisfies {
  [x: string]: Record<ColorName, string>
}
