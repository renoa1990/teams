import Crypto from "crypto";

interface cryptoResponse {
  password: String | any;
  SECRET_KEY: any;
}

export default function pwencoder(password: String | any) {
  return Crypto.pbkdf2Sync(
    password,
    process.env.SECRET_KEY!,
    10,
    64,
    "sha512"
  ).toString("base64");
}
