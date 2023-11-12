'use client'

import { Tab, Tabs } from '@nextui-org/tabs'
import { Icon, IconBook, IconBookmark, IconMedal2 } from '@tabler/icons-react'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { FC } from 'react'
import { useCreateUrl } from '~/helpers/useCreateUrl'
import { JournalTab } from './tabs/journal-tab'
import { MeritsTab } from './tabs/merits-tab'
import { SavedTab } from './tabs/saved-tab'

export const UserTabs: FC = () => {
  const t = useTranslations('profile.tabs')
  const searchParams = useSearchParams()
  const tab = searchParams.get('tab') ?? 'merits'
  const { createUrlWithSearchParams } = useCreateUrl()

  const tabs: {
    key: string
    icon: Icon
    title: string
    content: FC
  }[] = [
    {
      key: 'merits',
      icon: IconMedal2,
      title: t('merits.tab-title'),
      content: MeritsTab,
    },
    {
      key: 'journal',
      icon: IconBook,
      title: t('journal.tab-title'),
      content: JournalTab,
    },
    {
      key: 'saved',
      icon: IconBookmark,
      title: t('saved.tab-title'),
      content: SavedTab,
    },
  ]

  return (
    <>
      <Tabs
        aria-label="Options"
        selectedKey={tab}
        variant="underlined"
        className="flex border-b bg-white shadow-sm"
        classNames={{
          tabList: 'w-full p-0 overflow-visible mx-auto max-w-2xl',
          tabContent: 'group-data-[selected=true]:font-semibold',
        }}
        items={tabs}
      >
        {(item) => {
          const Icon = item.icon
          const Content = item.content
          return (
            <Tab
              key={item.key}
              className="h-auto flex-1"
              title={
                <div className="flex flex-col items-center justify-center">
                  <Icon size={24} />
                  <span>{item.title}</span>
                </div>
              }
              href={createUrlWithSearchParams({ tab: item.key })}
            >
              <main className="mx-auto w-full max-w-2xl px-6 py-3">
                <Content />
              </main>
            </Tab>
          )
        }}
      </Tabs>
    </>
  )
}
