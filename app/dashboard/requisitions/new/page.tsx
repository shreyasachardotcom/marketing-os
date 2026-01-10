"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { createRequisition } from "@/app/actions/requisitions";
import { Priority } from "@prisma/client";

export default function NewRequisitionPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    requestorName: session?.user?.name || "",
    requestorEmail: session?.user?.email || "",
    department: "",
    requirementName: "",
    etd: "",
    brief: "",
    references: "",
    priority: "P2" as Priority,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;

    setIsLoading(true);
    try {
      const result = await createRequisition({
        ...formData,
        etd: new Date(formData.etd),
        createdById: session.user.id,
      });

      if (result.success) {
        router.push("/dashboard/requisitions");
      }
    } catch (error) {
      console.error("Error creating requisition:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-h1 mb-8">Submit New Requisition</h1>

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Requisition Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="requestorName">Requestor Name</Label>
                <Input
                  id="requestorName"
                  value={formData.requestorName}
                  onChange={(e) =>
                    setFormData({ ...formData, requestorName: e.target.value })
                  }
                  required
                  placeholder="Your name"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="requestorEmail">Email ID</Label>
                <Input
                  id="requestorEmail"
                  type="email"
                  value={formData.requestorEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, requestorEmail: e.target.value })
                  }
                  required
                  placeholder="your.email@plum.com"
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="department">Function/Department</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
                required
                placeholder="e.g., Customer Success, HR, Sales"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="requirementName">Requirement Name</Label>
              <Input
                id="requirementName"
                value={formData.requirementName}
                onChange={(e) =>
                  setFormData({ ...formData, requirementName: e.target.value })
                }
                required
                placeholder="Brief title of what you need"
                className="mt-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="etd">ETD (Expected Time of Delivery)</Label>
                <Input
                  id="etd"
                  type="date"
                  value={formData.etd}
                  onChange={(e) =>
                    setFormData({ ...formData, etd: e.target.value })
                  }
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select
                  id="priority"
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      priority: e.target.value as Priority,
                    })
                  }
                  required
                  className="mt-2"
                >
                  <option value="P0">P0 - Critical</option>
                  <option value="P1">P1 - Important</option>
                  <option value="P2">P2 - Important but not urgent</option>
                  <option value="P3">P3 - When time permits</option>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="brief">Brief</Label>
              <Textarea
                id="brief"
                value={formData.brief}
                onChange={(e) =>
                  setFormData({ ...formData, brief: e.target.value })
                }
                required
                placeholder="Detailed requirements - what do you need, why, and any specific details"
                className="mt-2"
                rows={6}
              />
            </div>

            <div>
              <Label htmlFor="references">References</Label>
              <Textarea
                id="references"
                value={formData.references}
                onChange={(e) =>
                  setFormData({ ...formData, references: e.target.value })
                }
                placeholder="Links, examples, attachments (optional)"
                className="mt-2"
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit Requisition"}
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
    </div>
  );
}
