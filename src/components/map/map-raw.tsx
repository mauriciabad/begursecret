'use client'

import L, { Icon, LatLngLiteral, Map as LeafletMap } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import {
  LayersControl,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  ZoomControl,
} from 'react-leaflet'
import IconMapPin from '/public/icon-map-pin.svg'
import { FC, useEffect, useState } from 'react'
import 'leaflet.locatecontrol'
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.css'
import { renderToStaticMarkup } from 'react-dom/server'
import { divIcon } from 'leaflet'
import { PlaceMarker } from './place-marker'
import { cn } from '~/helpers/cn'
import { PlaceType } from '~/server/db/constants/places'
import { useRouter } from 'next-intl/client'

const DEFAULT_CENTER = {
  lat: 41.958627,
  lng: 3.213765,
} as const satisfies LatLngLiteral

export const MapRaw: FC<{
  center?: LatLngLiteral
  className?: string
  zoom?: number
  fullControl?: boolean
  markers?: {
    location: LatLngLiteral
    text?: string
    markerType?: PlaceType
    url?: string
  }[]
}> = ({
  center = DEFAULT_CENTER,
  className,
  markers,
  fullControl,
  zoom = 14,
}) => {
  const router = useRouter()
  const [map, setMap] = useState<LeafletMap | null>(null)

  useEffect(() => {
    if (map) {
      const resizeObserver = new ResizeObserver(() => map.invalidateSize())

      const container = map.getContainer()
      resizeObserver.observe(container)

      return () => {
        resizeObserver.unobserve(container)
      }
    }
  }, [map])

  useEffect(() => {
    if (map) {
      L.control
        .locate({
          flyTo: true,
          showPopup: false,
          position: 'bottomright',
        })
        .addTo(map)
    }
  }, [map])

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      zoomControl={false}
      scrollWheelZoom={fullControl}
      dragging={fullControl || !L.Browser.mobile}
      className={cn('z-0 h-64 w-full', className)}
      ref={setMap}
    >
      {markers?.map(({ text, location, markerType, url: markerUrl }) => (
        <Marker
          key={`${location.lat}-${location.lng}`}
          position={location}
          icon={
            markerType
              ? divIcon({
                  html: renderToStaticMarkup(<PlaceMarker type={markerType} />),
                  iconSize: [0, 0],
                })
              : new Icon({
                  iconUrl: IconMapPin.src,
                  iconAnchor: [94 * 0.3 * 0.5, 128 * 0.3 * 1],
                  iconSize: [94 * 0.3, 128 * 0.3],
                })
          }
          eventHandlers={
            markerUrl
              ? {
                  click: () => {
                    console.log('click', markerUrl)
                    router.push(markerUrl)
                  },
                }
              : {}
          }
        >
          {text && <Popup>{text}</Popup>}
        </Marker>
      ))}

      <ZoomControl position="bottomright" />

      <LayersControl position="bottomleft">
        <LayersControl.BaseLayer name="Classic (ICGC)">
          <TileLayer
            maxZoom={20}
            attribution="ICGC"
            url="https://geoserveis.icgc.cat/icc_mapesmultibase/noutm/wmts/topo/GRID3857/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Classic (MTN)">
          <TileLayer
            maxZoom={20}
            attribution="<a href='http://www.ign.es/'>IDEE</a>"
            url="https://ign.es/wmts/mapa-raster?service=WMTS&request=GetTile&version=1.0.0&Format=image/jpeg&layer=MTN&style=default&style=default&tilematrixset=GoogleMapsCompatible&TileMatrix={z}&TileRow={y}&TileCol={x}"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Standard (IGN)">
          <TileLayer
            maxZoom={20}
            attribution="<a href='http://www.ign.es/'>IDEE</a>"
            url="https://www.ign.es/wmts/ign-base?service=WMTS&request=GetTile&version=1.0.0&Format=image/png&layer=IGNBaseTodo&style=default&tilematrixset=GoogleMapsCompatible&TileMatrix={z}&TileRow={y}&TileCol={x}"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Standard (ICGC)">
          <TileLayer
            maxZoom={19}
            attribution="ICGC"
            url="https://geoserveis.icgc.cat/servei/catalunya/contextmaps/wmts/contextmaps-mapa-estandard/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Standard (OSM)">
          <TileLayer
            maxZoom={21}
            attribution="OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer checked name="Satelite (IGN)">
          <TileLayer
            maxZoom={20}
            attribution="<a href='http://www.ign.es/'>IGN</a>"
            url="https://www.ign.es/wmts/pnoa-ma?service=WMTS&request=GetTile&version=1.0.0&Format=image/png&layer=OI.OrthoimageCoverage&style=default&tilematrixset=GoogleMapsCompatible&TileMatrix={z}&TileRow={y}&TileCol={x}"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Satelite (ICGC 1)">
          <TileLayer
            maxZoom={19}
            attribution="ICGC"
            url="https://geoserveis.icgc.cat/servei/catalunya/contextmaps/wmts/contextmaps-orto-estandard/MON3857NW/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Satelite (ICGC 2)">
          <TileLayer
            maxZoom={20}
            attribution="ICGC"
            url="https://geoserveis.icgc.cat/icc_mapesmultibase/noutm/wmts/orto/GRID3857/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Satelite (Esri)">
          <TileLayer
            maxZoom={20}
            attribution='&copy; <a href="http://www.esri.com/">Esri</a>'
            url="http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        </LayersControl.BaseLayer>
      </LayersControl>
    </MapContainer>
  )
}
