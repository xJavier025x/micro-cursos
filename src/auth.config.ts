import type { NextAuthConfig } from 'next-auth';

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/new-account',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      // @ts-ignore
      const isAdmin = auth?.user?.role === 'ADMIN';
      
      const isOnAdmin = nextUrl.pathname.startsWith('/admin');
      const isOnProtected = nextUrl.pathname.startsWith('/dashboard') || 
                            nextUrl.pathname.startsWith('/courses') || 
                            nextUrl.pathname.startsWith('/profile') ||
                            nextUrl.pathname.startsWith('/results');
      const isOnAuth = nextUrl.pathname.startsWith('/auth');

      // 1. Admin Routes Protection
      if (isOnAdmin) {
        if (isLoggedIn && isAdmin) return true;
        // If logged in but not admin, redirect to dashboard
        if (isLoggedIn) return Response.redirect(new URL('/dashboard', nextUrl));
        // If not logged in, return false to trigger redirect to login
        return false;
      }

      // 2. Protected User Routes Protection
      if (isOnProtected) {
        if (isLoggedIn) {
            if (isAdmin) {
                 return Response.redirect(new URL('/admin', nextUrl));
            }
            return true;
        }
        return false; // Redirect to login
      }

      // 3. Auth Routes (Login/Register)
      if (isOnAuth) {
        if (isLoggedIn) {
          return Response.redirect(new URL('/dashboard', nextUrl));
        }
        return true;
      }

      // 4. Public Routes
      return true;
    },

    jwt({ token, user }) {
      if (user) {
        token.data = user;
      }
      return token;
    },

    session({ session, token, user }) {
      session.user = token.data as any;
      return session;
    },
  },
  providers: [], // Providers are configured in auth.ts
}