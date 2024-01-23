import { NextApiRequest, NextApiResponse } from "next/types";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { withAipSession } from "@libs/server/withSession";
import client from "@libs/client";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    body: {
      id,
      confirmMoney,
      withdrawReceipt,
      confirmTotal,
      marginTotal,
      depositReceipt,
    },
  } = req;

  if (
    !id ||
    !confirmMoney.memo ||
    !withdrawReceipt ||
    !confirmTotal.memo ||
    marginTotal === undefined ||
    !depositReceipt
  )
    return res.json({ ok: true });

  const check = await client.total.findFirst({
    where: {
      id: +id,
    },
  });

  if (check) {
    const reset = await client.total.update({
      where: {
        id: +id,
      },
      data: {
        withdraw: {
          deleteMany: {},
        },
        deposit: {
          deleteMany: {},
        },
      },
    });

    const update = Boolean(
      await client.total.update({
        where: { id: +id },
        data: {
          todayTotal: +confirmMoney.price,
          solutionTotal: +confirmTotal.price,
          marginTotla: +marginTotal,
          withdraw:
            withdrawReceipt.length > 0
              ? {
                  createMany: {
                    data: withdrawReceipt.map(
                      (item: { memo: string; price: number }) => ({
                        memo: item.memo,
                        price: +item.price,
                      })
                    ),
                  },
                }
              : undefined,
          deposit:
            depositReceipt.length > 0
              ? {
                  createMany: {
                    data: depositReceipt.map(
                      (item: { memo: string; price: number }) => ({
                        memo: item.memo,
                        price: +item.price,
                      })
                    ),
                  },
                }
              : undefined,
        },
      })
    );
    res.json({ ok: true, update });
  } else {
    res.json({ ok: true, nothing: true });
  }
}
export default withAipSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);
