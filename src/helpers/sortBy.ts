export const makeSortByKey =
  <K extends string>(key: K) =>
  <T extends { [key in K]: number | string | boolean | null | undefined }>(
    a: T,
    b: T
  ) => {
    const aKey = a[key]
    const bKey = b[key]

    if (aKey === bKey) return 0
    if (aKey === null || aKey === undefined) return 1
    if (bKey === null || bKey === undefined) return -1
    if (typeof aKey === 'string' && typeof bKey === 'string') {
      return aKey.localeCompare(bKey)
    }
    if (typeof aKey === 'boolean' && typeof bKey === 'boolean') {
      return aKey ? -1 : 1
    }
    return aKey < bKey ? -1 : 1
  }

export const sortByImportance = makeSortByKey('importance')
export const sortByOrder = makeSortByKey('order')
export const sortByIsOfficialWebsite = makeSortByKey('isOfficialWebsite')
