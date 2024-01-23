import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";

const cookieConfig = {
  cookieName: "TeamLX",
  password: process.env.COOKIE_PASSWORD!,
};
declare module "iron-session" {
  interface IronSessionData {
    user?: {
      id: number;
      userId: string;
      level: string;
    };
  }
}

export function withAipSession(fn: any) {
  return withIronSessionApiRoute(fn, cookieConfig);
}

export function withSsrSession(handler: any) {
  return withIronSessionSsr(handler, cookieConfig);
}
