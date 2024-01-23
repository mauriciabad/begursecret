// Don't reorder these values, they are used to generate the database schema.
export const userRoles = ['user', 'admin'] as const
export type UserRoles = (typeof userRoles)[number]
