import moize from 'moize'

const getFaviconFromUrl = (url: string, size: number = 32): string => {
  const favicon = new URL('https://t2.gstatic.com/faviconV2')
  favicon.searchParams.set('client', 'SOCIAL')
  favicon.searchParams.set('type', 'FAVICON')
  favicon.searchParams.set('fallback_opts', 'TYPE,SIZE,URL')
  favicon.searchParams.set('url', url)
  favicon.searchParams.set('size', size.toString())
  return favicon.toString()
}
const namedWebsites = [
  {
    id: 'visitbegur',
    name: 'Visit Begur',
    regex: [/^visitbegur\.cat\b/],
  },
  { id: 'begur', name: 'Begur', regex: [/^begur\.cat\b/] },
  {
    id: 'wikipedia',
    name: 'Wikipedia',
    regex: [/^([a-z]+\.)?wikipedia\.org\b/],
  },
  {
    id: 'google-maps',
    name: 'Google Maps',
    regex: [
      /^google\.[a-z]+\/maps\b/,
      /^maps\.google\.[a-z]+\b/,
      /^maps\.app\.goo\.gl\b/,
    ],
    favicon: getFaviconFromUrl('https://mapsplatform.google.com/'),
  },
  { id: 'wikiloc', name: 'Wikiloc', regex: [/^([a-z]+\.)?wikiloc\.com\b/] },
  { id: 'perdutsbegur', name: 'Els Perduts', regex: [/^perdutsbegur\.cat\b/] },
  {
    id: 'geodesicPoint',
    name: 'Fitxa del punt geodèsic',
    regex: [/^geofons\.icgc\.cat\/fitxes\/XU\//],
  },
  {
    id: 'youtube',
    name: 'YouTube',
    regex: [/^youtu\.be\b/, /^youtube\.[a-z]+\b/],
  },
  { id: 'instagram', name: 'Instagram', regex: [/^instagram\.[a-z]+\b/] },
  {
    id: 'facebook',
    name: 'Facebook',
    regex: [/^facebook\.[a-z]+\b/, /^fb\.com\b/],
  },
] as const satisfies {
  id: string
  name: string
  regex: RegExp[]
  favicon?: string
}[]

type LinkData = {
  name: string
  favicon?: string
}

export const getLinkData = moize(
  (link: { title?: string | null; url: string }): LinkData => {
    const url = parseUrl(link.url)
    if (!url) return { name: link.title || 'Link' }

    if (url.protocol === 'geo:') {
      return {
        name: link.title || 'Mapa',
      }
    }

    const hostname = url.hostname.replace(/^www\./, '')

    const namedWebsite = namedWebsites.find((nw) =>
      nw.regex.some((r) => r.test(`${hostname}${url.pathname}`))
    )

    if (namedWebsite) {
      return {
        name: link.title || namedWebsite.name,
        favicon:
          'favicon' in namedWebsite
            ? namedWebsite.favicon
            : getFaviconFromUrl(link.url),
      }
    }

    return {
      name: link.title || hostname,
      favicon: getFaviconFromUrl(link.url),
    }
  }
)
function parseUrl(url: string) {
  try {
    return new URL(url)
  } catch {
    return null
  }
}
