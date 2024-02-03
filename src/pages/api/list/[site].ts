import { NextApiRequest, NextApiResponse } from "next/types";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { withAipSession } from "@libs/server/withSession";
import client from "@libs/client";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { site, page, rowsPerPage },
  } = req;

  const listCount = await client.total.aggregate({
    where: {
      site: site?.toString(),
    },
    orderBy: {
      totalAt: "desc",
    },
    _count: true,
  });

  if (listCount._count > 0) {
    const lastId = await client.total.findFirst({
      where: {
        site: site?.toString(),
      },
      orderBy: {
        totalAt: "desc",
      },
    });
    const list = await client.total.findMany({
      where: {
        site: site?.toString(),
      },
      include: { withdraw: true, deposit: true },
      orderBy: {
        totalAt: "desc",
      },
      take: rowsPerPage ? +rowsPerPage : 30,
      skip: page && rowsPerPage ? +page * +rowsPerPage : 0,
      cursor: { id: lastId?.id },
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
    res.json({ ok: true, list: listWithTotals, listCount });
  } else {
    res.json({ ok: true, list: [], listCount });
  }
}
export default withAipSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
