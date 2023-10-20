export const isProduction =
  process.env.NODE_ENV === 'production' &&
  window.location.hostname === process.env.VERCEL_URL

export const isUsingLocalDb = process.env.USE_LOCAL_DB === 'true'
