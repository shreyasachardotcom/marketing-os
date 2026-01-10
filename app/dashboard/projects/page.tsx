import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { KanbanBoard } from "@/components/kanban/kanban-board";
import { updateTaskStage } from "@/app/actions/tasks";
import { TaskStage } from "@prisma/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

async function getAllTasks() {
  const tasks = await prisma.task.findMany({
    where: {
      parentId: null, // Only top-level tasks, not subtasks
    },
    include: {
      project: true,
      assignee: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return tasks;
}

async function handleTaskMove(taskId: string, newStage: TaskStage) {
  "use server";
  await updateTaskStage(taskId, newStage);
}

export default async function ProjectsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const tasks = await getAllTasks();

  return (
    <div className="h-full p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-h1">Projects</h1>
          <p className="mt-2 text-dark-gray">
            Manage all tasks across projects
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/projects/new-task">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Button>
          </Link>
          <Link href="/dashboard/projects/new-project">
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </Link>
        </div>
      </div>

      <KanbanBoard initialTasks={tasks} onTaskMove={handleTaskMove} />
    </div>
  );
}
