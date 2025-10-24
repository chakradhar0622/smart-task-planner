import { GoogleGenAI } from "@google/genai";

// DON'T DELETE THIS COMMENT
// Using Gemini AI blueprint for task planning functionality
// Model: gemini-2.5-flash for fast, intelligent task generation

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  // Warn when missing
  console.warn("GEMINI_API_KEY is not set. To use Gemini AI, set the GEMINI_API_KEY environment variable.");
} else {
  // Masked log of the key so developers can confirm it's read (won't print full key).
  try {
    const masked = `${API_KEY.slice(0, 6)}...${API_KEY.slice(-4)}`;
    console.info(`GEMINI_API_KEY present: ${masked}`);
  } catch (e) {
    console.info("GEMINI_API_KEY present");
  }
}

const ai = new GoogleGenAI({ apiKey: API_KEY || "" });

export interface GenerateTaskPlanInput {
  goal: string;
}

export interface GeneratedTask {
  id: string;
  name: string;
  description: string;
  duration: string;
  deadline: string;
  priority: "low" | "medium" | "high";
  dependencies: string[];
  order: number;
}

export interface GeneratedTaskPlan {
  tasks: GeneratedTask[];
}

export async function generateTaskPlan(input: GenerateTaskPlanInput): Promise<GeneratedTaskPlan> {
  try {
    // If no API key is configured, allow a lightweight mock in development so
    // local iteration doesn't require an AI key. In production we fail fast.
    if (!API_KEY) {
      if (process.env.NODE_ENV === "development") {
        const now = new Date();
        const makeDate = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000).toISOString();

        // Simple deterministic mock plan suitable for local dev/testing
        const mock: GeneratedTaskPlan = {
          tasks: [
            {
              id: "task-1",
              name: "Define project scope",
              description: "Define the website goals, pages, and content.",
              duration: "1 day",
              deadline: makeDate(3),
              priority: "high",
              dependencies: [],
              order: 1,
            },
            {
              id: "task-2",
              name: "Design mockups",
              description: "Create wireframes and visual design for main pages.",
              duration: "2 days",
              deadline: makeDate(6),
              priority: "medium",
              dependencies: ["task-1"],
              order: 2,
            },
            {
              id: "task-3",
              name: "Implement frontend",
              description: "Build the website layout and components.",
              duration: "3 days",
              deadline: makeDate(10),
              priority: "high",
              dependencies: ["task-2"],
              order: 3,
            },
            {
              id: "task-4",
              name: "Add content",
              description: "Write and add content for pages.",
              duration: "2 days",
              deadline: makeDate(12),
              priority: "medium",
              dependencies: ["task-3"],
              order: 4,
            },
            {
              id: "task-5",
              name: "Launch",
              description: "Deploy the site and verify everything works.",
              duration: "1 day",
              deadline: makeDate(13),
              priority: "high",
              dependencies: ["task-4"],
              order: 5,
            },
          ],
        };

  console.info("Gemini API key not set — returning development mock plan.");
  return mock;
      }

      // Not development and no API key -> fail with clear message
      throw new Error("GEMINI_API_KEY is not set. Set GEMINI_API_KEY to use Gemini AI in production.");
    }
    const systemPrompt = `You are an expert project manager and task planner. Your role is to break down user goals into actionable, well-structured tasks with realistic timelines and dependencies.

IMPORTANT REQUIREMENTS:
1. Generate 5-12 tasks depending on goal complexity
2. Each task must have a unique ID (task-1, task-2, etc.)
3. Set realistic durations (e.g., "2 hours", "3 days", "1 week")
4. Calculate deadline dates from today, considering dependencies
5. Assign priority: "high", "medium", or "low"
6. Identify task dependencies using task IDs
7. Order tasks logically (order: 1, 2, 3...)

RESPONSE FORMAT (strict JSON):
{
  "tasks": [
    {
      "id": "task-1",
      "name": "Task name",
      "description": "Detailed description of what needs to be done",
      "duration": "2 days",
      "deadline": "2025-10-15T00:00:00Z",
      "priority": "high",
      "dependencies": [],
      "order": 1
    }
  ]
}

GUIDELINES:
- Break complex goals into phases or milestones
- Include both planning and execution tasks
- Consider realistic time buffers
- Ensure dependencies are logical (task-2 can depend on task-1, but not vice versa)
- Prioritize critical path tasks as "high"
- Support tasks can be "medium" or "low"`;

    const userPrompt = `Break down this goal into actionable tasks with timelines and dependencies:\n\n"${input.goal}"`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            tasks: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  name: { type: "string" },
                  description: { type: "string" },
                  duration: { type: "string" },
                  deadline: { type: "string" },
                  priority: { type: "string", enum: ["low", "medium", "high"] },
                  dependencies: {
                    type: "array",
                    items: { type: "string" }
                  },
                  order: { type: "number" }
                },
                required: ["id", "name", "description", "duration", "deadline", "priority", "dependencies", "order"]
              }
            }
          },
          required: ["tasks"]
        }
      },
      contents: userPrompt,
    });

  const rawJson = response.text || "";

    if (!rawJson) {
      throw new Error("Empty response from Gemini AI");
    }

    const data: GeneratedTaskPlan = JSON.parse(rawJson);

    // Validate response structure
    if (!data.tasks || !Array.isArray(data.tasks) || data.tasks.length === 0) {
      throw new Error("Invalid task plan structure");
    }

    return data;
  } catch (error: any) {
    // Distinguish permission/auth errors from other failures
    console.error("Gemini AI error:", error);

    const message = error instanceof Error ? error.message : String(error || "Unknown error");

    // If the API returned a 403 / permission denied, surface a clear error
    if (message.includes("unregistered callers") || message.includes("403") || (error?.status === 403)) {
      throw new Error("Gemini rejected the API key (PERMISSION_DENIED). Verify GEMINI_API_KEY is valid and has access to the model.");
    }

    throw new Error(`Failed to generate task plan: ${message}`);
  }
}
