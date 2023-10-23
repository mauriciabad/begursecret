import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      image: Required<DefaultSession>['user']['image']
      name: Required<DefaultSession>['user']['name']
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
  }
}
