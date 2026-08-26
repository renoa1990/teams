import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import {
  getSessionOptions,
  type SessionData,
} from "@/lib/session-options";

export async function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const session = await getIronSession<SessionData>(
    request,
    response,
    getSessionOptions(),
  );

  if (!session.user) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/input/:path*", "/result/:path*", "/edit/:path*"],
};
