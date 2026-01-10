import { prisma } from "./prisma";

/**
 * Auto-transition tasks from BACKLOG to TODO based on start date
 * Tasks transition when current date >= start date
 */
export async function autoTransitionTasks() {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Start of today

  try {
    const result = await prisma.task.updateMany({
      where: {
        stage: "BACKLOG",
        startDate: {
          lte: today,
        },
      },
      data: {
        stage: "TODO",
      },
    });

    return {
      success: true,
      count: result.count,
    };
  } catch (error) {
    console.error("Error auto-transitioning tasks:", error);
    return {
      success: false,
      error: "Failed to auto-transition tasks",
    };
  }
}

/**
 * Update task labels based on due dates
 * ON_TRACK: due date >= current date
 * DELAYED: due date < current date (and not DONE)
 */
export async function updateTaskLabels() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    // Update to ON_TRACK
    await prisma.task.updateMany({
      where: {
        dueDate: {
          gte: today,
        },
        stage: {
          not: "DONE",
        },
      },
      data: {
        label: "ON_TRACK",
      },
    });

    // Update to DELAYED
    await prisma.task.updateMany({
      where: {
        dueDate: {
          lt: today,
        },
        stage: {
          not: "DONE",
        },
      },
      data: {
        label: "DELAYED",
      },
    });

    // Clear labels for completed tasks
    await prisma.task.updateMany({
      where: {
        stage: "DONE",
      },
      data: {
        label: null,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating task labels:", error);
    return { success: false, error: "Failed to update task labels" };
  }
}
