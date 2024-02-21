'use client'

import { Button } from '@nextui-org/button'
import { Card } from '@nextui-org/card'
import { useTranslations } from 'next-intl'
import { FC, useState } from 'react'
import { CategoryIcon } from '~/components/icons/category-icon'
import { cn } from '~/helpers/cn'
import { Link } from '~/navigation'
import { ApiRouterOutput } from '~/server/api/router'

type Categories = ApiRouterOutput['places']['listCategories']

export const CategoriesGrid: FC<{
  categories: Categories
}> = ({ categories }) => {
  const t = useTranslations('explore')
  const [showingAll, setShowingAll] = useState<boolean>(false)

  return (
    <div className="space-y-2 p-4">
      <h3 className="text-center font-title text-lg font-semibold leading-none text-stone-900">
        {t('categories')}
      </h3>
      <ul className="grid grid-cols-3 gap-2">
        {categories.map((category, i) => (
          <li data-i={i} className="contents" key={category.id}>
            <Card
              as={Link}
              shadow="none"
              radius="sm"
              isPressable
              href={`/explore/search?category=${category.id}`}
              className={cn(
                'flex flex-col items-center justify-center gap-1 border border-stone-200 bg-white p-2',
                { hidden: !showingAll && i >= 6 }
              )}
            >
              <CategoryIcon
                icon={category.icon}
                size={24}
                className="text-stone-800"
              />
              <span className="line-clamp-3 text-center text-sm font-medium leading-4 text-stone-900">
                {category.namePlural}
              </span>
            </Card>
          </li>
        ))}
      </ul>

      <Button
        variant="bordered"
        radius="full"
        onClick={() => {
          setShowingAll(true)
        }}
        className={cn('mx-auto flex', { hidden: showingAll })}
      >
        {t('show-all', { gender: 'feminine' })}
      </Button>
      <Button
        variant="bordered"
        radius="full"
        onClick={() => {
          setShowingAll(false)
        }}
        className={cn('mx-auto flex', { hidden: !showingAll })}
      >
        {t('show-less')}
      </Button>
    </div>
  )
}
