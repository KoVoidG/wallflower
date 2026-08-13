import { NextRequest, NextResponse } from "next/server";
import { DEMO_DEPARTMENTS, DEMO_WORKFLOW_STEPS } from "@/lib/liquiflow-types";
import { detectBottlenecks } from "@/lib/liquiflow-ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const departments = body.departments || DEMO_DEPARTMENTS;
    const workflows = body.workflows || DEMO_WORKFLOW_STEPS;
    const avgSalaryCostPerHour = body.avgSalaryCostPerHour || 35;
    const isDemoMode = body.isDemoMode || false;

    const result = await detectBottlenecks(departments, workflows, avgSalaryCostPerHour, isDemoMode);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Bottleneck detection error:", error);
    return NextResponse.json({ error: "Failed to run bottleneck analysis" }, { status: 500 });
  }
}

export async function GET() {
  const result = await detectBottlenecks(DEMO_DEPARTMENTS, DEMO_WORKFLOW_STEPS, 35);
  return NextResponse.json(result);
}
