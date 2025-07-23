import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

// Demo users for testing
const demoUsers = [
  {
    id: '1',
    email: 'demo@labguard.com',
    password: 'demo123',
    name: 'Demo User',
    role: 'ADMIN',
    laboratoryId: 'lab-1',
    laboratoryName: 'Demo Laboratory'
  },
  {
    id: '2', 
    email: 'admin@labguard.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'ADMIN',
    laboratoryId: 'lab-1',
    laboratoryName: 'Demo Laboratory'
  }
]

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials): Promise<any> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required')
        }

        // Find demo user
        const user = demoUsers.find(u => 
          u.email.toLowerCase() === credentials.email.toLowerCase() &&
          u.password === credentials.password
        )

        if (!user) {
          throw new Error('Invalid credentials')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          laboratoryId: user.laboratoryId,
          laboratoryName: user.laboratoryName
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60 // 7 days
  },
  jwt: {
    maxAge: 7 * 24 * 60 * 60 // 7 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.laboratoryId = user.laboratoryId
        token.laboratoryName = user.laboratoryName
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.laboratoryId = token.laboratoryId as string
        session.user.laboratoryName = token.laboratoryName as string
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error'
  },
  secret: process.env.NEXTAUTH_SECRET || 'labguard-pro-secret-key-2024-development'
} 