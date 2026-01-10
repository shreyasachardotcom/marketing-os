"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

export async function updateUserRole(userId: string, role: UserRole) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    revalidatePath("/dashboard/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Error updating user role:", error);
    return { success: false, error: "Failed to update user role" };
  }
}
