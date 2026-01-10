import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

async function getUser(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
  });
}

async function getUserTasks(userId: string) {
  const tasks = await prisma.task.findMany({
    where: {
      assigneeId: userId,
    },
    include: {
      project: true,
      assignee: true,
      createdBy: true,
      reviewer: true,
    },
    orderBy: {
      dueDate: "asc",
    },
  });

  // Group tasks by stage
  const grouped = {
    BACKLOG: tasks.filter((t) => t.stage === "BACKLOG"),
    TODO: tasks.filter((t) => t.stage === "TODO"),
    IN_PROGRESS: tasks.filter((t) => t.stage === "IN_PROGRESS"),
    REVIEW: tasks.filter(
      (t) => t.stage === "CREATOR_REVIEW" || t.stage === "REVIEWER_REVIEW"
    ),
    DONE: tasks.filter((t) => t.stage === "DONE"),
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
              <p className="mt-1 text-sm text-dark-gray">
                {task.project.title}
              </p>
              {task.dueDate && (
                <p className="mt-1 text-xs text-medium-gray">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </p>
              )}
            </div>
            {label && (
              <Badge
                variant={label === "ON_TRACK" ? "success" : "destructive"}
              >
                {label === "ON_TRACK" ? "On Track" : "Delayed"}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default async function UserTasksPage({
  params,
}: {
  params: { userId: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const [user, tasks] = await Promise.all([
    getUser(params.userId),
    getUserTasks(params.userId),
  ]);

  if (!user) {
    redirect("/dashboard/team");
  }

  const totalTasks =
    tasks.BACKLOG.length +
    tasks.TODO.length +
    tasks.IN_PROGRESS.length +
    tasks.REVIEW.length;

  return (
    <div className="p-8">
      <Link
        href="/dashboard/team"
        className="mb-6 inline-flex items-center text-sm text-dark-gray hover:text-black"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Team
      </Link>

      <div className="mb-8 flex items-start gap-4">
        {user.image && (
          <img
            src={user.image}
            alt={user.name || "User"}
            className="h-16 w-16 rounded-full"
          />
        )}
        <div>
          <h1 className="text-h1">{user.name || "Unknown"}</h1>
          <p className="text-dark-gray">{user.email}</p>
          <p className="mt-2 text-sm text-medium-gray">
            {totalTasks} active {totalTasks === 1 ? "task" : "tasks"}
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Backlog */}
        <section>
          <h2 className="text-h2 mb-4">Backlog</h2>
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

        {/* In Review */}
        <section>
          <h2 className="text-h2 mb-4">In Review</h2>
          {tasks.REVIEW.length === 0 ? (
            <p className="text-sm text-medium-gray">No tasks in review</p>
          ) : (
            <div>
              {tasks.REVIEW.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </section>

        {/* Done (Recent) */}
        <section>
          <h2 className="text-h2 mb-4">Recently Completed</h2>
          {tasks.DONE.length === 0 ? (
            <p className="text-sm text-medium-gray">No completed tasks</p>
          ) : (
            <div>
              {tasks.DONE.slice(0, 5).map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
