"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ArrowLeft, Download } from "lucide-react";
import Link from "next/link";

export default function ExportPage() {
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState("tasks");
  const [dateRange, setDateRange] = useState({
    start: "",
    end: "",
  });

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const params = new URLSearchParams({
        type: exportType,
        ...(dateRange.start && { startDate: dateRange.start }),
        ...(dateRange.end && { endDate: dateRange.end }),
      });

      const response = await fetch(`/api/export?${params}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${exportType}-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting data:", error);
    } finally {
      setIsExporting(false);
    }
  };

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
        <h1 className="text-h1">Export Data</h1>
        <p className="mt-2 text-dark-gray">
          Export tasks, projects, and requisitions to CSV format
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Export Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="exportType">Data Type</Label>
            <Select
              id="exportType"
              value={exportType}
              onChange={(e) => setExportType(e.target.value)}
              className="mt-2"
            >
              <option value="tasks">Tasks</option>
              <option value="projects">Projects</option>
              <option value="requisitions">Requisitions</option>
            </Select>
          </div>

          <div>
            <Label>Date Range (Optional)</Label>
            <div className="mt-2 grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate" className="text-xs text-dark-gray">
                  Start Date
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={dateRange.start}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, start: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="endDate" className="text-xs text-dark-gray">
                  End Date
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={dateRange.end}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, end: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          <Button onClick={handleExport} disabled={isExporting} className="w-full">
            <Download className="mr-2 h-4 w-4" />
            {isExporting ? "Exporting..." : "Export to CSV"}
          </Button>

          <div className="rounded-lg bg-light-gray p-4 text-sm text-dark-gray">
            <p className="mb-2 font-medium">Export includes:</p>
            <ul className="ml-4 list-disc space-y-1">
              {exportType === "tasks" && (
                <>
                  <li>Task title, description, stage, label</li>
                  <li>Assignee, creator, reviewer</li>
                  <li>Project, start date, due date</li>
                  <li>Created and updated timestamps</li>
                </>
              )}
              {exportType === "projects" && (
                <>
                  <li>Project title and description</li>
                  <li>Creator information</li>
                  <li>Created and updated timestamps</li>
                </>
              )}
              {exportType === "requisitions" && (
                <>
                  <li>Requestor name, email, department</li>
                  <li>Requirement name, brief, priority</li>
                  <li>ETD, stage, assignee</li>
                  <li>Created and updated timestamps</li>
                </>
              )}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
