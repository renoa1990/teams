import { NextApiRequest, NextApiResponse } from "next/types";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { withAipSession } from "@libs/server/withSession";
import client from "@libs/client";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { id },
  } = req;

  if (!id || isNaN(Number(id))) return res.json({ ok: true });

  const data = await client.total.findUnique({
    where: { id: +id },
    include: {
      withdraw: true,
      deposit: true,
    },
  });
  if (data) {
    res.json({ ok: true, data });
  } else {
    res.json({ ok: true, nothing: true });
  }
}
export default withAipSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
