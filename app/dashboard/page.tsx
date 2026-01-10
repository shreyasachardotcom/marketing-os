import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TaskStage } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

async function getUserTasks(userId: string) {
  const tasks = await prisma.task.findMany({
    where: {
      OR: [
        { assigneeId: userId },
        { createdById: userId, stage: "CREATOR_REVIEW" },
        { reviewerId: userId, stage: "REVIEWER_REVIEW" },
      ],
    },
    include: {
      project: true,
      assignee: true,
      creator: true,
      reviewer: true,
    },
    orderBy: {
      dueDate: "asc",
    },
  });

  // Group tasks by stage
  const grouped = {
    BACKLOG: tasks.filter((t) => t.stage === "BACKLOG" && t.assigneeId === userId),
    TODO: tasks.filter((t) => t.stage === "TODO" && t.assigneeId === userId),
    IN_PROGRESS: tasks.filter((t) => t.stage === "IN_PROGRESS" && t.assigneeId === userId),
    WAITING_ON_ME: tasks.filter(
      (t) =>
        (t.stage === "CREATOR_REVIEW" && t.createdById === userId) ||
        (t.stage === "REVIEWER_REVIEW" && t.reviewerId === userId)
    ),
  };

  return grouped;
}

function getTaskLabel(task: any) {
  if (!task.dueDate || task.stage === "DONE") return null;
  const today = new Date();
  const dueDate = new Date(task.dueDate);
  return dueDate >= today ? "ON_TRACK" : "DELAYED";
}

function TaskCard({ task }: { task: any }) {
  const label = getTaskLabel(task);

  return (
    <Link href={`/dashboard/tasks/${task.id}`}>
      <Card className="mb-2 cursor-pointer transition-shadow hover:shadow-md">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-medium">{task.title}</h3>
              <p className="mt-1 text-sm text-dark-gray">{task.project.title}</p>
              {task.dueDate && (
                <p className="mt-1 text-xs text-medium-gray">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </p>
              )}
            </div>
            {label && (
              <Badge variant={label === "ON_TRACK" ? "success" : "destructive"}>
                {label === "ON_TRACK" ? "On Track" : "Delayed"}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const tasks = await getUserTasks(session.user.id);

  return (
    <div className="p-8">
      <h1 className="text-h1 mb-8">My Tasks</h1>

      <div className="space-y-8">
        {/* Backlog */}
        <section>
          <h2 className="text-h2 mb-4">Backlog</h2>
          <p className="mb-4 text-sm text-dark-gray">
            Tasks needing scheduling
          </p>
          {tasks.BACKLOG.length === 0 ? (
            <p className="text-sm text-medium-gray">No tasks in backlog</p>
          ) : (
            <div>
              {tasks.BACKLOG.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </section>

        {/* To Do */}
        <section>
          <h2 className="text-h2 mb-4">To Do</h2>
          <p className="mb-4 text-sm text-dark-gray">
            Scheduled, ready to start
          </p>
          {tasks.TODO.length === 0 ? (
            <p className="text-sm text-medium-gray">No tasks to do</p>
          ) : (
            <div>
              {tasks.TODO.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </section>

        {/* In Progress */}
        <section>
          <h2 className="text-h2 mb-4">In Progress</h2>
          <p className="mb-4 text-sm text-dark-gray">
            Actively working
          </p>
          {tasks.IN_PROGRESS.length === 0 ? (
            <p className="text-sm text-medium-gray">No tasks in progress</p>
          ) : (
            <div>
              {tasks.IN_PROGRESS.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </section>

        {/* Waiting on Me */}
        <section>
          <h2 className="text-h2 mb-4">Waiting on Me</h2>
          <p className="mb-4 text-sm text-dark-gray">
            Tasks needing your review
          </p>
          {tasks.WAITING_ON_ME.length === 0 ? (
            <p className="text-sm text-medium-gray">No tasks waiting on you</p>
          ) : (
            <div>
              {tasks.WAITING_ON_ME.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
