'use client'

import { Button } from '@nextui-org/button'
import { Card, CardBody } from '@nextui-org/card'
import { Image } from '@nextui-org/image'
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/popover'
import { IconStack2, IconStars, IconStarsFilled } from '@tabler/icons-react'
import { useTranslations } from 'next-intl'
import { FC, useState } from 'react'
import { cn } from '~/helpers/cn'
import { LinkButton } from '../../links/link-button'
import { NextTileLayer } from '../leaflet-components/next-js-ready/simple-components'

export const CustomLayersControl: FC<{
  hide?: boolean
  defaultLayer?: LayerId
}> = ({ hide, defaultLayer = 'bg-satelite-ign' }) => {
  const t = useTranslations('map')

  const [selectedLayer, setSelectedLayer] = useState<LayerId>(defaultLayer)

  const makeLayerButton = (layerId: LayerId) => {
    return (
      <LayerButton
        layerId={layerId}
        onPress={() => setSelectedLayer(layerId)}
        active={layerId === selectedLayer}
      />
    )
  }

  return (
    <>
      {layersData.map(
        (layer) =>
          layer.id === selectedLayer && (
            <NextTileLayer
              key={layer.id}
              attribution={`&copy; <a href="${layer.attribution.url}">${layer.attribution.name}</a>`}
              url={layer.tileUrlTemplate}
              maxZoom={layer.maxZoom}
              id={layer.id}
              updateWhenIdle={false}
            />
          )
      )}
      {!hide && (
        <Popover placement="top-end">
          <PopoverTrigger>
            <Button
              size="lg"
              isIconOnly
              variant="solid"
              className="bg-white shadow-md"
            >
              <IconStack2 />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="block space-y-4 p-4">
            <div>
              <h3 className="mb-2 font-title font-semibold leading-none">
                {t('layout-types.external')}
              </h3>
              <div className="flex max-w-[256px] text-center">
                <ExternalMapItem
                  name="Earth"
                  href="https://earth.google.com/web/@41.95456799,3.20833249,206.88319143a,840.3173078d,35y,135h,60t,0r/data=KAI"
                  image="/images/brands/google-earth.svg"
                />
                <ExternalMapItem
                  name="Navionics"
                  href="https://webapp.navionics.com/#boating@11&key=kta_G%7B%7BsR"
                  image="/images/brands/navionics.svg"
                />
                <ExternalMapItem
                  name="Vissir3"
                  href="http://srv.icgc.cat/vissir3/index.html?HfYJ5y5Ks"
                  image="/images/brands/icgc.svg"
                />
                <ExternalMapItem
                  name="Wikiloc"
                  href="https://wikiloc.com/wikiloc/map.do?sw=41.92590918891433%2C3.1692981719970708&ne=41.982271629453585%2C3.2681751251220708&page=1"
                  image="/images/brands/wikiloc.svg"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <h3 className="mb-2 font-title font-semibold leading-none">
                  {t('layout-types.classic')}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {makeLayerButton('bg-classic-icgc')}
                  {makeLayerButton('bg-classic-ign')}
                </div>
              </div>
              <div className="col-span-1">
                <h3 className="mb-2 font-title font-semibold leading-none">
                  {t('layout-types.hybrid')}
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {makeLayerButton('bg-satelite-and-standard-icgc')}
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-2 font-title font-semibold leading-none">
                {t('layout-types.standard')}
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {makeLayerButton('bg-standard-osm')}
                {makeLayerButton('bg-standard-icgc')}
                {makeLayerButton('bg-standard-ign')}
              </div>
            </div>

            <div>
              <h3 className="mb-2 font-title font-semibold leading-none">
                {t('layout-types.satellite')}
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {makeLayerButton('bg-satelite-ign')}
                {makeLayerButton('bg-satelite-icgc')}
                {makeLayerButton('bg-satelite-esri')}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </>
  )
}

const LayerButton: FC<{
  layerId: LayerId
  onPress: () => void
  active?: boolean
}> = ({ layerId, onPress, active }) => {
  const layer = layersData.find((layer) => layer.id === layerId)
  if (!layer) return null

  return (
    <Card
      shadow="sm"
      key={layer.id}
      isPressable
      onPress={onPress}
      className={cn('max-w-[80px]', {
        'ring-2 ring-brand-600 ring-offset-1': active,
      })}
    >
      <Image
        removeWrapper
        alt=""
        className="aspect-square w-full object-cover"
        src={layer.sampleImage}
        radius="none"
      />
      {layer.isGoodMap && (
        <span
          className={cn(
            'absolute inset-0 bottom-2 z-10 mx-auto flex items-center justify-center',
            { 'opacity-60': !active }
          )}
        >
          <div className="relative">
            <IconStarsFilled size={40} className="text-yellow-300" />
            <IconStars
              size={40}
              stroke={1}
              className="absolute inset-0 text-stone-800"
            />
          </div>
        </span>
      )}
      <CardBody className="absolute inset-0 top-auto z-10 p-1">
        <span className="text-center font-title text-xs font-bold leading-none text-black opacity-70 txt-stroke-white">
          {layer.attribution.name}
        </span>
      </CardBody>
    </Card>
  )
}

const ExternalMapItem: FC<{
  name: string
  image: string
  href: string
}> = ({ name, image, href }) => {
  return (
    <LinkButton
      href={href}
      className="-my-2 flex h-auto min-w-0 shrink grow basis-0 flex-col items-center justify-start gap-1 py-2"
      isExternal
      variant="light"
    >
      <Image src={image} className="h-6" radius="none" />
      <span className="whitespace-normal text-xs font-medium text-stone-800">
        {name}
      </span>
    </LinkButton>
  )
}

const layersData = [
  {
    id: 'bg-classic-icgc',
    type: 'classic',
    maxZoom: 20,
    attribution: {
      name: 'ICGC',
      url: 'http://icgc.cat/',
    },
    tileUrlTemplate:
      'https://geoserveis.icgc.cat/icc_mapesmultibase/noutm/wmts/topo/GRID3857/{z}/{x}/{y}.png',
    sampleImage:
      'https://geoserveis.icgc.cat/icc_mapesmultibase/noutm/wmts/topo/GRID3857/14/8338/6085.png',
    isGoodMap: true,
  },
  {
    id: 'bg-classic-ign',
    type: 'classic',
    maxZoom: 20,
    attribution: {
      name: 'IDEE',
      url: 'http://www.ign.es/',
    },
    tileUrlTemplate:
      'https://ign.es/wmts/mapa-raster?service=WMTS&request=GetTile&version=1.0.0&Format=image/jpeg&layer=MTN&style=default&style=default&tilematrixset=GoogleMapsCompatible&TileMatrix={z}&TileRow={y}&TileCol={x}',
    sampleImage:
      'https://ign.es/wmts/mapa-raster?service=WMTS&request=GetTile&version=1.0.0&Format=image/jpeg&layer=MTN&style=default&style=default&tilematrixset=GoogleMapsCompatible&TileMatrix=14&TileRow=6085&TileCol=8338',
    isGoodMap: false,
  },
  {
    id: 'bg-standard-osm',
    type: 'standard',
    maxZoom: 21,
    attribution: {
      name: 'OSM',
      url: 'http://openstreetmap.org',
    },
    tileUrlTemplate: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    sampleImage: 'https://c.tile.openstreetmap.org/14/8338/6085.png',
    isGoodMap: true,
  },
  {
    id: 'bg-standard-ign',
    type: 'standard',
    maxZoom: 20,
    attribution: {
      name: 'IDEE',
      url: 'http://www.ign.es/',
    },
    tileUrlTemplate:
      'https://www.ign.es/wmts/ign-base?service=WMTS&request=GetTile&version=1.0.0&Format=image/png&layer=IGNBaseTodo&style=default&tilematrixset=GoogleMapsCompatible&TileMatrix={z}&TileRow={y}&TileCol={x}',
    sampleImage:
      'https://www.ign.es/wmts/ign-base?service=WMTS&request=GetTile&version=1.0.0&Format=image/png&layer=IGNBaseTodo&style=default&tilematrixset=GoogleMapsCompatible&TileMatrix=14&TileRow=6085&TileCol=8338',
    isGoodMap: false,
  },
  {
    id: 'bg-standard-icgc',
    type: 'standard',
    maxZoom: 19,
    attribution: {
      name: 'ICGC',
      url: 'http://icgc.cat/',
    },
    tileUrlTemplate:
      'https://geoserveis.icgc.cat/servei/catalunya/contextmaps/wmts/contextmaps-mapa-estandard/{z}/{x}/{y}.png',
    sampleImage:
      'https://geoserveis.icgc.cat/servei/catalunya/contextmaps/wmts/contextmaps-mapa-estandard/14/8338/6085.png',
    isGoodMap: false,
  },
  {
    id: 'bg-satelite-and-standard-icgc',
    type: 'satelite + standard',
    maxZoom: 19,
    attribution: {
      name: 'ICGC',
      url: 'http://icgc.cat/',
    },
    tileUrlTemplate:
      'https://geoserveis.icgc.cat/servei/catalunya/contextmaps/wmts/contextmaps-orto-estandard/MON3857NW/{z}/{x}/{y}.png',
    sampleImage:
      'https://geoserveis.icgc.cat/servei/catalunya/contextmaps/wmts/contextmaps-orto-estandard/MON3857NW/14/8338/6085.png',
    isGoodMap: false,
  },
  {
    id: 'bg-satelite-ign',
    type: 'satelite',
    maxZoom: 20,
    attribution: {
      name: 'IDEE',
      url: 'http://www.ign.es/',
    },
    tileUrlTemplate:
      'https://www.ign.es/wmts/pnoa-ma?service=WMTS&request=GetTile&version=1.0.0&Format=image/png&layer=OI.OrthoimageCoverage&style=default&tilematrixset=GoogleMapsCompatible&TileMatrix={z}&TileRow={y}&TileCol={x}',
    sampleImage:
      'https://www.ign.es/wmts/pnoa-ma?service=WMTS&request=GetTile&version=1.0.0&Format=image/png&layer=OI.OrthoimageCoverage&style=default&tilematrixset=GoogleMapsCompatible&TileMatrix=14&TileRow=6085&TileCol=8338',
    isGoodMap: true,
  },
  {
    id: 'bg-satelite-icgc',
    type: 'satelite',
    maxZoom: 20,
    attribution: {
      name: 'ICGC',
      url: 'http://icgc.cat/',
    },
    tileUrlTemplate:
      'https://geoserveis.icgc.cat/icc_mapesmultibase/noutm/wmts/orto/GRID3857/{z}/{x}/{y}.png',
    sampleImage:
      'https://geoserveis.icgc.cat/icc_mapesmultibase/noutm/wmts/orto/GRID3857/14/8338/6085.png',
    isGoodMap: false,
  },
  {
    id: 'bg-satelite-esri',
    type: 'satelite',
    maxZoom: 20,
    attribution: {
      name: 'Esri',
      url: 'http://www.esri.com/',
    },
    tileUrlTemplate:
      'https://clarity.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    sampleImage:
      'https://clarity.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/tile/14/6085/8338',
    isGoodMap: false,
  },
] as const satisfies ReadonlyArray<{
  id: `bg-${string}`
  type: string
  maxZoom: number
  attribution: {
    name: string
    url?: string
  }
  tileUrlTemplate: string
  sampleImage: string
  isGoodMap: boolean
}>

export type LayerId = (typeof layersData)[number]['id']
