import { withAuth, NextRequestWithAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(request) {
    const path = request.nextUrl.pathname
    const token = request.nextauth.token
    if (path.startsWith('/election') && token?.user?.role !== 'authority') {
      return NextResponse.redirect(new URL('/', request.url))
    }
    if (path.startsWith('/voter') && token?.user?.role !== 'voter') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: ['/election/:path*', '/voter/:path*'],
}
