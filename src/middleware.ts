import getOrCreateDB from '@/models/server/db'
import getOrCreateStorage from '@/models/server/storageSetup'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'




// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  
  await Promise.all([
    getOrCreateDB(),
    getOrCreateStorage()
  ])
  
  return NextResponse.next()
}
 
// See "Matching Paths" below to learn more
export const config = {
  /* match all request paths except for the the ones that starts with:
  - api
  - _next/static
  - _next/image
  - favicon.com

  */
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}