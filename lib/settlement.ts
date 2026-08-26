import { prisma } from "@/lib/prisma";
import { SITE } from "@/lib/sites";

export async function getLastSettlementState() {
  const last = await prisma.total.findFirst({
    where: { site: SITE },
    orderBy: { totalAt: "desc" },
    select: {
      todayTotal: true,
      confirm: true,
      lockedBalance: {
        select: {
          memo: true,
          price: true,
        },
      },
    },
  });

  if (!last) {
    return { blocked: false, yesterdayTotal: 0, lockedBalance: [] };
  }

  if (!last.confirm) {
    return { blocked: true, yesterdayTotal: 0, lockedBalance: [] };
  }

  return {
    blocked: false,
    yesterdayTotal: last.todayTotal,
    lockedBalance: last.lockedBalance.map((item) => ({
      memo: item.memo,
      price: item.price,
    })),
  };
}

export async function getSettlementList(
  page: number,
  rowsPerPage: number,
  withdrawMemo?: string,
) {
  const where = {
    site: SITE,
    ...(withdrawMemo
      ? {
          withdraw: {
            some: { memo: withdrawMemo },
          },
        }
      : {}),
  };

  const [count, rows] = await Promise.all([
    prisma.total.count({ where }),
    prisma.total.findMany({
      where,
      include: {
        withdraw: true,
        deposit: true,
        balance: true,
        lockedBalance: true,
      },
      orderBy: { totalAt: "desc" },
      take: rowsPerPage,
      skip: page * rowsPerPage,
    }),
  ]);

  return {
    count,
    list: rows.map((item) => ({
      ...item,
      withdrawCount: item.withdraw.length,
      withdrawTotal: item.withdraw.reduce((sum, row) => sum + row.price, 0),
      depositCount: item.deposit.length,
      depositTotal: item.deposit.reduce((sum, row) => sum + row.price, 0),
    })),
  };
}

export async function getWithdrawMemos() {
  const rows = await prisma.withdraw.groupBy({
    by: ["memo"],
    where: {
      memo: { not: "" },
      total: { site: SITE },
    },
    orderBy: { memo: "asc" },
  });

  return rows.map((row) => row.memo);
}

export function parseWithdrawMemo(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw?.trim() ?? "";
}

export async function getSettlementById(id: number) {
  return prisma.total.findFirst({
    where: { id, site: SITE },
    include: {
      withdraw: true,
      deposit: true,
      balance: true,
      lockedBalance: true,
    },
  });
}

export function parsePage(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  const page = Number(raw ?? 0);
  return Number.isFinite(page) && page >= 0 ? page : 0;
}

export function parseRowsPerPage(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  const rows = Number(raw ?? 20);
  return [10, 20, 30].includes(rows) ? rows : 20;
}
