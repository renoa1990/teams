import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { encodePassword } from "@/lib/password";
import { getSession } from "@/lib/session";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const userId = body?.userId as string | undefined;
  const password = body?.password as string | undefined;

  if (!userId || !password) {
    return NextResponse.json({ ok: true });
  }

  const user = await prisma.user.findUnique({
    where: { userId },
  });

  if (!user || user.password !== encodePassword(password)) {
    return NextResponse.json({
      ok: true,
      message: "아이디 또는 비밀번호를 확인하세요",
    });
  }

  const session = await getSession();
  session.user = {
    id: user.id,
    userId: user.userId,
    level: user.level,
  };
  await session.save();

  return NextResponse.json({ ok: true, login: true });
}
