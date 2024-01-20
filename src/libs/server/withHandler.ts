import { NextApiRequest, NextApiResponse } from "next/types";
import { NextRequest } from "next/server";

export interface ResponseType {
  ok: boolean;
  [key: string]: any;
}

type method = "GET" | "POST" | "DELETE";

interface ConfigType {
  methods: method[];
  handler: (
    req: NextApiRequest,
    res: NextApiResponse,
    NextRequest: NextRequest
  ) => void;
  isPrivate?: boolean;
}

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

BigInt.prototype.toJSON = function () {
  return this.toString();
};

export default function withHandler({
  methods,
  handler,
  isPrivate = true,
}: ConfigType) {
  return async function (
    req: NextApiRequest,
    res: NextApiResponse,
    NextRequest: NextRequest
  ): Promise<any> {
    if (req.method && !methods.includes(req.method as any)) {
      return res.status(405).end();
    }
    if (isPrivate && !req.session.user) {
      return res.json({ ok: false, error: "Plz log in." });
    }
    try {
      await handler(req, res, NextRequest);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error });
    }
  };
}
