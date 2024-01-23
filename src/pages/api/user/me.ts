import { NextApiRequest, NextApiResponse } from "next/types";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { withAipSession } from "@libs/server/withSession";
import client from "@libs/client";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    session: { user },
  } = req;

  if (user) {
    const profile = await client.user.findUnique({
      where: {
        userId: user.userId,
        id: user.id,
        level: user.level,
      },
    });

    if (profile) {
      res.json({
        ok: true,
        profile: {
          id: profile.id,
          userId: profile.userId,
          level: profile.level,
        },
      });
    } else {
      req.session.destroy();
    }
  } else {
    req.session.destroy();
    res.json({
      ok: false,
    });
  }
}

export default withAipSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
