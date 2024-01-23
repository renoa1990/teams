import { NextApiRequest, NextApiResponse } from "next/types";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { withAipSession } from "@libs/server/withSession";
import client from "@libs/client";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    body: { id },
    session: { user },
  } = req;
  if (!id) return res.json({ ok: true });

  if (user?.level !== "1")
    return res.json({ ok: true, message: "관리자만 처리할수 있습니다." });

  const check = await client.total.findFirst({
    where: {
      id: +id,
      confirm: false,
    },
  });

  if (check) {
    const confirm = await client.total.update({
      where: {
        id: +id,
      },
      data: {
        confirm: true,
      },
    });
    res.json({ ok: true, confirm });
  } else {
    res.json({ ok: true, message: "이미 처리된 정산입니다" });
  }
}
export default withAipSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);
