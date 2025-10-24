import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateTaskPlan } from "./gemini";
import { createPlanInputSchema } from "@shared/schema";
import { randomUUID } from "crypto";
import type { TaskPlan } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API route to generate task plan from goal
  app.post("/api/plan/generate", async (req, res) => {
    try {
      // Validate request body
      const validationResult = createPlanInputSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Invalid input", 
          details: validationResult.error.errors 
        });
      }

      const { goal } = validationResult.data;

      // Generate task plan using Gemini AI
      const generatedPlan = await generateTaskPlan({ goal });

      // Create task plan response
      const taskPlan: TaskPlan = {
        id: randomUUID(),
        goal,
        createdAt: new Date().toISOString(),
        tasks: generatedPlan.tasks,
      };

      // Store the plan in memory
      await storage.createPlan(taskPlan);

      return res.json(taskPlan);
    } catch (error) {
      console.error("Error generating task plan:", error);

      const message = error instanceof Error ? error.message : "Unknown error";

      // If the error indicates missing API key, return a clear 503 Service Unavailable
      if (message.includes("GEMINI_API_KEY") || message.includes("unregistered callers")) {
        console.warn("/api/plan/generate: Gemini API not configured — returning 503 to client.");
        return res.status(503).json({
          error: "AI service unavailable",
          message: "Gemini AI is not configured. Set GEMINI_API_KEY in your environment to enable plan generation.",
        });
      }

      return res.status(500).json({ error: "Failed to generate task plan", message });
    }
  });

  // Get all plans
  app.get("/api/plans", async (req, res) => {
    try {
      const plans = await storage.getAllPlans();
      return res.json(plans);
    } catch (error) {
      console.error("Error fetching plans:", error);
      return res.status(500).json({ error: "Failed to fetch plans" });
    }
  });

  // Get specific plan by ID
  app.get("/api/plans/:id", async (req, res) => {
    try {
      const plan = await storage.getPlan(req.params.id);
      
      if (!plan) {
        return res.status(404).json({ error: "Plan not found" });
      }

      return res.json(plan);
    } catch (error) {
      console.error("Error fetching plan:", error);
      return res.status(500).json({ error: "Failed to fetch plan" });
    }
  });

  const httpServer = createServer(app);

  // Development-only admin endpoint to inspect whether the Gemini API key is configured.
  // This intentionally does not return the key value — only whether the key is present.
  if (app.get("env") === "development") {
    app.get("/api/admin/env", (_req, res) => {
      const isConfigured = !!process.env.GEMINI_API_KEY;
      return res.json({
        nodeEnv: process.env.NODE_ENV || app.get("env"),
        geminiConfigured: isConfigured,
      });
    });
  }

  return httpServer;
}
