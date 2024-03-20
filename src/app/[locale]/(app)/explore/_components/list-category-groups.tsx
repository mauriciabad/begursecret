import { Card } from '@nextui-org/card'
import { CardBody, Skeleton } from '@nextui-org/react'
import { FC } from 'react'
import { CategoryIcon } from '~/components/icons/category-icon'
import { cn } from '~/helpers/cn'
import { colorClasses } from '~/helpers/color-classes'
import { ApiRouterOutput } from '~/server/api/router'
import { LinksToCategoriesModal } from './links-to-categories-modal'

type PlaceCategoryGroup = NonNullable<
  ApiRouterOutput['explore']['listCategoryGroups']
>[number]

export const ListCategoryGroups: FC<{
  group: PlaceCategoryGroup
}> = ({ group }) => {
  const highlightedCategories = group.placeCategories
    .filter((category) => category.highlight)
    .map(({ category }) => category)

  return (
    <>
      <h3 className="mt-4 px-2 text-center font-title text-2xl font-semibold uppercase leading-none text-stone-900 first:mt-0">
        {group.name}
      </h3>
      <ul className="my-2 grid grid-cols-2 gap-2 px-4">
        {highlightedCategories.map((category) => (
          <Card
            as="li"
            key={category.id}
            shadow="md"
            className={cn(
              'shadow-md',
              colorClasses.shadow[category.color],
              'bg-gradient-to-br text-white',
              colorClasses.gradientBg[category.color]
            )}
          >
            <CardBody
              className={cn(
                'relative flex min-h-16 flex-row gap-2',
                'overflow-hidden'
              )}
            >
              <CategoryIcon
                icon={category.icon}
                size={24}
                className="shrink-0"
              />
              <span className="flex-1 font-semibold uppercase leading-5 tracking-wide">
                {category.namePlural}
              </span>
              <CategoryIcon
                icon={category.icon}
                strokeWidth={2}
                size={64}
                className="absolute bottom-0 right-1 z-0 shrink-0 opacity-10"
              />
            </CardBody>
          </Card>
        ))}
      </ul>

      <LinksToCategoriesModal group={group} />
    </>
  )
}

export const ListCategoryGroupsSkeleton: FC = () => {
  return (
    <>
      <Skeleton className="mx-auto mt-4 h-6 w-full max-w-32 rounded-full first:mt-0" />
      <div className="my-2 grid grid-cols-2 gap-2 px-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
      <Skeleton className="mx-auto mt-2 h-10 w-full max-w-48 rounded-full" />
    </>
  )
}
