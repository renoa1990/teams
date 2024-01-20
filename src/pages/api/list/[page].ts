import { NextApiRequest, NextApiResponse } from "next/types";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { withAipSession } from "@libs/server/withSession";
import client from "@libs/client";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { page },
  } = req;

  const list = await client.total.findMany({
    include: { withdraw: true, deposit: true },
    orderBy: {
      totalAt: "desc",
    },
  });

  const listWithTotals = list.map((item) => {
    const withdrawCount = item.withdraw.length;
    const withdrawTotal = item.withdraw.reduce(
      (sum, withdrawItem) => sum + withdrawItem.price,
      0
    );

    const depositCount = item.deposit.length;
    const depositTotal = item.deposit.reduce(
      (sum, depositItem) => sum + depositItem.price,
      0
    );

    return {
      ...item,
      withdrawCount,
      withdrawTotal,
      depositCount,
      depositTotal,
    };
  });
  res.json({ ok: true, list: listWithTotals });
}
export default withAipSession(
  withHandler({
    methods: ["GET"],
    handler,
    isPrivate: false,
  })
);
