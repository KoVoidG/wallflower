import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/guards";
import { prisma } from "@/db/prisma";

export async function GET() {
  try {
    const session = await requireAuth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let business;
    try {
      business = await prisma.business.findUnique({
        where: { userId: session.user.id },
        include: {
          financialSnapshots: {
            orderBy: { month: "desc" },
            take: 1
          }
        }
      });
    } catch (dbError) {
      console.warn("[Liquiflow Sync] Database unavailable, returning fallback mock data.");
      return NextResponse.json({
        success: true,
        isMockData: true,
        orgName: "Mock Wallflower Business (DB Offline)",
        departments: [
          { id: "mock-dept-1", name: "Operations", headcount: 10, avgTasksPerWeek: 150, avgResponseTimeHours: 4, pendingApprovals: 5, overdueItems: 1, meetingsPerWeek: 3 },
          { id: "mock-dept-2", name: "Finance", headcount: 5, avgTasksPerWeek: 80, avgResponseTimeHours: 8, pendingApprovals: 12, overdueItems: 3, meetingsPerWeek: 5 },
        ],
        workflows: [
          { id: "mock-wf-1", name: "Service Delivery", department: "Operations", avgDurationHours: 24, errorRate: 0.05, volume: 100 },
          { id: "mock-wf-2", name: "Invoice Processing", department: "Finance", avgDurationHours: 72, errorRate: 0.15, volume: 30 }
        ]
      });
    }

    if (!business) {
      return NextResponse.json({ error: "No business profile found" }, { status: 404 });
    }

    const latestSnapshot = business.financialSnapshots?.[0];

    // Data Bridge: Translate Wallflower Financials -> Liquiflow Operations
    const expenseCategories = latestSnapshot ? (latestSnapshot.expenseCategories as Record<string, string>) : {};
    const salaryExpense = parseFloat(expenseCategories?.salary || expenseCategories?.payroll || "0");
    
    // Estimate total headcount from salary expense (assuming ~25k THB avg monthly salary for SME)
    let totalHeadcount = salaryExpense > 0 ? Math.max(1, Math.round(salaryExpense / 25000)) : 5;

    // Distribute headcount to standard departments based on business industry/type
    const departments = [];
    const workflows = [];

    if (business.industry === "food_and_beverage") {
      departments.push(
        { id: "dept-1", name: "Front of House (Service)", headcount: Math.max(1, Math.floor(totalHeadcount * 0.4)), avgTasksPerWeek: 300, avgResponseTimeHours: 0.1, pendingApprovals: 0, overdueItems: 0, meetingsPerWeek: 2 },
        { id: "dept-2", name: "Back of House (Kitchen)", headcount: Math.max(1, Math.floor(totalHeadcount * 0.4)), avgTasksPerWeek: 200, avgResponseTimeHours: 0.2, pendingApprovals: 0, overdueItems: 0, meetingsPerWeek: 1 },
        { id: "dept-3", name: "Management & Admin", headcount: Math.max(1, totalHeadcount - Math.floor(totalHeadcount * 0.8)), avgTasksPerWeek: 40, avgResponseTimeHours: 4, pendingApprovals: 5, overdueItems: 1, meetingsPerWeek: 3 }
      );
      workflows.push(
        { id: "wf-1", name: "Order Fulfillment", department: "Front of House (Service)", avgDurationHours: 0.2, errorRate: 0.02, volume: 300 },
        { id: "wf-2", name: "Food Preparation", department: "Back of House (Kitchen)", avgDurationHours: 0.3, errorRate: 0.05, volume: 200 },
        { id: "wf-3", name: "Inventory Reordering", department: "Management & Admin", avgDurationHours: 2, errorRate: 0.01, volume: 10 }
      );
    } else {
      // Generic fallback for other industries
      departments.push(
        { id: "dept-1", name: "Operations / Delivery", headcount: Math.max(1, Math.floor(totalHeadcount * 0.5)), avgTasksPerWeek: 150, avgResponseTimeHours: 4, pendingApprovals: 10, overdueItems: 2, meetingsPerWeek: 4 },
        { id: "dept-2", name: "Sales & Marketing", headcount: Math.max(1, Math.floor(totalHeadcount * 0.3)), avgTasksPerWeek: 80, avgResponseTimeHours: 2, pendingApprovals: 2, overdueItems: 0, meetingsPerWeek: 5 },
        { id: "dept-3", name: "Admin & Finance", headcount: Math.max(1, totalHeadcount - Math.floor(totalHeadcount * 0.8)), avgTasksPerWeek: 50, avgResponseTimeHours: 8, pendingApprovals: 8, overdueItems: 1, meetingsPerWeek: 3 }
      );
      workflows.push(
        { id: "wf-1", name: "Service Delivery", department: "Operations / Delivery", avgDurationHours: 24, errorRate: 0.05, volume: 100 },
        { id: "wf-2", name: "Lead Follow-up", department: "Sales & Marketing", avgDurationHours: 4, errorRate: 0.1, volume: 50 },
        { id: "wf-3", name: "Invoice Processing", department: "Admin & Finance", avgDurationHours: 48, errorRate: 0.02, volume: 20 }
      );
    }

    return NextResponse.json({
      success: true,
      orgName: business.name,
      departments,
      workflows
    });

  } catch (error: any) {
    console.error("[Liquiflow Sync Error]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
