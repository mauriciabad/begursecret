import { IconLoader } from '@tabler/icons-react'
import { useTranslations } from 'next-intl'
import { FC } from 'react'
import { trpc } from '~/trpc'

export const MeritsTab: FC = () => {
  const t = useTranslations('profile.tabs.merits')

  const { data: visitedPlacesCount } =
    trpc.placeLists.getVisitedPlacesCount.useQuery()

  return (
    <>
      <div className="flex justify-center">
        <div className="flex-1 p-2 text-center leading-none">
          {typeof visitedPlacesCount === 'number' ? (
            <div className="text-4xl font-light">{visitedPlacesCount}</div>
          ) : (
            <IconLoader
              className="mx-auto block h-10 animate-spin text-stone-400"
              size={24}
            />
          )}
          <div className="mt-1">
            {t.rich('visited-places', {
              part: (chunks) => <span className="block">{chunks}</span>,
              highlight: (chunks) => (
                <span className="font-semibold">{chunks}</span>
              ),
            })}
          </div>
        </div>
      </div>
    </>
  )
}
