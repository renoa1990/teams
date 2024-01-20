import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";

const cookieConfig = {
  cookieName: "TeamLX",
  password: process.env.COOKIE_PASSWORD!,
  cookieOptions: {
    maxAge: undefined,
  },
};
declare module "iron-session" {
  interface IronSessionData {
    user?: {
      id: number;
      userId: string;
      role: string;
      lv: string;
      TTXD: string;
      nickName: string;
    };
  }
}

export function withAipSession(fn: any) {
  return withIronSessionApiRoute(fn, cookieConfig);
}

export function withSsrSession(handler: any) {
  return withIronSessionSsr(handler, cookieConfig);
}
