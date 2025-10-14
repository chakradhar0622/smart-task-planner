import { GoogleGenAI } from "@google/genai";

// DON'T DELETE THIS COMMENT
// Using Gemini AI blueprint for task planning functionality
// Model: gemini-2.5-flash for fast, intelligent task generation

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

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
  } catch (error) {
    console.error("Gemini AI error:", error);
    throw new Error(`Failed to generate task plan: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
