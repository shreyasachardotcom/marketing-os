import { getServerSession } from "next/auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, FileDown, BarChart3, Settings } from "lucide-react";

async function getAdminStats() {
  const [totalUsers, totalTasks, totalProjects, totalRequisitions] =
    await Promise.all([
      prisma.user.count(),
      prisma.task.count(),
      prisma.project.count(),
      prisma.requisition.count(),
    ]);

  const delayedTasks = await prisma.task.count({
    where: {
      label: "DELAYED",
    },
  });

  const tasksByStage = await prisma.task.groupBy({
    by: ["stage"],
    _count: true,
  });

  return {
    totalUsers,
    totalTasks,
    totalProjects,
    totalRequisitions,
    delayedTasks,
    tasksByStage,
  };
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  // Check if user is admin
  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const stats = await getAdminStats();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-h1">Admin Center</h1>
        <p className="mt-2 text-dark-gray">
          Manage users, view analytics, and export data
        </p>
      </div>

      {/* Stats Overview */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-dark-gray">Total Users</p>
                <p className="text-h2 mt-2">{stats.totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-dark-gray">Total Tasks</p>
                <p className="text-h2 mt-2">{stats.totalTasks}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-dark-gray">Delayed Tasks</p>
                <p className="text-h2 mt-2 text-warning">
                  {stats.delayedTasks}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-dark-gray">Requisitions</p>
                <p className="text-h2 mt-2">{stats.totalRequisitions}</p>
              </div>
              <FileDown className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Actions */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* User Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-dark-gray">
              View and manage team members, assign roles
            </p>
            <Link href="/dashboard/admin/users">
              <Button className="w-full">Manage Users</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Export Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileDown className="h-5 w-5" />
              Export Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-dark-gray">
              Export tasks, projects, and requisitions to CSV
            </p>
            <Link href="/dashboard/admin/export">
              <Button className="w-full">Export Data</Button>
            </Link>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Task Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.tasksByStage.map((stage) => (
                <div
                  key={stage.stage}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-dark-gray">
                    {stage.stage.replace("_", " ")}
                  </span>
                  <span className="font-medium">{stage._count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
