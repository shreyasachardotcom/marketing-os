"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { RequisitionStage, Priority } from "@prisma/client";

export async function createRequisition(data: {
  requestorName: string;
  requestorEmail: string;
  department: string;
  requirementName: string;
  etd: Date;
  brief: string;
  references?: string;
  priority: Priority;
  assigneeId?: string;
  createdById: string;
}) {
  try {
    const requisition = await prisma.requisition.create({
      data: {
        ...data,
        stage: "NEW",
      },
    });

    revalidatePath("/dashboard/requisitions");
    return { success: true, requisition };
  } catch (error) {
    console.error("Error creating requisition:", error);
    return { success: false, error: "Failed to create requisition" };
  }
}

export async function updateRequisitionStage(
  requisitionId: string,
  newStage: RequisitionStage
) {
  try {
    await prisma.requisition.update({
      where: { id: requisitionId },
      data: { stage: newStage },
    });

    revalidatePath("/dashboard/requisitions");
    return { success: true };
  } catch (error) {
    console.error("Error updating requisition:", error);
    return { success: false, error: "Failed to update requisition" };
  }
}

export async function assignRequisition(
  requisitionId: string,
  assigneeId: string
) {
  try {
    await prisma.requisition.update({
      where: { id: requisitionId },
      data: {
        assigneeId,
        stage: "ASSIGNED",
      },
    });

    revalidatePath("/dashboard/requisitions");
    return { success: true };
  } catch (error) {
    console.error("Error assigning requisition:", error);
    return { success: false, error: "Failed to assign requisition" };
  }
}
