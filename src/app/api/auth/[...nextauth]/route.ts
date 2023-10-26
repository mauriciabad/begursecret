import NextAuth from 'next-auth'
import { withAxiom } from 'next-axiom'
import 'server-only'

import { authOptions } from '~/server/auth'

const handler = withAxiom(NextAuth(authOptions))

export { handler as GET, handler as POST }
