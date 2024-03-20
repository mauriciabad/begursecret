import { Card } from '@nextui-org/card'
import { CardBody, Skeleton } from '@nextui-org/react'
import { FC } from 'react'
import { CategoryIcon } from '~/components/icons/category-icon'
import { cn } from '~/helpers/cn'
import { colorClasses } from '~/helpers/color-classes'
import { Link } from '~/navigation'
import { ApiRouterOutput } from '~/server/api/router'
import { LinksToCategoriesModal } from './links-to-categories-modal'

type BaseCategoryGroup = NonNullable<
  ApiRouterOutput['explore']['listCategoryGroups']
>[number]

export type CategoryGroupListItem = Omit<
  BaseCategoryGroup,
  'placeCategories'
> & {
  categories: BaseCategoryGroup['placeCategories']
  type: 'place' | 'route'
}

export const ListCategoryGroups: FC<{
  group: CategoryGroupListItem
}> = ({ group }) => {
  const highlightedCategories = group.categories
    .filter((category) => category.highlight)
    .map(({ category }) => category)

  return (
    <>
      <h3 className="mt-4 px-2 text-center font-title text-2xl font-semibold uppercase leading-none text-stone-900 first:mt-0">
        {group.name}
      </h3>
      <ul className="my-2 grid grid-cols-2 gap-2 px-4">
        {highlightedCategories.map((category) => {
          const categoryLink =
            group.type === 'place'
              ? (`/explore/search?placeCategory=${category.id}` as const)
              : (`/explore/search?routeCategory=${category.id}` as const)

          return (
            <li className="contents">
              <Link href={categoryLink} className="contents">
                <Card
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
                      'relative flex min-h-16 flex-row gap-2 pl-2 pr-0',
                      'overflow-hidden'
                    )}
                  >
                    <CategoryIcon icon={category.icon} size={24} />
                    <span className="flex-1 overflow-auto break-words font-semibold uppercase leading-5 tracking-wide">
                      {category.namePlural}
                    </span>
                    <CategoryIcon
                      icon={category.icon}
                      strokeWidth={2}
                      size={64}
                      className="pointer-events-none absolute bottom-0 right-1 z-0 shrink-0 opacity-10"
                    />
                  </CardBody>
                </Card>
              </Link>
            </li>
          )
        })}
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
