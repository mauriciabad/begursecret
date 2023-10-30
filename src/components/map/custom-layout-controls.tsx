'use client'

import { Button } from '@nextui-org/button'
import { Card, CardFooter } from '@nextui-org/card'
import { Image } from '@nextui-org/image'
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/popover'
import { IconCircleFilled, IconStack2 } from '@tabler/icons-react'
import { TileLayer } from 'leaflet'
import 'leaflet.locatecontrol'
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.css'
import 'leaflet/dist/leaflet.css'
import { useTranslations } from 'next-intl'
import { FC, useMemo, useState } from 'react'
import { useMap } from 'react-leaflet'
import { cn } from '~/helpers/cn'

export const CustomLayersControl: FC = () => {
  const t = useTranslations('map')
  const parentMap = useMap()

  const [selectedLayer, setSelectedLayer] = useState<LayerId>('satelite-ign')

  const selectLayer = (layerId: LayerId) => {
    setSelectedLayer(layerId)
  }

  useMemo(() => {
    parentMap.eachLayer((layer) => {
      parentMap.removeLayer(layer)
    })
    parentMap.addLayer(layers[selectedLayer])
  }, [selectedLayer, parentMap])

  const makeLayerButton = (layerId: LayerId) => {
    return (
      <LayerButton
        layerId={layerId}
        onPress={() => selectLayer(layerId)}
        active={layerId === selectedLayer}
      />
    )
  }

  return (
    <Popover placement="top-end">
      <PopoverTrigger>
        <Button
          isIconOnly
          aria-label="Test"
          variant="solid"
          className="bg-white shadow-md"
        >
          <IconStack2 />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="block space-y-4 p-4">
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-2">
            <h3 className="mb-2 font-title font-semibold leading-none">
              {t('layout-types.classic')}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {makeLayerButton('classic-icgc')}
              {makeLayerButton('classic-ign')}
            </div>
          </div>
          <div className="col-span-1">
            <h3 className="mb-2 font-title font-semibold leading-none">
              {t('layout-types.hybrid')}
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {makeLayerButton('satelite-and-standard-icgc')}
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-2 font-title font-semibold leading-none">
            {t('layout-types.standard')}
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {makeLayerButton('standard-icgc')}
            {makeLayerButton('standard-ign')}
            {makeLayerButton('standard-osm')}
          </div>
        </div>

        <div>
          <h3 className="mb-2 font-title font-semibold leading-none">
            {t('layout-types.satellite')}
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {makeLayerButton('satelite-icgc')}
            {makeLayerButton('satelite-ign')}
            {makeLayerButton('satelite-esri')}
          </div>
        </div>
      </PopoverContent>
    </Popover>
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
      isFooterBlurred
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
      <CardFooter className="absolute inset-x-0 bottom-0 z-10 flex w-auto justify-center gap-1 overflow-hidden border-t border-white/30 bg-white/25 p-1 text-black/80">
        {active && <IconCircleFilled size={8} className="text-black/40" />}
        <span className="font-title font-bold leading-none">
          {layer.attribution.name}
        </span>
        {active && <IconCircleFilled size={8} className="text-black/40" />}
        {/* <LinkIconButton
          href={layer.attribution.url}
          label="Link to attribution"
          className="block h-4 w-4 min-w-0 text-black/40"
          isExternal
        >
          <IconInfoCircle size={16} />
        </LinkIconButton> */}
      </CardFooter>
    </Card>
  )
}

const layersData = [
  {
    id: 'classic-icgc',
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
  },
  {
    id: 'classic-ign',
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
  },
  {
    id: 'standard-ign',
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
  },
  {
    id: 'standard-icgc',
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
  },
  {
    id: 'standard-osm',
    type: 'standard',
    maxZoom: 21,
    attribution: {
      name: 'OSM',
      url: 'http://openstreetmap.org',
    },
    tileUrlTemplate: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    sampleImage: 'https://c.tile.openstreetmap.org/14/8338/6085.png',
  },
  {
    id: 'satelite-and-standard-icgc',
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
  },
  {
    id: 'satelite-icgc',
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
  },
  {
    id: 'satelite-esri',
    type: 'satelite',
    maxZoom: 20,
    attribution: {
      name: 'Esri',
      url: 'http://www.esri.com/',
    },
    tileUrlTemplate:
      'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    sampleImage:
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/14/6085/8338',
  },
  {
    id: 'satelite-ign',
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
  },
] as const satisfies ReadonlyArray<{
  id: string
  type: string
  maxZoom: number
  attribution: {
    name: string
    url?: string
  }
  tileUrlTemplate: string
  sampleImage: string
}>

type LayerId = (typeof layersData)[number]['id']

const layers = layersData.reduce(
  (acc, layer) => {
    acc[layer.id] = new TileLayer(layer.tileUrlTemplate, {
      maxZoom: layer.maxZoom,
    })
    return acc
  },
  {} as Record<LayerId, TileLayer>
)
