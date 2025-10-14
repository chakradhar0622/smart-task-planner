import { type User, type InsertUser, type TaskPlan } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Task plan storage methods
  createPlan(plan: TaskPlan): Promise<TaskPlan>;
  getPlan(id: string): Promise<TaskPlan | undefined>;
  getAllPlans(): Promise<TaskPlan[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private plans: Map<string, TaskPlan>;

  constructor() {
    this.users = new Map();
    this.plans = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createPlan(plan: TaskPlan): Promise<TaskPlan> {
    this.plans.set(plan.id, plan);
    return plan;
  }

  async getPlan(id: string): Promise<TaskPlan | undefined> {
    return this.plans.get(id);
  }

  async getAllPlans(): Promise<TaskPlan[]> {
    return Array.from(this.plans.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
}

export const storage = new MemStorage();
