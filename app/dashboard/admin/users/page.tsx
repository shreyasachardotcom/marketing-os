import { getServerSession } from "next/auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { ArrowLeft, Users } from "lucide-react";
import Link from "next/link";
import UserRoleSelector from "./user-role-selector";

async function getAllUsers() {
  return await prisma.user.findMany({
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
}

export default async function UsersManagementPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const users = await getAllUsers();

  return (
    <div className="p-8">
      <Link
        href="/dashboard/admin"
        className="mb-6 inline-flex items-center text-sm text-dark-gray hover:text-black"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Admin
      </Link>

      <div className="mb-8">
        <h1 className="text-h1">User Management</h1>
        <p className="mt-2 text-dark-gray">
          Manage team members and assign roles
        </p>
      </div>

      <div className="space-y-2">
        {users.map((user) => (
          <Card key={user.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name || "User"}
                      className="h-12 w-12 rounded-full"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-light-gray">
                      <Users className="h-6 w-6 text-medium-gray" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold">
                      {user.name || "Unknown"}
                    </h3>
                    <p className="text-sm text-dark-gray">{user.email}</p>
                    <p className="mt-1 text-xs text-medium-gray">
                      {user.assignedTasks.length} active{" "}
                      {user.assignedTasks.length === 1 ? "task" : "tasks"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <UserRoleSelector userId={user.id} currentRole={user.role} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {users.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-medium-gray" />
            <p className="mt-4 text-medium-gray">No users found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
