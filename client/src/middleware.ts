import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from '@/utils'; // Adjust path as needed

// Define routes that require authentication
const protectedRoutes = ['/profile', '/dashboard', '/account']; // Add more routes

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('authToken')?.value; // or 'authorization' header

    const pathname = request.nextUrl.pathname;

    // Check if the current route is a protected route
    const isProtectedRoute = protectedRoutes.some((route) =>
        pathname.startsWith(route)
    );

    if (isProtectedRoute) {
        // If no token exists, redirect to login page
        if (!token) {
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('callbackUrl', pathname); // Store the requested URL for redirection after login
            return NextResponse.redirect(loginUrl);
        }

        // Verify the JWT
        const verified = await verifyJWT(token); // Replace with your actual JWT verification logic

        if (!verified.isAuth) {
            // If the token is invalid, redirect to login page
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('callbackUrl', pathname);
            return NextResponse.redirect(loginUrl);
        }

        // If the token is valid, allow access to the route
        return NextResponse.next();
    }

    // If the route is not protected, allow access
    return NextResponse.next();
}

// Match all routes except for the /api routes and static files
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};