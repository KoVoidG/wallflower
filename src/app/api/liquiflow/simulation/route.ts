import { NextRequest, NextResponse } from "next/server";
import { DEMO_DEPARTMENTS, DEMO_WORKFLOW_STEPS } from "@/lib/liquiflow-types";
import { runSimulation } from "@/lib/liquiflow-ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const departments = body.departments || DEMO_DEPARTMENTS;
    const workflows = body.workflows || DEMO_WORKFLOW_STEPS;
    const scenario = body.scenario;
    const avgSalaryCostPerHour = body.avgSalaryCostPerHour || 35;
    const isDemoMode = body.isDemoMode || false;

    if (!scenario) {
      return NextResponse.json({ error: "scenario is required" }, { status: 400 });
    }

    const result = await runSimulation(departments, workflows, scenario, avgSalaryCostPerHour, isDemoMode);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Simulation error:", error);
    return NextResponse.json({ error: "Failed to run simulation" }, { status: 500 });
  }
}
