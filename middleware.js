import { withAuth, NextRequestWithAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(function middleware(request) {
  const path = request.nextUrl.pathname
  const token = request.nextauth.token
})

export const config = {
  matcher: ['/election/:path*', '/voter/:path*'],
}
