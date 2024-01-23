import 'next-auth'
import { UserRoles } from './db/constants/users'

declare module 'next-auth' {
  interface User {
    role: UserRoles
  }
  interface Session {
    user: User
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
  }
}
