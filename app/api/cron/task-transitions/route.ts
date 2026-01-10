import { NextResponse } from "next/server";
import { autoTransitionTasks, updateTaskLabels } from "@/lib/task-transitions";

export async function GET(request: Request) {
  // Verify the request is authorized (optional, but recommended)
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Run auto-transitions
    const transitionResult = await autoTransitionTasks();

    // Update task labels
    const labelResult = await updateTaskLabels();

    return NextResponse.json({
      success: true,
      transitioned: transitionResult.count || 0,
      labelsUpdated: labelResult.success,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Cron job error:", error);
    return NextResponse.json(
      { error: "Failed to run task transitions" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
