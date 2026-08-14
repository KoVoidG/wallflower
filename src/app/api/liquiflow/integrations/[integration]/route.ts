import { NextRequest, NextResponse } from "next/server";
import type { Department, WorkflowStep } from "@/lib/liquiflow-types";

// ─────────────────────────────────────────────────────────────────────────────
// Shared Notion helpers
// ─────────────────────────────────────────────────────────────────────────────

function richText(arr: Array<{ plain_text?: string }> | undefined): string {
  return (arr ?? []).map((t) => t.plain_text ?? "").join("").trim();
}

function numProp(
  prop: { type: string; number?: number | null } | undefined
): number | null {
  if (!prop || prop.type !== "number") return null;
  return prop.number ?? null;
}

function selectProp(
  prop:
    | {
        type: string;
        select?: { name?: string } | null;
        status?: { name?: string } | null;
      }
    | undefined
): string | null {
  if (!prop) return null;
  if (prop.type === "select") return prop.select?.name ?? null;
  if (prop.type === "status") return prop.status?.name ?? null;
  return null;
}

type NotionPropertyValue =
  | { type: "title"; title: Array<{ plain_text?: string }> }
  | { type: "rich_text"; rich_text: Array<{ plain_text?: string }> }
  | { type: "number"; number: number | null }
  | { type: "select"; select: { name: string } | null }
  | { type: "status"; status: { name: string } | null }
  | { type: string; [key: string]: unknown };

interface NotionPage {
  id: string;
  properties: Record<string, NotionPropertyValue>;
}

