import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function getCurrentUser() {
  const session = await getSession();
  if (!session.user) {
    return null;
  }

  const user = await prisma.user.findFirst({
    where: {
      id: session.user.id,
      userId: session.user.userId,
      level: session.user.level,
    },
    select: {
      id: true,
      userId: true,
      level: true,
    },
  });

  if (!user) {
    session.destroy();
    return null;
  }

  return user;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/");
  }
  return user;
}
