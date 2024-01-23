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
      yesterdayTotal,
      confirmMoney,
      withdrawReceipt,
      confirmTotal,
      marginTotal,
      date,
      depositReceipt,
      site,
    },
  } = req;
  if (
    yesterdayTotal === undefined ||
    !confirmMoney.memo ||
    withdrawReceipt === undefined ||
    !confirmTotal.memo ||
    marginTotal === undefined ||
    !date
  )
    return res.json({ ok: true });

  const now = new Date();
  const dateData = new Date(date);
  dateData.setHours(14);

  const check = await client.total.findFirst({
    where: {
      site: site,
      totalAt: dateData,
    },
  });

  if (+now < +dateData) {
    return res.json({
      ok: true,
      message: "미리 정산처리할수 없습니다.",
    });
  }

  if (check) {
    return res.json({
      ok: true,
      message: "해당 날짜는 이미 완료된 정산이 있습니다.",
    });
  }

  const create = Boolean(
    await client.total.create({
      data: {
        site: site,
        yesterDayTotal: +yesterdayTotal,
        todayTotal: +confirmMoney.price,
        solutionTotal: +confirmTotal.price,
        marginTotla: +marginTotal,
        createAt: new Date(),
        totalAt: dateData,
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

  res.json({ ok: true, create });
}
export default withAipSession(
  withHandler({
    methods: ["POST"],
    handler,
    isPrivate: false,
  })
);
