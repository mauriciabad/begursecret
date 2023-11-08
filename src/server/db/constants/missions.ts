import {
  PlaceCategoryColor,
  PlaceCategoryIcon as PlaceCategoryIconType,
} from '~/server/db/constants/places'

export type VisitMissionPlace = {
  id: number
  name: string
  mainImage: string | null
  images: {
    key: string
  }[]
  description: string | null
  location: {
    lat: number
    lng: number
  }
  mainCategory: {
    id: number
    icon: PlaceCategoryIconType
    name: string
    color: PlaceCategoryColor
  }
  categories: {
    id: number
    icon: PlaceCategoryIconType
    name: string
  }[]
  missionStatus: {
    visited: boolean
    verified: boolean
  }
  verificationRequirements: {
    isLocationRequired: boolean
  } | null
}

export type VisitMission = {
  category: {
    id: number
    namePlural: string
    icon: PlaceCategoryIconType | null
    color: PlaceCategoryColor
  }
  places: VisitMissionPlace[]
}
