import { NextApiRequest, NextApiResponse } from "next/types";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { withAipSession } from "@libs/server/withSession";
import client from "@libs/client";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const lastMoney = await client.total.findFirst({
    orderBy: {
      totalAt: "desc",
    },
    select: {
      todayTotal: true,
      confirm: true,
    },
  });

  if (lastMoney?.confirm) {
    res.json({ ok: true, lastTotal: lastMoney ? lastMoney.todayTotal : 0 });
  } else {
    res.json({ ok: true, nothing: true });
  }
}
export default withAipSession(
  withHandler({
    methods: ["GET"],
    handler,
    isPrivate: false,
  })
);
