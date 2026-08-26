import type { SessionOptions } from "iron-session";

export type SessionUser = {
  id: number;
  userId: string;
  level: string;
};

export type SessionData = {
  user?: SessionUser;
};

export function getSessionOptions(): SessionOptions {
  const password = process.env.COOKIE_PASSWORD;
  if (!password) {
    throw new Error("COOKIE_PASSWORD is not set");
  }

  return {
    cookieName: "TeamLX",
    password,
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    },
  };
}
