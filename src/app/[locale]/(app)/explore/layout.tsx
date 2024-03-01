import type { FC, PropsWithChildren } from 'react'
import { MainMap } from '~/components/map/main-map'
import { MainMapProvider } from '~/components/providers/main-map-provider'
import { cn } from '~/helpers/cn'
import type { LocaleRouteParams } from '~/i18n'
import { getTrpc } from '~/server/get-server-thing'
import { ExploreTopbar } from './_components/explore-topbar'
import { MapDrawer } from './_components/map-drawer'

type ExploreLayoutProps = PropsWithChildren<LocaleRouteParams>

const ExploreLayout: FC<ExploreLayoutProps> = async ({ children }) => {
  const trpc = await getTrpc()

  const places = await trpc.map.getAllPlaces()
  const routes = await trpc.map.getAllRoutes()

  return (
    <>
      <ExploreTopbar />

      <main className="relative flex grow flex-col">
        <MainMapProvider
          markers={places.map((place) => ({
            placeId: place.id,
            lat: place.location.lat,
            lng: place.location.lng,
            icon: place.mainCategory.icon,
            color: place.mainCategory.color,
            url: `/explore/places/${place.id}`,
            name: place.name,
          }))}
          lines={routes.map((route) => ({
            routeId: route.id,
            color: route.mainCategory.color,
            path: route.path,
            url: `/explore/routes/${route.id}`,
            name: route.name,
          }))}
        >
          <MainMap
            className={cn(
              'min-h-[calc(100dvh_-_192px)]',
              'sticky top-16 grow',
              '-mb-2 box-content pb-2'
            )}
            classNames={{
              controls: 'bottom-6',
            }}
          />

          <MapDrawer
            classNames={{
              wrapper: 'rounded-t-lg',
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
