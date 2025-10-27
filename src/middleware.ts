import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req:NextRequest) {

  const token= await getToken({req})

  const {pathname}= req.nextUrl

  const isPublic = 
  pathname==="/" ||
  pathname.startsWith("/auth") ||
  pathname.startsWith("/api/auth")


  if(!token && !isPublic){
    return NextResponse.redirect(new URL("/auth/sign-in",req.url))
  }

  if (token && pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/interview", req.url))
  }
     return NextResponse.next()
}
export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
}