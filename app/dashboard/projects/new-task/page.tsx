import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import NewTaskForm from "./new-task-form";

async function getProjects() {
  return await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });
}

async function getTeamMembers() {
  return await prisma.user.findMany({
    where: {
      role: {
        in: ["ADMIN", "TEAM_MEMBER"],
      },
    },
    orderBy: { name: "asc" },
  });
}

export default async function NewTaskPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const [projects, teamMembers] = await Promise.all([
    getProjects(),
    getTeamMembers(),
  ]);

  return (
    <div className="p-8">
      <h1 className="text-h1 mb-8">Create New Task</h1>
      <NewTaskForm
        projects={projects}
        teamMembers={teamMembers}
        currentUserId={session.user.id}
      />
    </div>
  );
}
