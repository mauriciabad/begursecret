import type { FC, PropsWithChildren } from 'react'
import type { LocaleRouteParams } from '~/i18n'
import { onlyTranslatableLocales } from '~/i18n'
import { getTrpc } from '~/server/get-server-thing'
import { ExploreTopbar } from './_components/explore-topbar'
import { MainMap } from './_components/main-map'
import { MapDrawer } from './_components/map-drawer'

type ExploreLayoutProps = PropsWithChildren<LocaleRouteParams>

const ExploreLayout: FC<ExploreLayoutProps> = async ({ children }) => {
  const trpc = await getTrpc()

  const places = await trpc.places.list({
    locale: onlyTranslatableLocales('ca'),
  })

  return (
    <>
      <ExploreTopbar />

      <main className="relative flex grow flex-col">
        <MainMap places={places}>
          <MapDrawer
            classNames={{
              wrapper: 'rounded-t-lg',
              contents: 'pb-8',
            }}
          >
            {children}
          </MapDrawer>
        </MainMap>
      </main>
    </>
  )
}

export default ExploreLayout
