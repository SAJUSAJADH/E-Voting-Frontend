import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { getCsrfToken } from 'next-auth/react'
import { SiweMessage } from 'siwe'

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      id: 'credentials',
      credentials: {
        message: {
          label: 'Message',
          type: 'text',
          placeholder: '0x0',
        },
        signature: {
          label: 'Signature',
          type: 'text',
          placeholder: '0x0',
        },
        type: {
          label: 'Type',
          type: 'text',
          placeholder: 'authority/voter',
        },
      },
      async authorize(credentials, req) {
        try {
          const siwe = new SiweMessage(JSON.parse(credentials?.message || '{}'))
          const nextAuthUrl = new URL(process.env.NEXTAUTH_URL)

          const result = await siwe.verify({
            signature: credentials?.signature || '',
            domain: nextAuthUrl.host,
            nonce: await getCsrfToken({ req: { headers: req.headers } }),
          })

          if (result.success) {
            return {
              id: siwe.address,
              role: credentials.type === 'authority' ? 'authority' : 'voter',
            }
          }
          return null
        } catch (e) {
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: '/',
    signOut: '/',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.user = user
      return token
    },

    async session({ session, token }) {
      session.address = token.sub
      session.user.name = token.sub
      session.user.role = token.user.role
      return session
    },
  },
})

export { handler as GET, handler as POST }
