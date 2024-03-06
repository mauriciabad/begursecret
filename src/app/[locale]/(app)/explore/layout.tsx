import { unstable_setRequestLocale } from 'next-intl/server'
import type { FC, PropsWithChildren } from 'react'
import { MainMap } from '~/components/map/main-map'
import { MainMapProvider } from '~/components/providers/main-map-provider'
import { cn } from '~/helpers/cn'
import { parseLocale, type LocaleRouteParams } from '~/i18n'
import { ExploreTopbar } from './_components/explore-topbar'
import { MapDrawer } from './_components/map-drawer'

type ExploreLayoutProps = PropsWithChildren<LocaleRouteParams>

const ExploreLayout: FC<ExploreLayoutProps> = async ({ params, children }) => {
  const locale = parseLocale(params.locale)
  unstable_setRequestLocale(locale)

  return (
    <>
      <ExploreTopbar />

      <main className="relative flex grow flex-col">
        <MainMapProvider>
          <MainMap
            className={cn(
              'min-h-[calc(100dvh_-_65px_-_57px_-_57px)]',
              'sticky top-16 grow',
              '-mb-2 box-content pb-2'
            )}
            classNames={{
              controls: 'bottom-6',
            }}
          />

          <MapDrawer
            classNames={{
              contents: 'pb-8',
            }}
          >
            {children}
          </MapDrawer>
        </MainMapProvider>
      </main>
    </>
  )
}

export default ExploreLayout
