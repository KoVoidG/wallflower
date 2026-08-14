import { NextRequest } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const maxDuration = 60;

const ai = new GoogleGenAI({});
const AI_MODEL = "gemini-2.5-flash";

// ─── Ingestion Agent Prompts ───────────────────────────────────────────────

const EXTRACTOR_PROMPT = `You are the Extractor Agent.
Your job is to read raw financial, operational, or payroll documents and extract structured text summarizing:
- Named departments or teams
- Headcounts or inferred headcounts (e.g. from payroll $ / avg salary)
- Known or estimated cycle times for processes
- Reported error rates, defects, or backlogs
- Work volumes (e.g., invoices processed per week)

Be exhaustive but structured. Only output factual information found in the text.`;

const ANALYZER_PROMPT = `You are the Analyzer Agent.
Take the extracted operational data and apply operations research logic to infer missing metrics and structure the data:
- Calculate cycle times if given total time and volume.
- Apply Little's Law to estimate queue lengths if arrival rates and wait times are given.
- Cross-reference financial data (e.g., "$5M annual engineering payroll at $100k avg salary" -> 50 headcount).

Output a detailed JSON-like intermediate mapping of Departments and WorkflowSteps.`;

const SYNTHESIZER_PROMPT = `You are the Synthesizer Agent.
Your job is to output exactly the JSON structure required by Wallflower to build its org profile, along with a final audit report.
Take the analytical mapping provided by the Analyzer Agent and map it to this TypeScript schema:

interface Department {
  id: string; // e.g. dept-1
  name: string;
  headcount: number;
  avgTasksPerWeek: number;
  avgResponseTimeHours: number;
  pendingApprovals: number;
  overdueItems: number;
  meetingsPerWeek: number;
}
interface WorkflowStep {
  id: string; // e.g. wf-1
  name: string;
  department: string; // must match a department name exactly
  avgDurationHours: number;
  errorRate: number; // 0 to 1
  volume: number; // items per week
}

Return JSON strictly in this format (no markdown, no code fences, pure JSON):
{
  "orgName": "...",
  "industry": "...",
  "description": "...",
  "departments": [...],
  "workflows": [...],
  "finalReport": "A concise executive summary of the organization, highlighting the ingested data sources and critical extracted operational insights."
}`;

// ─── Gemini Agent Runners ──────────────────────────────────────────────────

async function runExtractor(text: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: AI_MODEL,
    contents: [
      { role: "user", parts: [{ text: `${EXTRACTOR_PROMPT}\n\n---\n\n${text}` }] },
    ],
    config: { temperature: 0.1 },
  });
  return response.text ?? "";
}

async function runAnalyzer(extractedText: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: AI_MODEL,
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `${ANALYZER_PROMPT}\n\n---\n\nExtracted data:\n${extractedText}`,
          },
        ],
      },
    ],
    config: { temperature: 0.1 },
  });
  return response.text ?? "";
}

async function runSynthesizer(analyzerText: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: AI_MODEL,
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `${SYNTHESIZER_PROMPT}\n\n---\n\nAnalysis:\n${analyzerText}`,
          },
        ],
      },
    ],
    config: {
      temperature: 0.1,
      responseMimeType: "application/json",
    },
  });
  return response.text ?? "{}";
}

// ─── Route Handler ─────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const { text } = await req.json();

  if (!text) {
    return new Response("No text provided", { status: 400 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      function sendEvent(type: string, data: unknown) {
        controller.enqueue(
          encoder.encode(
            `event: ${type}\ndata: ${JSON.stringify(data)}\n\n`
          )
        );
      }

      try {
        // Step 1: Extractor Agent
        sendEvent("status", {
          agent: "extractor",
          state: "running",
          message:
            "Extracting structural entities and operational metrics...",
        });
        const extracted = await runExtractor(text);
        sendEvent("status", {
          agent: "extractor",
          state: "done",
          message: "Extraction complete.",
          content: extracted,
        });

        // Step 2: Analyzer Agent
        sendEvent("status", {
          agent: "analyzer",
          state: "running",
          message:
            "Applying operations research models (Little's Law, Queuing)...",
        });
        const analysis = await runAnalyzer(extracted);
        sendEvent("status", {
          agent: "analyzer",
          state: "done",
          message: "Analysis complete.",
          content: analysis,
        });

        // Step 3: Synthesizer Agent
        sendEvent("status", {
          agent: "synthesizer",
          state: "running",
          message:
            "Validating schemas and structuring final data payload...",
        });
        const finalJsonString = await runSynthesizer(analysis);
        sendEvent("status", {
          agent: "synthesizer",
          state: "done",
          message: "Synthesis complete.",
        });

        sendEvent("result", JSON.parse(finalJsonString));
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "An error occurred during agent ingestion";
        sendEvent("error", { message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
