'use client'

import { Avatar } from '@nextui-org/avatar'
import { Select, SelectItem } from '@nextui-org/select'
import { Selection } from '@nextui-org/table'
import { IconLanguage } from '@tabler/icons-react'
import { useLocale, useTranslations } from 'next-intl'
import type { FC } from 'react'
import { cn } from '~/helpers/cn'
import { locales } from '~/i18n'
import { usePathname, useRouter } from '~/navigation'

export const LanguageSwitcher: FC<{ className?: string }> = ({ className }) => {
  const pathname = usePathname()
  const currentLocale = useLocale()
  const router = useRouter()
  const t = useTranslations('language-switcher')

  const onChange = (selection: Selection) => {
    if (selection === 'all') throw new Error('selection is all')

    const [locale] = selection
    if (typeof locale !== 'string')
      throw new Error(`locale "${locale}" is not a string`)

    router.push(pathname, { locale })
  }

  return (
    <Select
      className={cn('block max-w-xs', className)}
      label={t('label')}
      onSelectionChange={onChange}
      selectedKeys={new Set<string>([currentLocale])}
      size="sm"
      startContent={<IconLanguage />}
      variant="bordered"
    >
      {locales.map((locale) => (
        <SelectItem
          key={locale}
          startContent={
            <Avatar alt="" className="h-6 w-6" src={makeFlagUrl(locale)} />
          }
        >
          {t(`options.${locale}`)}
        </SelectItem>
      ))}
    </Select>
  )
}

function makeFlagUrl<L extends string>(locale: L) {
  return `/flags/${locale}.svg`
}
