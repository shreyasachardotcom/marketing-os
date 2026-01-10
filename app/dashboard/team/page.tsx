import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Users } from "lucide-react";

async function getTeamMembers() {
  const users = await prisma.user.findMany({
    where: {
      role: {
        in: ["ADMIN", "TEAM_MEMBER"],
      },
    },
    include: {
      assignedTasks: {
        where: {
          stage: {
            not: "DONE",
          },
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    role: user.role,
    activeTasks: user.assignedTasks.length,
  }));
}

export default async function TeamPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const teamMembers = await getTeamMembers();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-h1 mb-2">Team</h1>
        <p className="text-dark-gray">
          View everyone's tasks for full transparency
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {teamMembers.map((member) => (
          <Link key={member.id} href={`/dashboard/team/${member.id}`}>
            <Card className="cursor-pointer transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name || "User"}
                      className="h-12 w-12 rounded-full"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-light-gray">
                      <Users className="h-6 w-6 text-medium-gray" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold">
                      {member.name || "Unknown"}
                    </h3>
                    <p className="text-sm text-dark-gray">{member.email}</p>
                    <p className="mt-2 text-sm text-medium-gray">
                      {member.activeTasks} active{" "}
                      {member.activeTasks === 1 ? "task" : "tasks"}
                    </p>
                    {member.role === "ADMIN" && (
                      <span className="mt-2 inline-block rounded-full bg-primary px-2 py-1 text-xs text-white">
                        Admin
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {teamMembers.length === 0 && (
        <div className="py-12 text-center">
          <Users className="mx-auto h-12 w-12 text-medium-gray" />
          <p className="mt-4 text-medium-gray">No team members found</p>
        </div>
      )}
    </div>
  );
}
