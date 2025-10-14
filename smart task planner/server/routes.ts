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
      return res.status(500).json({ 
        error: "Failed to generate task plan",
        message: error instanceof Error ? error.message : "Unknown error"
      });
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

  return httpServer;
}
