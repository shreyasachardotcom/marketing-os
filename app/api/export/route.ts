import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function convertToCSV(data: any[], headers: string[]): string {
  const csvHeaders = headers.join(",");
  const csvRows = data.map((row) =>
    headers.map((header) => {
      const value = row[header];
      // Escape quotes and wrap in quotes if contains comma or quote
      const stringValue = String(value ?? "");
      if (stringValue.includes(",") || stringValue.includes('"')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    }).join(",")
  );

  return [csvHeaders, ...csvRows].join("\n");
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "tasks";
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  const dateFilter =
    startDate && endDate
      ? {
          createdAt: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        }
      : {};

  try {
    let csv = "";

    if (type === "tasks") {
      const tasks = await prisma.task.findMany({
        where: dateFilter,
        include: {
          project: true,
          assignee: true,
          createdBy: true,
          reviewer: true,
        },
      });

      const taskData = tasks.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description || "",
        stage: task.stage,
        label: task.label || "",
        project: task.project.title,
        assignee: task.assignee?.name || "",
        creator: task.createdBy?.name || "",
        reviewer: task.reviewer?.name || "",
        startDate: task.startDate?.toISOString() || "",
        dueDate: task.dueDate?.toISOString() || "",
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.updatedAt.toISOString(),
      }));

      csv = convertToCSV(taskData, [
        "id",
        "title",
        "description",
        "stage",
        "label",
        "project",
        "assignee",
        "creator",
        "reviewer",
        "startDate",
        "dueDate",
        "createdAt",
        "updatedAt",
      ]);
    } else if (type === "projects") {
      const projects = await prisma.project.findMany({
        where: dateFilter,
        include: {
          createdBy: true,
        },
      });

      const projectData = projects.map((project) => ({
        id: project.id,
        title: project.title,
        description: project.description || "",
        createdBy: project.createdBy.name || "",
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString(),
      }));

      csv = convertToCSV(projectData, [
        "id",
        "title",
        "description",
        "createdBy",
        "createdAt",
        "updatedAt",
      ]);
    } else if (type === "requisitions") {
      const requisitions = await prisma.requisition.findMany({
        where: dateFilter,
        include: {
          assignee: true,
        },
      });

      const reqData = requisitions.map((req) => ({
        id: req.id,
        requestorName: req.requestorName,
        requestorEmail: req.requestorEmail,
        department: req.department,
        requirementName: req.requirementName,
        brief: req.brief,
        priority: req.priority,
        stage: req.stage,
        assignee: req.assignee?.name || "",
        etd: req.etd.toISOString(),
        createdAt: req.createdAt.toISOString(),
        updatedAt: req.updatedAt.toISOString(),
      }));

      csv = convertToCSV(reqData, [
        "id",
        "requestorName",
        "requestorEmail",
        "department",
        "requirementName",
        "brief",
        "priority",
        "stage",
        "assignee",
        "etd",
        "createdAt",
        "updatedAt",
      ]);
    }

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${type}-export.csv"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: "Failed to export data" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
