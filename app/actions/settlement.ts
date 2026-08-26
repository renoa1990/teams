"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { isAdmin } from "@/lib/roles";
import { calcMarginTotal, sumReceipts, type ReceiptItem } from "@/lib/calc";
import {
  isFutureSettlementDate,
  isSameSettlementDay,
  parseSettlementDate,
} from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { SITE } from "@/lib/sites";

type ActionResult = { ok: true } | { ok: false; message: string };

function sanitizeReceipts(items: ReceiptItem[] | undefined): ReceiptItem[] {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .filter((item) => item.memo && Number.isFinite(item.price))
    .map((item) => ({
      memo: item.memo,
      price: Math.trunc(item.price),
    }));
}

function sanitizeAmount(value: unknown) {
  const amount = Number(value);
  return Number.isFinite(amount) ? Math.trunc(amount) : 0;
}

function isUniqueConflict(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
}

function revalidateSettlementPages() {
  revalidatePath("/input");
  revalidatePath("/result");
  revalidatePath("/edit");
}

export async function createSettlement(input: {
  date: string;
  solutionTotal: number;
  userHoldings: number;
  balance: ReceiptItem[];
  lockedBalance: ReceiptItem[];
  withdraw: ReceiptItem[];
  deposit: ReceiptItem[];
}): Promise<ActionResult> {
  await requireUser();

  const { date, solutionTotal } = input;
  const userHoldings = sanitizeAmount(input.userHoldings);
  const balance = sanitizeReceipts(input.balance);
  const lockedBalance = sanitizeReceipts(input.lockedBalance);
  const withdraw = sanitizeReceipts(input.withdraw);
  const deposit = sanitizeReceipts(input.deposit);
  const todayTotal = sumReceipts(balance) + sumReceipts(lockedBalance);

  if (
    !date ||
    (balance.length === 0 && lockedBalance.length === 0) ||
    solutionTotal === undefined
  ) {
    return { ok: false, message: "입력값을 확인하세요" };
  }
  const dateData = parseSettlementDate(date);

  if (isFutureSettlementDate(dateData)) {
    return { ok: false, message: "미리 정산처리할수 없습니다." };
  }

  const last = await prisma.total.findFirst({
    where: { site: SITE },
    orderBy: { totalAt: "desc" },
    select: {
      todayTotal: true,
      confirm: true,
      totalAt: true,
    },
  });

  if (last && !last.confirm) {
    return {
      ok: false,
      message: "완료되지 않은 정산이 있습니다. 지난 정산을 확정 후 입력하세요",
    };
  }

  const laterOrSame = await prisma.total.findFirst({
    where: {
      site: SITE,
      totalAt: { gte: dateData },
    },
    orderBy: { totalAt: "asc" },
  });

  if (laterOrSame) {
    if (isSameSettlementDay(laterOrSame.totalAt, dateData)) {
      return { ok: false, message: "해당 날짜에 이미 완료된 정산이 있습니다." };
    }
    return { ok: false, message: "선택한 날짜 이후 완료된 정산이 있습니다" };
  }

  const yesterdayTotal = last?.todayTotal ?? 0;
  const marginTotla = calcMarginTotal({
    yesterdayTotal,
    todayTotal,
    solutionTotal,
    withdraw,
    deposit,
  });

  try {
    await prisma.total.create({
      data: {
        site: SITE,
        yesterDayTotal: Math.trunc(yesterdayTotal),
        todayTotal: Math.trunc(todayTotal),
        solutionTotal: Math.trunc(solutionTotal),
        userHoldings,
        marginTotla,
        createAt: new Date(),
        totalAt: dateData,
        withdraw:
          withdraw.length > 0
            ? { createMany: { data: withdraw } }
            : undefined,
        deposit:
          deposit.length > 0
            ? { createMany: { data: deposit } }
            : undefined,
        balance:
          balance.length > 0
            ? { createMany: { data: balance } }
            : undefined,
        lockedBalance:
          lockedBalance.length > 0
            ? { createMany: { data: lockedBalance } }
            : undefined,
      },
    });
  } catch (error) {
    if (isUniqueConflict(error)) {
      return { ok: false, message: "해당 날짜에 이미 완료된 정산이 있습니다." };
    }
    throw error;
  }

  revalidateSettlementPages();
  return { ok: true };
}

