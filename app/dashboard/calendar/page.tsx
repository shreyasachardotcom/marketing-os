import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import CalendarView from "./calendar-view";

async function getAllTasksWithDueDates() {
  const tasks = await prisma.task.findMany({
    where: {
      dueDate: {
        not: null,
      },
    },
    include: {
      project: true,
      assignee: true,
    },
    orderBy: {
      dueDate: "asc",
    },
  });

  return tasks.map((task) => ({
    id: task.id,
    title: task.title,
    start: task.dueDate!,
    end: task.dueDate!,
    projectTitle: task.project.title,
    assigneeName: task.assignee?.name || "Unassigned",
    stage: task.stage,
    isDelayed: task.dueDate! < new Date() && task.stage !== "DONE",
  }));
}

export default async function CalendarPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const events = await getAllTasksWithDueDates();

  return (
    <div className="h-full p-8">
      <div className="mb-8">
        <h1 className="text-h1">Calendar</h1>
        <p className="mt-2 text-dark-gray">
          Team-wide visibility of all task deadlines
        </p>
      </div>

      <CalendarView events={events} />
    </div>
  );
}
