import { NextApiRequest, NextApiResponse } from "next/types";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { withAipSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    session: { user },
  } = req;

  req.session.destroy();

  res.json({ ok: true, logout: true });
}
export default withAipSession(
  withHandler({
    methods: ["POST"],
    handler,
    isPrivate: false,
  })
);