export async function updateSettlement(input: {
  id: number;
  solutionTotal: number;
  userHoldings: number;
  balance: ReceiptItem[];
  lockedBalance: ReceiptItem[];
  withdraw: ReceiptItem[];
  deposit: ReceiptItem[];
}): Promise<ActionResult> {
  await requireUser();

  const existing = await prisma.total.findFirst({
    where: { id: input.id, site: SITE },
  });

  if (!existing) {
    return { ok: false, message: "저장에 실패했습니다" };
  }

  if (existing.confirm) {
    return { ok: false, message: "확정된 정산은 수정할 수 없습니다" };
  }

  const userHoldings = sanitizeAmount(input.userHoldings);
  const balance = sanitizeReceipts(input.balance);
  const lockedBalance = sanitizeReceipts(input.lockedBalance);
  const withdraw = sanitizeReceipts(input.withdraw);
  const deposit = sanitizeReceipts(input.deposit);
  const todayTotal = sumReceipts(balance) + sumReceipts(lockedBalance);

  if (balance.length === 0 && lockedBalance.length === 0) {
    return { ok: false, message: "현잔고를 입력하세요" };
  }

  const marginTotla = calcMarginTotal({
    yesterdayTotal: existing.yesterDayTotal,
    todayTotal,
    solutionTotal: input.solutionTotal,
    withdraw,
    deposit,
  });

  await prisma.$transaction(async (tx) => {
    await tx.withdraw.deleteMany({ where: { totalId: input.id } });
    await tx.deposit.deleteMany({ where: { totalId: input.id } });
    await tx.balance.deleteMany({ where: { totalId: input.id } });
    await tx.lockedBalance.deleteMany({ where: { totalId: input.id } });
    await tx.total.update({
      where: { id: input.id },
      data: {
        todayTotal: Math.trunc(todayTotal),
        solutionTotal: Math.trunc(input.solutionTotal),
        userHoldings,
        marginTotla,
        withdraw:
          withdraw.length > 0
            ? { createMany: { data: withdraw } }
            : undefined,
        deposit:
          deposit.length > 0
            ? { createMany: { data: deposit } }
            : undefined,
        balance:
          balance.length > 0
            ? { createMany: { data: balance } }
            : undefined,
        lockedBalance:
          lockedBalance.length > 0
            ? { createMany: { data: lockedBalance } }
            : undefined,
      },
    });
  });

  revalidateSettlementPages();
  revalidatePath(`/edit/${input.id}`);
  return { ok: true };
}

export async function deleteSettlement(id: number): Promise<ActionResult> {
  await requireUser();

  const existing = await prisma.total.findFirst({
    where: { id, site: SITE },
  });

  if (!existing) {
    return { ok: false, message: "삭제에 실패했습니다" };
  }

  if (existing.confirm) {
    return { ok: false, message: "확정된 정산은 삭제할 수 없습니다" };
  }

  await prisma.$transaction(async (tx) => {
    await tx.withdraw.deleteMany({ where: { totalId: id } });
    await tx.deposit.deleteMany({ where: { totalId: id } });
    await tx.balance.deleteMany({ where: { totalId: id } });
    await tx.lockedBalance.deleteMany({ where: { totalId: id } });
    await tx.total.delete({ where: { id } });
  });

  revalidateSettlementPages();
  return { ok: true };
}

export async function confirmSettlement(id: number): Promise<ActionResult> {
  const user = await requireUser();

  if (!isAdmin(user.level)) {
    return { ok: false, message: "관리자만 처리할수 있습니다." };
  }

  const existing = await prisma.total.findFirst({
    where: { id, confirm: false, site: SITE },
  });

  if (!existing) {
    return { ok: false, message: "이미 처리된 정산입니다" };
  }

  await prisma.total.update({
    where: { id },
    data: { confirm: true },
  });

  revalidateSettlementPages();
  return { ok: true };
}
