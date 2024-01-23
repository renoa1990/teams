import { NextApiRequest, NextApiResponse } from "next/types";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { withAipSession } from "@libs/server/withSession";
import client from "@libs/client";
import pwencoder from "@libs/server/pwencoder";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    body: {
      data: { userId, password },
    },
  } = req;
  if (!userId || !password) return res.json({ ok: true });

  const check = await client.user.findUnique({
    where: {
      userId: userId,
      password: pwencoder(password),
    },
  });

  if (check) {
    req.session.user = {
      id: check.id,
      userId: check.userId,
      level: check.level,
    };
    await req.session.save();
    res.json({ ok: true, login: true });
  } else {
    res.json({ ok: true, message: "아이디 또는 비밀번호를 확인하세요" });
  }
}
export default withAipSession(
  withHandler({
    methods: ["POST"],
    handler,
    isPrivate: false,
  })
);