interface NotionDatabase {
  id: string;
  title: Array<{ plain_text?: string }>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Handler: Linear
// ─────────────────────────────────────────────────────────────────────────────

async function handleLinear(body: Record<string, string>) {
  const { token } = body;
  if (!token) {
    return NextResponse.json(
      { error: "Missing required field: token" },
      { status: 400 }
    );
  }

  const LINEAR_API = "https://api.linear.app/graphql";
  const TEAMS_QUERY = `
    query {
      teams {
        nodes {
          id name key
          members { nodes { id } }
          issues(first: 250, orderBy: updatedAt) {
            nodes {
              id title
              state { name type }
              priority createdAt completedAt canceledAt
              cycle { id name }
              labels { nodes { name } }
            }
          }
        }
      }
      viewer { organization { name } }
    }
  `;

  const res = await fetch(LINEAR_API, {
    method: "POST",
    headers: { Authorization: token, "Content-Type": "application/json" },
    body: JSON.stringify({ query: TEAMS_QUERY }),
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json(
      { error: `Linear API error (${res.status}): ${text.slice(0, 200)}` },
      { status: res.status }
    );
  }

  const json = await res.json();
  if (json.errors) {
    return NextResponse.json(
      { error: json.errors[0]?.message ?? "Linear GraphQL error" },
      { status: 400 }
    );
  }

  const teams = json.data?.teams?.nodes ?? [];
  const orgName: string =
    json.data?.viewer?.organization?.name ?? "My Organization";

  if (teams.length === 0) {
    return NextResponse.json(
      { error: "No teams found in this Linear workspace." },
      { status: 404 }
    );
  }

  const departments: Department[] = [];
  const workflows: WorkflowStep[] = [];

  for (const team of teams) {
    const issues = team.issues?.nodes ?? [];
    const memberCount = team.members?.nodes?.length ?? 1;

    const completed = issues.filter(
      (i: { state: { type: string } }) => i.state?.type === "completed"
    );
    const inProgress = issues.filter(
      (i: { state: { type: string } }) => i.state?.type === "started"
    );
    const cancelled = issues.filter(
      (i: { state: { type: string } }) => i.state?.type === "cancelled"
    );

    const durations: number[] = completed
      .filter(
        (i: { completedAt: string | null; createdAt: string }) =>
          i.completedAt && i.createdAt
      )
      .map((i: { completedAt: string; createdAt: string }) => {
        const ms =
          new Date(i.completedAt).getTime() - new Date(i.createdAt).getTime();
        return ms / (1000 * 60 * 60);
      })
      .filter((h: number) => h > 0 && h < 10000);

    const avgDuration =
      durations.length > 0
        ? parseFloat(
            (
              durations.reduce((s: number, d: number) => s + d, 0) /
              durations.length
            ).toFixed(1)
          )
        : 24;

    const totalIssues = issues.length;
    const weeklyVolume = Math.max(1, Math.round(totalIssues / 4));
    const errorRate =
      totalIssues > 0
        ? parseFloat(
            Math.min(0.5, cancelled.length / totalIssues).toFixed(2)
          )
        : 0.05;
    const highPriority = issues.filter(
      (i: { priority: number; state: { type: string } }) =>
        i.priority <= 2 && i.state?.type !== "completed"
    ).length;

    departments.push({
      id: `linear-dept-${team.id}`,
      name: team.name,
      headcount: memberCount,
      avgTasksPerWeek: weeklyVolume,
      avgResponseTimeHours: avgDuration,
      pendingApprovals: highPriority,
      overdueItems: Math.round(inProgress.length * 0.2),
      meetingsPerWeek: Math.max(2, Math.round(memberCount * 0.8)),
    });

    const cycleGroups = new Map<string, typeof issues>();
    for (const issue of issues) {
      const key = issue.cycle?.name ?? "General Backlog";
      if (!cycleGroups.has(key)) cycleGroups.set(key, []);
      cycleGroups.get(key)!.push(issue);
    }

    let wfIdx = 0;
    for (const [cycleName, cycleIssues] of cycleGroups) {
      if (wfIdx >= 5) break;
      const cDone = cycleIssues.filter(
        (i: { state: { type: string } }) => i.state?.type === "completed"
      );
      const cCancelled = cycleIssues.filter(
        (i: { state: { type: string } }) => i.state?.type === "cancelled"
      );
      const cDurations: number[] = cDone
        .filter(
          (i: { completedAt: string | null; createdAt: string }) =>
            i.completedAt
        )
        .map((i: { completedAt: string; createdAt: string }) => {
          const ms =
            new Date(i.completedAt).getTime() -
            new Date(i.createdAt).getTime();
          return ms / (1000 * 60 * 60);
        })
        .filter((h: number) => h > 0 && h < 10000);

      const cAvgDuration =
        cDurations.length > 0
          ? parseFloat(
              (
                cDurations.reduce((s: number, d: number) => s + d, 0) /
                cDurations.length
              ).toFixed(1)
            )
          : 24;
      const cErrorRate =
        cycleIssues.length > 0
          ? parseFloat(
              Math.min(0.5, cCancelled.length / cycleIssues.length).toFixed(2)
            )
          : 0.05;

      workflows.push({
        id: `linear-wf-${team.id}-${wfIdx}`,
        name: `${team.name}: ${cycleName}`,
        department: team.name,
        avgDurationHours: cAvgDuration,
        errorRate: cErrorRate,
        volume: Math.max(1, Math.round(cycleIssues.length / 4)),
      });
      wfIdx++;
    }

    if (wfIdx === 0) {
      workflows.push({
        id: `linear-wf-${team.id}-0`,
        name: `${team.name}: Issues`,
        department: team.name,
        avgDurationHours: avgDuration,
        errorRate,
        volume: weeklyVolume,
      });
    }
  }

  return NextResponse.json({
    departments,
    workflows,
    orgName,
    meta: {
      teamCount: teams.length,
      totalIssues: teams.reduce(
        (s: number, t: { issues: { nodes: unknown[] } }) =>
          s + (t.issues?.nodes?.length ?? 0),
        0
      ),
    },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Handler: Jira
// ─────────────────────────────────────────────────────────────────────────────

async function handleJira(body: Record<string, string>) {
  const { token, email, domain } = body;
  if (!token || !email || !domain) {
    return NextResponse.json(
      { error: "Missing required fields: token, email, domain" },
      { status: 400 }
    );
  }

  interface JiraProject {
    id: string;
    key: string;
    name: string;
    projectTypeKey: string;
  }
  interface JiraIssue {
    fields: {
      project: { name: string; key: string };
      issuetype: { name: string };
      status: { statusCategory: { name: string } };
      resolutiondate: string | null;
      created: string;
    };
  }
  interface JiraSearchResult {
    total: number;
    issues: JiraIssue[];
  }

  const baseUrl = `https://${domain
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "")}`;
  const auth = Buffer.from(`${email}:${token}`).toString("base64");
  const headers = {
    Authorization: `Basic ${auth}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const projectsRes = await fetch(
    `${baseUrl}/rest/api/3/project/search?maxResults=50`,
    { headers }
  );
  if (!projectsRes.ok) {
    const text = await projectsRes.text();
    return NextResponse.json(
      {
        error: `Jira API error (${projectsRes.status}): ${text.slice(0, 200)}`,
      },
      { status: projectsRes.status }
    );
  }

  const projectsData = await projectsRes.json();
  const projects: JiraProject[] = projectsData.values || [];
  if (projects.length === 0) {
    return NextResponse.json(
      { error: "No projects found in this Jira workspace." },
      { status: 404 }
    );
  }

  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  const projectStats: Record<
    string,
    { total: number; bugs: number; done: number; durations: number[] }
  > = {};

  const jql = `project in (${projects.map((p) => p.key).join(",")}) AND created >= "${ninetyDaysAgo}" ORDER BY created DESC`;
  const issuesRes = await fetch(
    `${baseUrl}/rest/api/3/search?jql=${encodeURIComponent(jql)}&maxResults=200&fields=project,issuetype,status,resolutiondate,created`,
    { headers }
  );

  if (issuesRes.ok) {
    const issuesData: JiraSearchResult = await issuesRes.json();
    for (const issue of issuesData.issues) {
      const projectName = issue.fields.project.name;
      if (!projectStats[projectName]) {
        projectStats[projectName] = {
          total: 0,
          bugs: 0,
          done: 0,
          durations: [],
        };
      }
      projectStats[projectName].total++;
      const type = issue.fields.issuetype?.name?.toLowerCase() ?? "";
      if (type.includes("bug") || type.includes("defect")) {
        projectStats[projectName].bugs++;
      }
      if (issue.fields.status?.statusCategory?.name === "Done") {
        projectStats[projectName].done++;
        if (issue.fields.resolutiondate && issue.fields.created) {
          const durationHours =
            (new Date(issue.fields.resolutiondate).getTime() -
              new Date(issue.fields.created).getTime()) /
            (1000 * 60 * 60);
          if (durationHours > 0 && durationHours < 10000) {
            projectStats[projectName].durations.push(durationHours);
          }
        }
      }
    }
  }

  const typeGroups: Record<string, JiraProject[]> = {};
  for (const p of projects) {
    const type = p.projectTypeKey || "software";
    if (!typeGroups[type]) typeGroups[type] = [];
    typeGroups[type].push(p);
  }

  const departments: Department[] = Object.entries(typeGroups).map(
    ([type, projs], i) => {
      const totalIssues = projs.reduce(
        (s, p) => s + (projectStats[p.name]?.total ?? 0),
        0
      );
      const deptHeadcount = Math.max(3, Math.round(projs.length * 4));
      const tasksPerWeek = Math.max(5, Math.round(totalIssues / 12.8));
      const allDurations = projs.flatMap(
        (p) => projectStats[p.name]?.durations ?? []
      );
      const avgResponseHours =
        allDurations.length > 0
          ? parseFloat(
              (
                allDurations.reduce((s, d) => s + d, 0) / allDurations.length
              ).toFixed(1)
            )
          : 12;
      const pendingCount = projs.reduce((s, p) => {
        const stats = projectStats[p.name];
        return s + (stats ? stats.total - stats.done : 0);
      }, 0);
      return {
        id: `jira-dept-${i + 1}`,
        name:
          type.charAt(0).toUpperCase() + type.slice(1) + " Projects",
        headcount: deptHeadcount,
        avgTasksPerWeek: tasksPerWeek,
        avgResponseTimeHours: avgResponseHours,
        pendingApprovals: Math.round(pendingCount * 0.3),
        overdueItems: Math.round(pendingCount * 0.1),
        meetingsPerWeek: Math.max(3, Math.round(projs.length * 1.5)),
      };
    }
  );

  const workflows: WorkflowStep[] = projects.slice(0, 20).map(
    (project, i) => {
      const stats = projectStats[project.name];
      const total = stats?.total ?? 0;
      const bugs = stats?.bugs ?? 0;
      const durations = stats?.durations ?? [];
      const avgDuration =
        durations.length > 0
          ? parseFloat(
              (durations.reduce((s, d) => s + d, 0) / durations.length).toFixed(
                1
              )
            )
          : 24;
      const errorRate =
        total > 0
          ? parseFloat(Math.min(0.5, bugs / total).toFixed(2))
          : 0.05;
      const volume = Math.max(1, Math.round(total / 12.8));
      const type = project.projectTypeKey || "software";
      const deptName =
        type.charAt(0).toUpperCase() + type.slice(1) + " Projects";
      return {
        id: `jira-wf-${i + 1}`,
        name: project.name,
        department: deptName,
        avgDurationHours: avgDuration,
        errorRate,
        volume,
      };
    }
  );

  return NextResponse.json({
    departments,
    workflows,
    orgName:
      domain.split(".")[0].charAt(0).toUpperCase() +
      domain.split(".")[0].slice(1),
    meta: {
      projectCount: projects.length,
      issueCount: Object.values(projectStats).reduce(
        (s, p) => s + p.total,
        0
      ),
    },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Handler: Notion
// ─────────────────────────────────────────────────────────────────────────────

async function handleNotion(body: Record<string, string>) {
  const { token, databaseId } = body;
  if (!token) {
    return NextResponse.json(
      { error: "Missing required field: token" },
      { status: 400 }
    );
  }

  const NOTION_API = "https://api.notion.com/v1";
  const headers = {
    Authorization: `Bearer ${token}`,
    "Notion-Version": "2022-06-28",
    "Content-Type": "application/json",
  };

  let departments: Department[] = [];
  let workflows: WorkflowStep[] = [];
  let orgName = "Notion Workspace";

  if (databaseId) {
    const dbRes = await fetch(`${NOTION_API}/databases/${databaseId}`, {
      headers,
    });
    if (!dbRes.ok) {
      const text = await dbRes.text();
      return NextResponse.json(
        {
          error: `Notion API error (${dbRes.status}): ${text.slice(0, 200)}`,
        },
        { status: dbRes.status }
      );
    }
    const db: NotionDatabase = await dbRes.json();
    orgName = richText(db.title) || "Notion Workspace";

    const pagesRes = await fetch(
      `${NOTION_API}/databases/${databaseId}/query`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ page_size: 100 }),
      }
    );
    if (!pagesRes.ok) {
      const text = await pagesRes.text();
      return NextResponse.json(
        {
          error: `Notion query error (${pagesRes.status}): ${text.slice(
            0,
            200
          )}`,
        },
        { status: pagesRes.status }
      );
    }

    const pagesData = await pagesRes.json();
    const pages: NotionPage[] = pagesData.results ?? [];

    if (pages.length === 0) {
      return NextResponse.json(
        { error: "No rows found in this Notion database." },
        { status: 404 }
      );
    }

    const firstPage = pages[0];
    const propNames = Object.keys(firstPage.properties).map((k) =>
      k.toLowerCase()
    );
    const hasDeptFields = propNames.some(
      (n) => n.includes("team") || n.includes("department")
    );
    const hasWfFields = propNames.some(
      (n) =>
        n.includes("workflow") || n.includes("process") || n.includes("duration")
    );

    if (hasDeptFields || (!hasWfFields && !hasDeptFields)) {
      departments = pages.map((page, i) => {
        const props = page.properties;
        const nameKey =
          Object.keys(props).find((k) =>
            ["name", "title", "team", "department", "dept"].includes(
              k.toLowerCase()
            )
          ) ?? Object.keys(props)[0];
        const nameVal = props[nameKey];
        const name =
          nameVal?.type === "title"
            ? richText(
                (nameVal as { type: "title"; title: Array<{ plain_text?: string }> })
                  .title
              )
            : nameVal?.type === "rich_text"
            ? richText(
                (
                  nameVal as {
                    type: "rich_text";
                    rich_text: Array<{ plain_text?: string }>;
                  }
                ).rich_text
              )
            : `Department ${i + 1}`;

        const headcountKey = Object.keys(props).find((k) =>
          [
            "headcount",
            "size",
            "members",
            "employees",
            "people",
            "team size",
          ].includes(k.toLowerCase())
        );
        const tasksKey = Object.keys(props).find((k) =>
          [
            "tasks",
            "issues",
            "tickets",
            "weekly tasks",
            "tasks/week",
          ].includes(k.toLowerCase())
        );
        const responseKey = Object.keys(props).find((k) =>
          ["response time", "response", "avg time", "sla", "hours"].includes(
            k.toLowerCase()
          )
        );
        const pendingKey = Object.keys(props).find((k) =>
          ["pending", "approvals", "pending approvals", "backlog"].includes(
            k.toLowerCase()
          )
        );

        return {
          id: `notion-dept-${i + 1}`,
          name: name || `Department ${i + 1}`,
          headcount:
            (headcountKey
              ? numProp(
                  props[headcountKey] as {
                    type: string;
                    number?: number | null;
                  }
                )
              : null) ?? 10,
          avgTasksPerWeek:
            (tasksKey
              ? numProp(
                  props[tasksKey] as { type: string; number?: number | null }
                )
              : null) ?? 50,
          avgResponseTimeHours:
            (responseKey
              ? numProp(
                  props[responseKey] as { type: string; number?: number | null }
                )
              : null) ?? 8,
          pendingApprovals:
            (pendingKey
              ? numProp(
                  props[pendingKey] as { type: string; number?: number | null }
                )
              : null) ?? 5,
          overdueItems: 2,
          meetingsPerWeek: 8,
        };
      });

      workflows = departments.slice(0, 10).map((dept, i) => ({
        id: `notion-wf-${i + 1}`,
        name: `${dept.name} Workflow`,
        department: dept.name,
        avgDurationHours: dept.avgResponseTimeHours * 2,
        errorRate: 0.05,
        volume: Math.round(dept.avgTasksPerWeek / 5),
      }));
    } else {
      workflows = pages.map((page, i) => {
        const props = page.properties;
        const nameKey =
          Object.keys(props).find((k) =>
            ["name", "title", "workflow", "process"].includes(k.toLowerCase())
          ) ?? Object.keys(props)[0];
        const nameVal = props[nameKey];
        const name =
          nameVal?.type === "title"
            ? richText(
                (nameVal as { type: "title"; title: Array<{ plain_text?: string }> })
                  .title
              )
            : `Workflow ${i + 1}`;

        const deptKey = Object.keys(props).find((k) =>
          ["department", "team", "owner"].includes(k.toLowerCase())
        );
        const durationKey = Object.keys(props).find((k) =>
          ["duration", "hours", "cycle time", "lead time"].includes(
            k.toLowerCase()
          )
        );
        const volumeKey = Object.keys(props).find((k) =>
          ["volume", "count", "weekly", "per week"].includes(k.toLowerCase())
        );
        const errorKey = Object.keys(props).find((k) =>
          ["error", "error rate", "defect", "failure"].includes(k.toLowerCase())
        );

        const deptProp = deptKey ? props[deptKey] : undefined;
        const deptName =
          deptProp
            ? selectProp(
                deptProp as {
                  type: string;
                  select?: { name?: string } | null;
                  status?: { name?: string } | null;
                }
              ) ??
              richText(
                deptProp.type === "rich_text"
                  ? (
                      deptProp as {
                        type: "rich_text";
                        rich_text: Array<{ plain_text?: string }>;
                      }
                    ).rich_text
                  : []
              )
            : "Operations";

        return {
          id: `notion-wf-${i + 1}`,
          name: name || `Workflow ${i + 1}`,
          department: deptName || "Operations",
          avgDurationHours:
            (durationKey
              ? numProp(
                  props[durationKey] as { type: string; number?: number | null }
                )
              : null) ?? 24,
          errorRate: Math.min(
            1,
            (errorKey
              ? numProp(
                  props[errorKey] as { type: string; number?: number | null }
                )
              : null) ?? 0.05
          ),
          volume:
            (volumeKey
              ? numProp(
                  props[volumeKey] as { type: string; number?: number | null }
                )
              : null) ?? 10,
        };
      });

      const deptNames = [...new Set(workflows.map((w) => w.department))];
      departments = deptNames.map((deptName, i) => {
        const deptWfs = workflows.filter((w) => w.department === deptName);
        const totalVolume = deptWfs.reduce((s, w) => s + w.volume, 0);
        return {
          id: `notion-dept-${i + 1}`,
          name: deptName,
          headcount: Math.max(3, Math.round(totalVolume / 10)),
          avgTasksPerWeek: totalVolume,
          avgResponseTimeHours: parseFloat(
            (
              deptWfs.reduce((s, w) => s + w.avgDurationHours, 0) /
              deptWfs.length
            ).toFixed(1)
          ),
          pendingApprovals: Math.round(totalVolume * 0.1),
          overdueItems: Math.round(totalVolume * 0.03),
          meetingsPerWeek: Math.max(3, Math.round(totalVolume * 0.05)),
        };
      });
    }
  } else {
    const searchRes = await fetch(`${NOTION_API}/search`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        filter: { value: "database", property: "object" },
        page_size: 20,
      }),
    });
    if (!searchRes.ok) {
      const text = await searchRes.text();
      return NextResponse.json(
        {
          error: `Notion search error (${searchRes.status}): ${text.slice(
            0,
            200
          )}`,
        },
        { status: searchRes.status }
      );
    }
    const searchData = await searchRes.json();
    const databases: NotionDatabase[] = searchData.results ?? [];
    if (databases.length === 0) {
      return NextResponse.json(
        {
          error:
            "No databases found. Make sure your integration has access to databases, or provide a specific database ID.",
        },
        { status: 404 }
      );
    }
    return NextResponse.json({
      availableDatabases: databases.map((db) => ({
        id: db.id,
        name: richText(db.title) || "Untitled Database",
      })),
      departments: [],
      workflows: [],
      orgName: "Notion Workspace",
      meta: { databaseCount: databases.length },
    });
  }

  return NextResponse.json({
    departments,
    workflows,
    orgName,
    meta: { rowCount: departments.length + workflows.length },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Handler: Asana
// ─────────────────────────────────────────────────────────────────────────────

async function handleAsana(body: Record<string, string>) {
  const { token } = body;
  if (!token) {
    return NextResponse.json(
      { error: "Missing required field: token" },
      { status: 400 }
    );
  }

  const ASANA_API = "https://app.asana.com/api/1.0";
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  interface AsanaTeam { gid: string; name: string }
  interface AsanaProject { gid: string; name: string; team?: { gid: string; name: string } | null; created_at: string }
  interface AsanaTask { gid: string; name: string; completed: boolean; created_at: string; completed_at: string | null }

  const wsRes = await fetch(`${ASANA_API}/workspaces?opt_fields=gid,name`, {
    headers,
  });
  if (!wsRes.ok) {
    const text = await wsRes.text();
    return NextResponse.json(
      { error: `Asana API error (${wsRes.status}): ${text.slice(0, 200)}` },
      { status: wsRes.status }
    );
  }
  const wsData = await wsRes.json();
  const workspaces = wsData.data ?? [];
  if (workspaces.length === 0) {
    return NextResponse.json(
      { error: "No workspaces found." },
      { status: 404 }
    );
  }

  const workspace = workspaces[0];
  const orgName: string = workspace.name ?? "Asana Workspace";

  const teamsRes = await fetch(
    `${ASANA_API}/organizations/${workspace.gid}/teams?opt_fields=gid,name&limit=50`,
    { headers }
  );
  let teams: AsanaTeam[] = [];
  if (teamsRes.ok) {
    const teamsData = await teamsRes.json();
    teams = teamsData.data ?? [];
  }

  const projectsRes = await fetch(
    `${ASANA_API}/projects?workspace=${workspace.gid}&opt_fields=gid,name,team,created_at&limit=50`,
    { headers }
  );
  if (!projectsRes.ok) {
    const text = await projectsRes.text();
    return NextResponse.json(
      {
        error: `Asana projects error (${projectsRes.status}): ${text.slice(
          0,
          200
        )}`,
      },
      { status: projectsRes.status }
    );
  }
  const projectsData = await projectsRes.json();
  const projects: AsanaProject[] = projectsData.data ?? [];

  if (projects.length === 0) {
    return NextResponse.json(
      { error: "No projects found in this Asana workspace." },
      { status: 404 }
    );
  }

  const projectStats: Record<
    string,
    { completed: number; total: number; durations: number[] }
  > = {};
  const projectSample = projects.slice(0, 10);
  await Promise.all(
    projectSample.map(async (project) => {
      try {
        const tasksRes = await fetch(
          `${ASANA_API}/tasks?project=${project.gid}&opt_fields=gid,completed,created_at,completed_at&limit=100`,
          { headers }
        );
        if (!tasksRes.ok) return;
        const tasksData = await tasksRes.json();
        const tasks: AsanaTask[] = tasksData.data ?? [];
        const completed = tasks.filter((t) => t.completed);
        const durations: number[] = completed
          .filter((t) => t.completed_at && t.created_at)
          .map((t) => {
            const ms =
              new Date(t.completed_at!).getTime() -
              new Date(t.created_at).getTime();
            return ms / (1000 * 60 * 60);
          })
          .filter((h) => h > 0 && h < 10000);
        projectStats[project.gid] = {
          total: tasks.length,
          completed: completed.length,
          durations,
        };
      } catch {
        /* ignore */
      }
    })
  );

  const teamMap = new Map<
    string,
    { name: string; projects: AsanaProject[] }
  >();
  if (teams.length > 0) {
    for (const team of teams) {
      teamMap.set(team.gid, { name: team.name, projects: [] });
    }
    for (const project of projects) {
      const teamGid = project.team?.gid;
      if (teamGid && teamMap.has(teamGid)) {
        teamMap.get(teamGid)!.projects.push(project);
      } else {
        if (!teamMap.has("__unassigned")) {
          teamMap.set("__unassigned", { name: "General", projects: [] });
        }
        teamMap.get("__unassigned")!.projects.push(project);
      }
    }
  } else {
    teamMap.set("__all", { name: "Operations", projects });
  }

  const departments: Department[] = [];
  const workflows: WorkflowStep[] = [];
  let deptIdx = 0;
  let wfIdx = 0;

  for (const [, teamData] of teamMap) {
    if (teamData.projects.length === 0) continue;
    const allStats = teamData.projects
      .map((p) => projectStats[p.gid])
      .filter(Boolean);
    const totalTasks = allStats.reduce((s, st) => s + st.total, 0);
    const allDurations = allStats.flatMap((st) => st.durations);
    const avgDuration =
      allDurations.length > 0
        ? parseFloat(
            (
              allDurations.reduce((s, d) => s + d, 0) / allDurations.length
            ).toFixed(1)
          )
        : 24;
    const weeklyVolume = Math.max(1, Math.round(totalTasks / 4));
    const completedTotal = allStats.reduce((s, st) => s + st.completed, 0);
    const errorRate =
      totalTasks > 0
        ? parseFloat(
            Math.min(0.5, 1 - completedTotal / totalTasks).toFixed(2)
          )
        : 0.1;

    departments.push({
      id: `asana-dept-${deptIdx + 1}`,
      name: teamData.name,
      headcount: Math.max(3, Math.round(teamData.projects.length * 3)),
      avgTasksPerWeek: weeklyVolume,
      avgResponseTimeHours: avgDuration,
      pendingApprovals: Math.round(weeklyVolume * 0.15),
      overdueItems: Math.round(weeklyVolume * 0.05),
      meetingsPerWeek: Math.max(2, Math.round(teamData.projects.length)),
    });
    deptIdx++;

    for (const project of teamData.projects.slice(0, 5)) {
      const stats = projectStats[project.gid];
      const pDurations = stats?.durations ?? [];
      const pAvgDuration =
        pDurations.length > 0
          ? parseFloat(
              (pDurations.reduce((s, d) => s + d, 0) / pDurations.length).toFixed(
                1
              )
            )
          : avgDuration;
      const pTotal = stats?.total ?? 10;
      const pCompleted = stats?.completed ?? Math.round(pTotal * 0.8);
      const pErrorRate =
        pTotal > 0
          ? parseFloat(Math.min(0.5, 1 - pCompleted / pTotal).toFixed(2))
          : errorRate;
      workflows.push({
        id: `asana-wf-${wfIdx + 1}`,
        name: project.name,
        department: teamData.name,
        avgDurationHours: pAvgDuration,
        errorRate: pErrorRate,
        volume: Math.max(1, Math.round(pTotal / 4)),
      });
      wfIdx++;
    }
  }

  return NextResponse.json({
    departments,
    workflows,
    orgName,
    meta: {
      teamCount: teamMap.size,
      projectCount: projects.length,
      taskSample: Object.values(projectStats).reduce(
        (s, st) => s + st.total,
        0
      ),
    },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Handler: GitHub
// ─────────────────────────────────────────────────────────────────────────────

async function handleGitHub(body: Record<string, string>) {
  const { token, owner } = body;
  if (!token || !owner) {
    return NextResponse.json(
      {
        error:
          "GitHub processing requires a Personal Access Token and an owner (user or organization) name.",
      },
      { status: 400 }
    );
  }

  let reposUrl = `https://api.github.com/users/${owner}/repos?per_page=15&sort=updated`;
  let response = await fetch(reposUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
    },
  });
  if (response.status === 404) {
    reposUrl = `https://api.github.com/orgs/${owner}/repos?per_page=15&sort=updated`;
    response = await fetch(reposUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });
  }
  if (!response.ok) {
    const errorText = await response.text();
    return NextResponse.json(
      {
        error: `GitHub API error: ${response.status} ${response.statusText}`,
        details: errorText,
      },
      { status: response.status }
    );
  }

  const repos: Record<string, unknown>[] = await response.json();
  if (!repos || !Array.isArray(repos) || repos.length === 0) {
    return NextResponse.json({ departments: [], workflows: [] });
  }

  const departments: Department[] = [];
  const workflows: WorkflowStep[] = [];
  for (const repo of repos) {
    departments.push({
      id: `repo-${repo.id}`,
      name: repo.name as string,
      headcount:
        (repo.forks_count as number) > 0 ? (repo.forks_count as number) + 1 : 1,
      avgTasksPerWeek:
        (repo.open_issues_count as number) > 0
          ? (repo.open_issues_count as number)
          : 5,
      avgResponseTimeHours: 24,
      pendingApprovals: (repo.open_issues_count as number) || 0,
      overdueItems: Math.floor(((repo.open_issues_count as number) || 0) * 0.2),
      meetingsPerWeek: 1,
    });
    if (repo.has_issues) {
      workflows.push({
        id: `wf-${repo.id}-issues`,
        department: repo.name as string,
        name: "Issue Triage & Resolution",
        avgDurationHours: 8,
        errorRate: 0.15,
        volume: Math.max(
          2,
          Math.floor(((repo.open_issues_count as number) || 0) / 4)
        ),
      });
    }
    workflows.push({
      id: `wf-${repo.id}-prs`,
      department: repo.name as string,
      name: "Code Review & Merge (PRs)",
      avgDurationHours: 4,
      errorRate: 0.05,
      volume: 10,
    });
  }

  return NextResponse.json({ departments, workflows });
}

// ─────────────────────────────────────────────────────────────────────────────
// Handler: Trello
// ─────────────────────────────────────────────────────────────────────────────

async function handleTrello(body: Record<string, string>) {
  const { token, key } = body;
  if (!token || !key) {
    return NextResponse.json(
      {
        error:
          "Trello processing requires both an API Key and a user Token.",
      },
      { status: 400 }
    );
  }

  const boardsUrl = `https://api.trello.com/1/members/me/boards?key=${key}&token=${token}&organization=true&fields=name,idOrganization,prefs`;
  const response = await fetch(boardsUrl);
  if (!response.ok) {
    const errorText = await response.text();
    return NextResponse.json(
      {
        error: `Trello API error: ${response.status} ${response.statusText}`,
        details: errorText,
      },
      { status: response.status }
    );
  }

  const boards: Record<string, unknown>[] = await response.json();
  if (!boards || !Array.isArray(boards) || boards.length === 0) {
    return NextResponse.json({ departments: [], workflows: [] });
  }

  const departments: Department[] = [];
  const workflows: WorkflowStep[] = [];
  const orgMap = new Map<string, Record<string, unknown>>();
  const defaultOrgId = "personal-workspace";
  let hasPersonalBoards = false;

  for (const board of boards) {
    const org = board.organization as Record<string, unknown> | null;
    if (org && !orgMap.has(org.id as string)) {
      orgMap.set(org.id as string, org);
    }
  }

  for (const [orgId, org] of orgMap.entries()) {
    departments.push({
      id: orgId,
      name:
        (org.displayName as string) ||
        (org.name as string) ||
        "Trello Workspace",
      headcount: 5,
      avgTasksPerWeek: 50,
      avgResponseTimeHours: 12,
      pendingApprovals: 10,
      overdueItems: 2,
      meetingsPerWeek: 2,
    });
  }

  for (const board of boards) {
    const parentId =
      (board.idOrganization as string) || defaultOrgId;
    if (!board.idOrganization) hasPersonalBoards = true;
    const org = orgMap.get(parentId);
    workflows.push({
      id: `board-${board.id}`,
      department:
        (org?.displayName as string) ||
        (org?.name as string) ||
        (parentId === defaultOrgId ? "Personal Workspace" : "Trello Workspace"),
      name: board.name as string,
      avgDurationHours: 16,
      errorRate: 0.1,
      volume: 20,
    });
  }

  if (hasPersonalBoards) {
    departments.push({
      id: defaultOrgId,
      name: "Personal Workspace",
      headcount: 1,
      avgTasksPerWeek: 30,
      avgResponseTimeHours: 8,
      pendingApprovals: 5,
      overdueItems: 0,
      meetingsPerWeek: 0,
    });
  }

  return NextResponse.json({ departments, workflows });
}

// ─────────────────────────────────────────────────────────────────────────────
// Handler: GitLab
// ─────────────────────────────────────────────────────────────────────────────

async function handleGitLab(body: Record<string, string>) {
  let { token, url } = body;
  if (!token) {
    return NextResponse.json(
      { error: "GitLab processing requires a Personal Access Token." },
      { status: 400 }
    );
  }
  if (!url || !url.trim()) url = "https://gitlab.com";
  if (url.endsWith("/")) url = url.slice(0, -1);

  const response = await fetch(
    `${url}/api/v4/projects?membership=true&simple=true&order_by=updated_at&per_page=15`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!response.ok) {
    const errorText = await response.text();
    return NextResponse.json(
      {
        error: `GitLab API error: ${response.status} ${response.statusText}`,
        details: errorText,
      },
      { status: response.status }
    );
  }

  const projects: Record<string, unknown>[] = await response.json();
  if (!projects || !Array.isArray(projects) || projects.length === 0) {
    return NextResponse.json({ departments: [], workflows: [] });
  }

  const departments: Department[] = [];
  const workflows: WorkflowStep[] = [];
  for (const project of projects) {
    const name =
      (project.name_with_namespace as string) || (project.name as string);
    departments.push({
      id: `gl-project-${project.id}`,
      name,
      headcount: 5,
      avgTasksPerWeek: 30,
      avgResponseTimeHours: 12,
      pendingApprovals: 5,
      overdueItems: 2,
      meetingsPerWeek: 1,
    });
    workflows.push({
      id: `wf-${project.id}-issues`,
      department: name,
      name: "Issue Resolution",
      avgDurationHours: 12,
      errorRate: 0.1,
      volume: 20,
    });
    workflows.push({
      id: `wf-${project.id}-mrs`,
      department: name,
      name: "Merge Requests",
      avgDurationHours: 6,
      errorRate: 0.05,
      volume: 15,
    });
  }

  return NextResponse.json({ departments, workflows });
}

// ─────────────────────────────────────────────────────────────────────────────
// Handler: Zendesk
// ─────────────────────────────────────────────────────────────────────────────

async function handleZendesk(body: Record<string, string>) {
  const { token, email, subdomain } = body;
  if (!token || !email || !subdomain) {
    return NextResponse.json(
      {
        error:
          "Zendesk processing requires a subdomain, account email, and API token.",
      },
      { status: 400 }
    );
  }

  const authString = Buffer.from(`${email}/token:${token}`).toString("base64");
  const response = await fetch(
    `https://${subdomain}.zendesk.com/api/v2/groups.json`,
    {
      headers: { Authorization: `Basic ${authString}`, Accept: "application/json" },
    }
  );
  if (!response.ok) {
    const errorText = await response.text();
    return NextResponse.json(
      {
        error: `Zendesk API error: ${response.status} ${response.statusText}`,
        details: errorText,
      },
      { status: response.status }
    );
  }

  const { groups } = await response.json();
  if (!groups || !Array.isArray(groups) || groups.length === 0) {
    return NextResponse.json({ departments: [], workflows: [] });
  }

  const departments: Department[] = [];
  const workflows: WorkflowStep[] = [];
  for (const group of groups) {
    departments.push({
      id: `zd-group-${group.id}`,
      name: group.name,
      headcount: 10,
      avgTasksPerWeek: 300,
      avgResponseTimeHours: 4,
      pendingApprovals: 25,
      overdueItems: 5,
      meetingsPerWeek: 2,
    });
    workflows.push({
      id: `wf-${group.id}-tickets`,
      department: group.name,
      name: "L1 Ticket Triage & Resolution",
      avgDurationHours: 2,
      errorRate: 0.15,
      volume: 250,
    });
    workflows.push({
      id: `wf-${group.id}-escalations`,
      department: group.name,
      name: "L2 Technical Escalations",
      avgDurationHours: 16,
      errorRate: 0.05,
      volume: 35,
    });
  }

  return NextResponse.json({ departments, workflows });
}

// ─────────────────────────────────────────────────────────────────────────────
// Handler: Salesforce
// ─────────────────────────────────────────────────────────────────────────────

async function handleSalesforce(body: Record<string, string>) {
  let { token, instanceUrl } = body;
  if (!token || !instanceUrl) {
    return NextResponse.json(
      {
        error:
          "Salesforce processing requires a Bearer token and an Instance URL.",
      },
      { status: 400 }
    );
  }
  if (instanceUrl.endsWith("/")) instanceUrl = instanceUrl.slice(0, -1);

  const fetchConfig = {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
  };
  const campaignsQuery = encodeURIComponent(
    "SELECT Id, Name FROM Campaign LIMIT 20"
  );
  const oppsQuery = encodeURIComponent(
    "SELECT Id, Name, CampaignId, StageName, Probability FROM Opportunity LIMIT 100"
  );
  const [campRes, oppsRes] = await Promise.all([
    fetch(
      `${instanceUrl}/services/data/v60.0/query/?q=${campaignsQuery}`,
      fetchConfig
    ),
    fetch(
      `${instanceUrl}/services/data/v60.0/query/?q=${oppsQuery}`,
      fetchConfig
    ),
  ]);

  if (!campRes.ok || !oppsRes.ok) {
    const errorText = await (campRes.ok ? oppsRes : campRes).text();
    return NextResponse.json(
      {
        error: "Salesforce API error: Failed to query standard objects.",
        details: errorText,
      },
      {
        status:
          campRes.status !== 200 ? campRes.status : oppsRes.status,
      }
    );
  }

  const campData = await campRes.json();
  const oppsData = await oppsRes.json();
  const campaigns: Record<string, unknown>[] = campData.records || [];
  const opportunities: Record<string, unknown>[] = oppsData.records || [];

  const departments: Department[] = [];
  const workflows: WorkflowStep[] = [];
  const defaultDeptId = "sf-default";
  let hasUnmatchedOpps = false;

  for (const camp of campaigns) {
    departments.push({
      id: `sf-camp-${camp.Id}`,
      name: camp.Name as string,
      headcount: 3,
      avgTasksPerWeek: 40,
      avgResponseTimeHours: 24,
      pendingApprovals: 5,
      overdueItems: 1,
      meetingsPerWeek: 1,
    });
  }

  for (const opp of opportunities) {
    const parentId = opp.CampaignId
      ? `sf-camp-${opp.CampaignId}`
      : defaultDeptId;
    if (!opp.CampaignId) hasUnmatchedOpps = true;
    const prob = (opp.Probability as number) || 0;
    workflows.push({
      id: `wf-opp-${opp.Id}`,
      department: parentId,
      name: `Opp: ${opp.Name} (${opp.StageName})`,
      avgDurationHours: 160,
      errorRate: (100 - prob) / 100,
      volume: 3,
    });
  }

  if (hasUnmatchedOpps) {
    departments.push({
      id: defaultDeptId,
      name: "General Sales / Direct",
      headcount: 5,
      avgTasksPerWeek: 100,
      avgResponseTimeHours: 8,
      pendingApprovals: 10,
      overdueItems: 2,
      meetingsPerWeek: 5,
    });
  }

  for (const wf of workflows) {
    if (wf.department.startsWith("sf-camp-")) {
      const matchingDept = departments.find((d) => d.id === wf.department);
      wf.department = matchingDept ? matchingDept.name : "Salesforce Campaign";
    } else if (wf.department === defaultDeptId) {
      wf.department = "General Sales / Direct";
    }
  }

  return NextResponse.json({ departments, workflows });
}

// ─────────────────────────────────────────────────────────────────────────────
// Handler: Monday.com
// ─────────────────────────────────────────────────────────────────────────────

async function handleMonday(body: Record<string, string>) {
  const { token } = body;
  if (!token) {
    return NextResponse.json(
      { error: "Monday.com processing requires an API token (v2)." },
      { status: 400 }
    );
  }

  const query = `query { workspaces { id name } boards(limit: 50) { id name workspace_id } }`;
  const response = await fetch("https://api.monday.com/v2", {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
      "API-Version": "2024-01",
    },
    body: JSON.stringify({ query }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    return NextResponse.json(
      { error: `Monday.com API error: ${response.status}`, details: errorText },
      { status: response.status }
    );
  }

  const json = await response.json();
  if (json.errors || !json.data) {
    return NextResponse.json(
      {
        error: "Monday.com GraphQL returned errors.",
        details: json.errors,
      },
      { status: 400 }
    );
  }

  const { workspaces, boards } = json.data;
  const departments: Department[] = [];
  const workflows: WorkflowStep[] = [];
  const workspaceMap = new Map<string, string>();
  const mainWorkspaceId = "main-workspace";
  let hasMainWorkspaceBoards = false;

  if (workspaces) {
    for (const space of workspaces) {
      workspaceMap.set(String(space.id), space.name);
      departments.push({
        id: `mon-ws-${space.id}`,
        name: space.name,
        headcount: 8,
        avgTasksPerWeek: 120,
        avgResponseTimeHours: 16,
        pendingApprovals: 8,
        overdueItems: 3,
        meetingsPerWeek: 2,
      });
    }
  }

  if (boards) {
    for (const board of boards) {
      const wsId = board.workspace_id
        ? String(board.workspace_id)
        : mainWorkspaceId;
      if (!board.workspace_id) hasMainWorkspaceBoards = true;
      workflows.push({
        id: `mon-board-${board.id}`,
        department: workspaceMap.get(wsId) || "Main Workspace",
        name: board.name,
        avgDurationHours: 40,
        errorRate: 0.1,
        volume: 25,
      });
    }
  }

  if (hasMainWorkspaceBoards) {
    departments.push({
      id: `mon-ws-${mainWorkspaceId}`,
      name: "Main Workspace",
      headcount: 5,
      avgTasksPerWeek: 50,
      avgResponseTimeHours: 12,
      pendingApprovals: 2,
      overdueItems: 1,
      meetingsPerWeek: 1,
    });
  }

  return NextResponse.json({ departments, workflows });
}

// ─────────────────────────────────────────────────────────────────────────────
// Handler: HubSpot
// ─────────────────────────────────────────────────────────────────────────────

async function handleHubSpot(body: Record<string, string>) {
  const { token } = body;
  if (!token) {
    return NextResponse.json(
      { error: "HubSpot processing requires a Private App Access Token." },
      { status: 400 }
    );
  }

  const fetchConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
  const [pipelinesRes, dealsRes] = await Promise.all([
    fetch("https://api.hubapi.com/crm/v3/pipelines/deals", fetchConfig),
    fetch(
      "https://api.hubapi.com/crm/v3/objects/deals?properties=dealname,pipeline,dealstage,createdate,closedate,amount",
      fetchConfig
    ),
  ]);

  if (!pipelinesRes.ok || !dealsRes.ok) {
    const errorText = await (
      pipelinesRes.ok ? dealsRes : pipelinesRes
    ).text();
    return NextResponse.json(
      { error: "HubSpot API error", details: errorText },
      {
        status:
          pipelinesRes.status !== 200
            ? pipelinesRes.status
            : dealsRes.status,
      }
    );
  }

  const { results: pipelines } = await pipelinesRes.json();
  const { results: deals } = await dealsRes.json();
  const departments: Department[] = [];
  const workflows: WorkflowStep[] = [];
  const pipelineMap = new Map<string, string>();
  let hasUnmatchedDeals = false;

  if (pipelines && Array.isArray(pipelines)) {
    for (const pipe of pipelines) {
      pipelineMap.set(String(pipe.id), pipe.label);
      departments.push({
        id: `hs-pipe-${pipe.id}`,
        name: pipe.label || "HubSpot Pipeline",
        headcount: 5,
        avgTasksPerWeek: 50,
        avgResponseTimeHours: 12,
        pendingApprovals: 10,
        overdueItems: 2,
        meetingsPerWeek: 2,
      });
    }
  }

  if (deals && Array.isArray(deals)) {
    for (const deal of deals) {
      const props = deal.properties || {};
      const pId = props.pipeline;
      if (!pId) hasUnmatchedDeals = true;
      workflows.push({
        id: `hs-deal-${deal.id}`,
        department: pId
          ? pipelineMap.get(pId) || "HubSpot Pipeline"
          : "General Deals",
        name: props.dealname || `Deal ${deal.id}`,
        avgDurationHours: 120,
        errorRate: 0.2,
        volume: 5,
      });
    }
  }

  if (hasUnmatchedDeals) {
    departments.push({
      id: "hs-default",
      name: "General Deals",
      headcount: 3,
      avgTasksPerWeek: 30,
      avgResponseTimeHours: 24,
      pendingApprovals: 5,
      overdueItems: 1,
      meetingsPerWeek: 1,
    });
  }

  return NextResponse.json({ departments, workflows });
}

// ─────────────────────────────────────────────────────────────────────────────
// Handler: Intercom
// ─────────────────────────────────────────────────────────────────────────────

async function handleIntercom(body: Record<string, string>) {
  const { token } = body;
  if (!token) {
    return NextResponse.json(
      { error: "Intercom processing requires an Access Token." },
      { status: 400 }
    );
  }

  const fetchConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Intercom-Version": "2.11",
      Accept: "application/json",
    },
  };

  const [teamsRes, convRes] = await Promise.all([
    fetch("https://api.intercom.io/teams", fetchConfig),
    fetch("https://api.intercom.io/conversations", fetchConfig),
  ]);

  if (!teamsRes.ok || !convRes.ok) {
    const errorText = await (teamsRes.ok ? convRes : teamsRes).text();
    return NextResponse.json(
      { error: "Intercom API error", details: errorText },
      { status: teamsRes.status !== 200 ? teamsRes.status : convRes.status }
    );
  }

  const teamsData = await teamsRes.json();
  const convData = await convRes.json();
  const teams: Record<string, unknown>[] = teamsData.teams || [];
  const conversations: Record<string, unknown>[] = convData.conversations || [];
  const departments: Department[] = [];
  const workflows: WorkflowStep[] = [];
  const teamMap = new Map<string, string>();
  const defaultDeptId = "intercom-inbox";
  let hasUnassigned = false;

  for (const team of teams) {
    const teamId = String(team.id);
    teamMap.set(teamId, team.name as string);
    departments.push({
      id: `ic-team-${teamId}`,
      name: team.name as string,
      headcount: 10,
      avgTasksPerWeek: 500,
      avgResponseTimeHours: 1.5,
      pendingApprovals: 15,
      overdueItems: 5,
      meetingsPerWeek: 1,
    });
  }

  for (const conv of conversations) {
    const assignee = conv.assignee as Record<string, unknown> | null;
    const tId =
      assignee?.type === "team" ? String(assignee.id) : null;
    if (!tId) hasUnassigned = true;
    workflows.push({
      id: `ic-conv-${conv.id}`,
      department: tId
        ? teamMap.get(tId) || "Intercom Queue"
        : "Unassigned Inbox",
      name: `Customer Support Interaction #${conv.id}`,
      avgDurationHours: 0.5,
      errorRate: 0.05,
      volume: 300,
    });
  }

  if (hasUnassigned) {
    departments.push({
      id: defaultDeptId,
      name: "Unassigned Inbox",
      headcount: 5,
      avgTasksPerWeek: 350,
      avgResponseTimeHours: 4,
      pendingApprovals: 50,
      overdueItems: 10,
      meetingsPerWeek: 0,
    });
  }

  return NextResponse.json({ departments, workflows });
}

// ─────────────────────────────────────────────────────────────────────────────
// Handler: Zapier
// ─────────────────────────────────────────────────────────────────────────────

async function handleZapier(body: Record<string, string>) {
  const { token } = body;
  if (!token) {
    return NextResponse.json(
      { error: "Zapier processing requires a Personal Access Token." },
      { status: 400 }
    );
  }

  const fetchConfig = {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
  };

  const [foldersRes, zapsRes] = await Promise.all([
    fetch("https://api.zapier.com/v1/folders", fetchConfig),
    fetch("https://api.zapier.com/v1/zaps", fetchConfig),
  ]);

  if (!foldersRes.ok || !zapsRes.ok) {
    const errorText = await (foldersRes.ok ? zapsRes : foldersRes).text();
    return NextResponse.json(
      { error: "Zapier API error", details: errorText },
      {
        status:
          foldersRes.status !== 200 ? foldersRes.status : zapsRes.status,
      }
    );
  }

  const foldersData = await foldersRes.json();
  const zapsData = await zapsRes.json();
  const folders: Record<string, unknown>[] = foldersData.objects || [];
  const zaps: Record<string, unknown>[] = zapsData.objects || [];
  const departments: Department[] = [];
  const workflows: WorkflowStep[] = [];
  const folderMap = new Map<string, string>();
  let hasUnmatched = false;

  for (const folder of folders) {
    folderMap.set(String(folder.id), folder.title as string);
    departments.push({
      id: `zp-folder-${folder.id}`,
      name: (folder.title as string) || "Zapier Folder",
      headcount: 1,
      avgTasksPerWeek: 1000,
      avgResponseTimeHours: 0.1,
      pendingApprovals: 0,
      overdueItems: 0,
      meetingsPerWeek: 0,
    });
  }

  for (const zap of zaps) {
    const fId = zap.folder_id ? String(zap.folder_id) : null;
    if (!fId) hasUnmatched = true;
    workflows.push({
      id: `zp-zap-${zap.id}`,
      department: fId ? folderMap.get(fId) || "Zapier Folder" : "Home",
      name: (zap.title as string) || `Zap ${zap.id}`,
      avgDurationHours: 0.05,
      errorRate: 0.01,
      volume: 50,
    });
  }

  if (hasUnmatched) {
    departments.push({
      id: "zp-home",
      name: "Home",
      headcount: 1,
      avgTasksPerWeek: 500,
      avgResponseTimeHours: 0.5,
      pendingApprovals: 0,
      overdueItems: 0,
      meetingsPerWeek: 0,
    });
  }

  return NextResponse.json({ departments, workflows });
}

// ─────────────────────────────────────────────────────────────────────────────
// Handler: Make
// ─────────────────────────────────────────────────────────────────────────────

async function handleMake(body: Record<string, string>) {
  const { token, organizationId } = body;
  if (!token || !organizationId) {
    return NextResponse.json(
      {
        error:
          "Make processing requires an API Token and an Organization ID.",
      },
      { status: 400 }
    );
  }

  const fetchConfig = {
    headers: { Authorization: `Token ${token}`, Accept: "application/json" },
  };
  const [teamsRes, scenariosRes] = await Promise.all([
    fetch(
      `https://eu1.make.com/api/v2/organizations/${organizationId}/teams`,
      fetchConfig
    ),
    fetch(
      `https://eu1.make.com/api/v2/scenarios?organizationId=${organizationId}`,
      fetchConfig
    ),
  ]);

  if (!teamsRes.ok || !scenariosRes.ok) {
    const errorText = await (teamsRes.ok ? scenariosRes : teamsRes).text();
    return NextResponse.json(
      { error: "Make API error", details: errorText },
      {
        status:
          teamsRes.status !== 200 ? teamsRes.status : scenariosRes.status,
      }
    );
  }

  const teamsData = await teamsRes.json();
  const scenariosData = await scenariosRes.json();
  const teams: Record<string, unknown>[] = teamsData.teams || [];
  const scenarios: Record<string, unknown>[] = scenariosData.scenarios || [];
  const departments: Department[] = [];
  const workflows: WorkflowStep[] = [];
  const teamMap = new Map<string, string>();
  let hasUnassigned = false;

  for (const team of teams) {
    teamMap.set(String(team.id), team.name as string);
    departments.push({
      id: `mk-team-${team.id}`,
      name: (team.name as string) || "Make Team",
      headcount: 1,
      avgTasksPerWeek: 500,
      avgResponseTimeHours: 0.1,
      pendingApprovals: 0,
      overdueItems: 0,
      meetingsPerWeek: 0,
    });
  }

  for (const scenario of scenarios) {
    const tId = scenario.teamId ? String(scenario.teamId) : null;
    if (!tId) hasUnassigned = true;
    workflows.push({
      id: `mk-scen-${scenario.id}`,
      department: tId
        ? teamMap.get(tId) || "Make Team"
        : "Default Team",
      name: (scenario.name as string) || `Scenario ${scenario.id}`,
      avgDurationHours: 0.05,
      errorRate: 0.02,
      volume: 100,
    });
  }

  if (hasUnassigned) {
    departments.push({
      id: "mk-default",
      name: "Default Team",
      headcount: 1,
      avgTasksPerWeek: 300,
      avgResponseTimeHours: 0.2,
      pendingApprovals: 0,
      overdueItems: 0,
      meetingsPerWeek: 0,
    });
  }

  return NextResponse.json({ departments, workflows });
}

// ─────────────────────────────────────────────────────────────────────────────
// Route Dispatcher
// ─────────────────────────────────────────────────────────────────────────────

const HANDLERS: Record<
  string,
  (body: Record<string, string>) => Promise<NextResponse>
> = {
  linear: handleLinear,
  jira: handleJira,
  notion: handleNotion,
  asana: handleAsana,
  github: handleGitHub,
  trello: handleTrello,
  gitlab: handleGitLab,
  zendesk: handleZendesk,
  salesforce: handleSalesforce,
  monday: handleMonday,
  hubspot: handleHubSpot,
  intercom: handleIntercom,
  zapier: handleZapier,
  make: handleMake,
};

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ integration: string }> }
) {
  const { integration } = await params;
  const handler = HANDLERS[integration.toLowerCase()];

  if (!handler) {
    return NextResponse.json(
      { error: `Unknown integration: ${integration}` },
      { status: 404 }
    );
  }

  try {
    const body = await req.json();
    return await handler(body);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[integrations/${integration}] error:`, message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
