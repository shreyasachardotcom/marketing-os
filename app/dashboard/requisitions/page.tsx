import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { RequisitionStage, Priority } from "@prisma/client";

async function getRequisitions() {
  return await prisma.requisition.findMany({
    include: {
      assignee: true,
      createdBy: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

function getPriorityColor(priority: Priority) {
  switch (priority) {
    case "P0":
      return "destructive";
    case "P1":
      return "destructive";
    case "P2":
      return "default";
    case "P3":
      return "secondary";
  }
}

function getStageColor(stage: RequisitionStage) {
  switch (stage) {
    case "NEW":
      return "secondary";
    case "ASSIGNED":
      return "default";
    case "IN_REVIEW":
      return "default";
    case "DONE":
      return "success";
  }
}

function RequisitionCard({ requisition }: { requisition: any }) {
  return (
    <Link href={`/dashboard/requisitions/${requisition.id}`}>
      <Card className="cursor-pointer transition-shadow hover:shadow-md">
        <CardContent className="p-4">
          <div className="mb-3 flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold">{requisition.requirementName}</h3>
              <p className="mt-1 text-sm text-dark-gray">
                {requisition.department} • {requisition.requestorName}
              </p>
            </div>
            <div className="flex gap-2">
              <Badge variant={getPriorityColor(requisition.priority)}>
                {requisition.priority}
              </Badge>
              <Badge variant={getStageColor(requisition.stage)}>
                {requisition.stage.replace("_", " ")}
              </Badge>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-medium-gray">
              ETD: {new Date(requisition.etd).toLocaleDateString()}
            </span>
            {requisition.assignee && (
              <span className="text-dark-gray">
                Assigned to: {requisition.assignee.name}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default async function RequisitionsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const requisitions = await getRequisitions();

  // Group by stage
  const grouped = {
    NEW: requisitions.filter((r) => r.stage === "NEW"),
    ASSIGNED: requisitions.filter((r) => r.stage === "ASSIGNED"),
    IN_REVIEW: requisitions.filter((r) => r.stage === "IN_REVIEW"),
    DONE: requisitions.filter((r) => r.stage === "DONE"),
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-h1">Requisitions</h1>
          <p className="mt-2 text-dark-gray">
            Manage work requests from other teams
          </p>
        </div>
        <Link href="/dashboard/requisitions/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Requisition
          </Button>
        </Link>
      </div>

      <div className="space-y-8">
        {/* New */}
        <section>
          <h2 className="text-h2 mb-4">
            New ({grouped.NEW.length})
          </h2>
          {grouped.NEW.length === 0 ? (
            <p className="text-sm text-medium-gray">No new requisitions</p>
          ) : (
            <div className="space-y-2">
              {grouped.NEW.map((req) => (
                <RequisitionCard key={req.id} requisition={req} />
              ))}
            </div>
          )}
        </section>

        {/* Assigned */}
        <section>
          <h2 className="text-h2 mb-4">
            Assigned ({grouped.ASSIGNED.length})
          </h2>
          {grouped.ASSIGNED.length === 0 ? (
            <p className="text-sm text-medium-gray">No assigned requisitions</p>
          ) : (
            <div className="space-y-2">
              {grouped.ASSIGNED.map((req) => (
                <RequisitionCard key={req.id} requisition={req} />
              ))}
            </div>
          )}
        </section>

        {/* In Review */}
        <section>
          <h2 className="text-h2 mb-4">
            In Review ({grouped.IN_REVIEW.length})
          </h2>
          {grouped.IN_REVIEW.length === 0 ? (
            <p className="text-sm text-medium-gray">
              No requisitions in review
            </p>
          ) : (
            <div className="space-y-2">
              {grouped.IN_REVIEW.map((req) => (
                <RequisitionCard key={req.id} requisition={req} />
              ))}
            </div>
          )}
        </section>

        {/* Done */}
        <section>
          <h2 className="text-h2 mb-4">
            Done ({grouped.DONE.length})
          </h2>
          {grouped.DONE.length === 0 ? (
            <p className="text-sm text-medium-gray">No completed requisitions</p>
          ) : (
            <div className="space-y-2">
              {grouped.DONE.slice(0, 10).map((req) => (
                <RequisitionCard key={req.id} requisition={req} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
