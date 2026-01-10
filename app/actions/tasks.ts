"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { TaskStage } from "@prisma/client";

export async function updateTaskStage(taskId: string, newStage: TaskStage) {
  try {
    await prisma.task.update({
      where: { id: taskId },
      data: { stage: newStage },
    });

    revalidatePath("/dashboard/projects");
    return { success: true };
  } catch (error) {
    console.error("Error updating task stage:", error);
    return { success: false, error: "Failed to update task" };
  }
}

export async function createTask(data: {
  title: string;
  description?: string;
  projectId: string;
  assigneeId?: string;
  createdById: string;
  reviewerId?: string;
  startDate?: Date;
  dueDate?: Date;
}) {
  try {
    const task = await prisma.task.create({
      data: {
        ...data,
        stage: "BACKLOG",
      },
    });

    revalidatePath("/dashboard/projects");
    revalidatePath("/dashboard");
    return { success: true, task };
  } catch (error) {
    console.error("Error creating task:", error);
    return { success: false, error: "Failed to create task" };
  }
}

export async function createProject(data: {
  title: string;
  description?: string;
  createdById: string;
}) {
  try {
    const project = await prisma.project.create({
      data,
    });

    revalidatePath("/dashboard/projects");
    return { success: true, project };
  } catch (error) {
    console.error("Error creating project:", error);
    return { success: false, error: "Failed to create project" };
  }
}
