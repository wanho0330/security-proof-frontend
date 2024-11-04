import {NextRequest, NextResponse} from "next/server";
import {jwtVerify} from "jose";
import {requestRotationToken} from "@/api/user";


export async function middleware(request: NextRequest) {
    const protectedRoutes = ['/dashboard', '/user'];
    const { pathname } = request.nextUrl;
    const accessToken = request.cookies.get('accessToken')?.value;
    const refreshToken = request.cookies.get('refreshToken')?.value;

    if (!accessToken && refreshToken) {
        const result = await requestRotationToken(refreshToken);
        if (result.success && result.data) {
            const response = NextResponse.next()
            response.cookies.set('accessToken', result.data.accessToken)
            response.cookies.set('refreshToken', result.data.refreshToken)
            return response
        } else {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    if (pathname === '/') {
        if (accessToken) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        } else {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    if (protectedRoutes.includes(pathname) && !accessToken) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (pathname === '/login' && accessToken) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (accessToken) {
        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
            await jwtVerify(accessToken, secret);
            return NextResponse.next();
        } catch (error) {
            console.log('JWT Verification Error:', error);
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/dashboard', '/login', '/user'],
}