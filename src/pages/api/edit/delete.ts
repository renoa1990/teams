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
  } = req;

  if (!id) return res.json({ ok: true });

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

    const deleteAction = Boolean(
      await client.total.delete({
        where: { id: +id },
      })
    );
    res.json({ ok: true, deleteAction });
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
