import { NextResponse } from 'next/server'

export function middleware(request) {
    const path = request.nextUrl.pathname;
    const isPublicPath = path === '/login' || path === '/register';
    const isPasswordResetPath = path === '/forgotpassword' || path === '/otpcheck' || path === '/resetpassword';
    // Get cookies
    const token = request.cookies.get("token")?.value || "";
    const passwordResetToken = request.cookies.get("passwordResetToken")?.value || "";
    const passwordResetStage = request.cookies.get("passwordResetStage")?.value || "";

    // Redirect to home if logged in user tries to access public paths
    if (isPublicPath && token) {
        return NextResponse.redirect(new URL('/', request.nextUrl));
    }
    // Redirect to login if trying to access protected routes without token
    if (!isPublicPath && !isPasswordResetPath && !token) {
        return NextResponse.redirect(new URL("/login", request.nextUrl));
    }
    // Ensure password reset flow is followed
    if (isPasswordResetPath) {
        if (!passwordResetToken) {
            // Redirect to login if there's no password reset token
            return NextResponse.redirect(new URL("/login", request.nextUrl));
        } else if (path === '/otpcheck' && passwordResetStage !== 'stage1') {
            // Redirect to forgotpassword if trying to access otpcheck without completing forgotpassword step
            return NextResponse.redirect(new URL("/forgotpassword", request.nextUrl));
        } else if (path === '/resetpassword' && passwordResetStage !== 'stage2') {
            // Redirect to otpcheck if trying to access resetpassword without completing otpcheck step
            return NextResponse.redirect(new URL("/otpcheck", request.nextUrl));
        }
    }
    // Allow access to public paths or correctly ordered password reset stages
    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/login', '/register', '/profile', '/forgotpassword', '/otpcheck', '/resetpassword'],
}
