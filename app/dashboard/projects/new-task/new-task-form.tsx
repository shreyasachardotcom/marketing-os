"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { createTask } from "@/app/actions/tasks";

type Project = {
  id: string;
  title: string;
};

type User = {
  id: string;
  name: string | null;
  email: string;
};

type Props = {
  projects: Project[];
  teamMembers: User[];
  currentUserId: string;
};

export default function NewTaskForm({
  projects,
  teamMembers,
  currentUserId,
}: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectId: "",
    assigneeId: "",
    reviewerId: "",
    startDate: "",
    dueDate: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await createTask({
        title: formData.title,
        description: formData.description,
        projectId: formData.projectId,
        assigneeId: formData.assigneeId || undefined,
        reviewerId: formData.reviewerId || undefined,
        createdById: currentUserId,
        startDate: formData.startDate ? new Date(formData.startDate) : undefined,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
      });

      if (result.success) {
        router.push("/dashboard/projects");
      }
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Task Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              placeholder="Enter task title"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Enter task description (optional)"
              className="mt-2"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="projectId">Project</Label>
            <Select
              id="projectId"
              value={formData.projectId}
              onChange={(e) =>
                setFormData({ ...formData, projectId: e.target.value })
              }
              required
              className="mt-2"
            >
              <option value="">Select a project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.title}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="assigneeId">Assignee</Label>
              <Select
                id="assigneeId"
                value={formData.assigneeId}
                onChange={(e) =>
                  setFormData({ ...formData, assigneeId: e.target.value })
                }
                className="mt-2"
              >
                <option value="">Select assignee (optional)</option>
                {teamMembers.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name || member.email}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="reviewerId">Reviewer</Label>
              <Select
                id="reviewerId"
                value={formData.reviewerId}
                onChange={(e) =>
                  setFormData({ ...formData, reviewerId: e.target.value })
                }
                className="mt-2"
              >
                <option value="">Select reviewer (optional)</option>
                {teamMembers.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name || member.email}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
                className="mt-2"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Task"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
