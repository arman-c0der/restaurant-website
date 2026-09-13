import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

    // admin না হয়েও কেউ /admin এ ঢুকতে চাইলে হোমপেজে পাঠিয়ে দেওয়া হচ্ছে
    if (isAdminRoute && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // token থাকলেই (লগইন করা থাকলেই) middleware ফাংশনে ঢুকতে দেওয়া হচ্ছে
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

// শুধু /admin এর নিচের সব রুটে middleware কাজ করবে
export const config = {
  matcher: ["/admin/:path*"],
};