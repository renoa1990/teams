import { pbkdf2Sync } from "crypto";

export function encodePassword(password: string) {
  return pbkdf2Sync(
    password,
    process.env.SECRET_KEY!,
    10,
    64,
    "sha512",
  ).toString("base64");
}
