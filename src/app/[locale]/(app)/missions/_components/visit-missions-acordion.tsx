'use client'

import { Accordion, AccordionItem } from '@nextui-org/accordion'
import { CircularProgress } from '@nextui-org/progress'
import { FC } from 'react'
import { PlaceCategoryIcon } from '~/components/icons/place-category-icon'
import { cn } from '~/helpers/cn'
import {
  PlaceCategoryColor,
  PlaceCategoryIcon as PlaceCategoryIconType,
} from '~/server/db/constants/places'

export const VisitMissionsAcordion: FC<{
  categories: {
    id: number
    namePlural: string
    icon: PlaceCategoryIconType | null
    color: PlaceCategoryColor
  }[]
}> = ({ categories }) => {
  return (
    <Accordion variant="splitted" fullWidth className="p-0">
      {categories.map((category) => (
        <AccordionItem
          key={category.id}
          title={category.namePlural}
          classNames={{
            base: '!pl-2 !pr-4 !shadow-small',
            trigger: 'py-2',
            content: 'pl-2 pr-0',
            title: 'text-gray-700 font-title text-lg font-semibold',
          }}
          startContent={
            <PlaceCategoryIconWithProgress
              icon={category.icon}
              progress={Math.random() * 1.2}
              color={category.color}
            />
          }
        >
          Test content
        </AccordionItem>
      ))}
    </Accordion>
  )
}

const PlaceCategoryIconWithProgress: FC<{
  icon: PlaceCategoryIconType | null
  progress: number
  color: PlaceCategoryColor
}> = ({ icon, progress, color }) => {
  const indicatorColorClassName = {
    'stroke-gray-700': color === 'gray',
    'stroke-red-500': color === 'red',
    'stroke-orange-500': color === 'orange',
    'stroke-amber-500': color === 'amber',
    'stroke-yellow-500': color === 'yellow',
    'stroke-lime-500': color === 'lime',
    'stroke-green-500': color === 'green',
    'stroke-emerald-500': color === 'emerald',
    'stroke-teal-500': color === 'teal',
    'stroke-cyan-500': color === 'cyan',
    'stroke-sky-500': color === 'sky',
    'stroke-blue-500': color === 'blue',
    'stroke-indigo-500': color === 'indigo',
    'stroke-violet-500': color === 'violet',
    'stroke-purple-500': color === 'purple',
    'stroke-fuchsia-500': color === 'fuchsia',
    'stroke-pink-500': color === 'pink',
    'stroke-rose-500': color === 'rose',
  } as const
  const trackColorClassName = {
    'stroke-gray-500/20': color === 'gray',
    'stroke-red-500/20': color === 'red',
    'stroke-orange-500/20': color === 'orange',
    'stroke-amber-500/20': color === 'amber',
    'stroke-yellow-500/20': color === 'yellow',
    'stroke-lime-500/20': color === 'lime',
    'stroke-green-500/20': color === 'green',
    'stroke-emerald-500/20': color === 'emerald',
    'stroke-teal-500/20': color === 'teal',
    'stroke-cyan-500/20': color === 'cyan',
    'stroke-sky-500/20': color === 'sky',
    'stroke-blue-500/20': color === 'blue',
    'stroke-indigo-500/20': color === 'indigo',
    'stroke-violet-500/20': color === 'violet',
    'stroke-purple-500/20': color === 'purple',
    'stroke-fuchsia-500/20': color === 'fuchsia',
    'stroke-pink-500/20': color === 'pink',
    'stroke-rose-500/20': color === 'rose',
  } as const
  const bgColorClassName = {
    'bg-gray-700': color === 'gray',
    'bg-red-500': color === 'red',
    'bg-orange-500': color === 'orange',
    'bg-amber-500': color === 'amber',
    'bg-yellow-500': color === 'yellow',
    'bg-lime-500': color === 'lime',
    'bg-green-500': color === 'green',
    'bg-emerald-500': color === 'emerald',
    'bg-teal-500': color === 'teal',
    'bg-cyan-500': color === 'cyan',
    'bg-sky-500': color === 'sky',
    'bg-blue-500': color === 'blue',
    'bg-indigo-500': color === 'indigo',
    'bg-violet-500': color === 'violet',
    'bg-purple-500': color === 'purple',
    'bg-fuchsia-500': color === 'fuchsia',
    'bg-pink-500': color === 'pink',
    'bg-rose-500': color === 'rose',
  } as const
  const iconColorClassName = {
    'text-gray-700': color === 'gray',
    'text-red-500': color === 'red',
    'text-orange-500': color === 'orange',
    'text-amber-500': color === 'amber',
    'text-yellow-500': color === 'yellow',
    'text-lime-500': color === 'lime',
    'text-green-500': color === 'green',
    'text-emerald-500': color === 'emerald',
    'text-teal-500': color === 'teal',
    'text-cyan-500': color === 'cyan',
    'text-sky-500': color === 'sky',
    'text-blue-500': color === 'blue',
    'text-indigo-500': color === 'indigo',
    'text-violet-500': color === 'violet',
    'text-purple-500': color === 'purple',
    'text-fuchsia-500': color === 'fuchsia',
    'text-pink-500': color === 'pink',
    'text-rose-500': color === 'rose',
  } as const

  return (
    <div className="relative">
      {progress >= 1 ? (
        <div className="p-1">
          <div className={cn('h-10 w-10 rounded-full', bgColorClassName)} />
        </div>
      ) : (
        <CircularProgress
          value={progress}
          minValue={0}
          maxValue={1}
          size="lg"
          classNames={{
            indicator: cn(indicatorColorClassName),
            track: cn(trackColorClassName),
          }}
        />
      )}
      <div className="absolute inset-0 flex items-center justify-center">
        <PlaceCategoryIcon
          icon={icon}
          className={cn(iconColorClassName, { 'text-white': progress >= 1 })}
        />
      </div>
    </div>
  )
}
