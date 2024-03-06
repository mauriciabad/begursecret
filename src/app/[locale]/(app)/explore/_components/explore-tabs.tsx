'use client'

import { Tab, Tabs } from '@nextui-org/tabs'
import {
  Icon,
  IconBuildingStore,
  IconMapPin,
  IconRoute,
  IconStretching2,
} from '@tabler/icons-react'
import { useTranslations } from 'next-intl'
import { FC } from 'react'
import { cn } from '~/helpers/cn'
import { usePathname } from '~/navigation'

const tabs = [
  {
    key: 'places',
    icon: IconMapPin,
  },
  {
    key: 'bussinesses',
    icon: IconBuildingStore,
  },
  {
    key: 'activities',
    icon: IconStretching2,
  },
  {
    key: 'routes',
    icon: IconRoute,
  },
] as const satisfies {
  key: string
  icon: Icon
}[]

export const ExploreTabs: FC<{
  className?: string
}> = ({ className }) => {
  const t = useTranslations('explore')
  const pathname = usePathname()
  const tab = pathname.match(/^\/explore\/([^/]+)/)?.[1]

  if (!tab || !tabs.some((t) => t.key === tab)) return null

  return (
    <Tabs
      aria-label="Options"
      selectedKey={tab}
      variant="underlined"
      className={cn('flex border-b bg-white shadow-sm', className)}
      classNames={{
        tabList: 'w-full p-0 overflow-visible mx-auto max-w-2xl',
        tabContent: 'group-data-[selected=true]:font-semibold',
        panel: 'p-0',
      }}
      items={tabs}
    >
      {(item) => {
        const Icon = item.icon
        return (
          <Tab
            key={item.key}
            className="h-auto flex-1 pt-2"
            title={
              <div className="flex flex-col items-center justify-center">
                <Icon size={24} />
                <span>{t(`tabs.${item.key}`)}</span>
              </div>
            }
            href={`/explore/${item.key}`}
          />
        )
      }}
    </Tabs>
  )
}
