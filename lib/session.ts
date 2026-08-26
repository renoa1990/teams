import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import {
  getSessionOptions,
  type SessionData,
} from "@/lib/session-options";

export type { SessionData, SessionUser } from "@/lib/session-options";
export { getSessionOptions } from "@/lib/session-options";

export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, getSessionOptions());
}
