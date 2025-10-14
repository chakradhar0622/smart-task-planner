import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { HeroSection } from "@/components/hero-section";
import { GoalInputForm } from "@/components/goal-input-form";
import { TaskPlanDisplay } from "@/components/task-plan-display";
import { EmptyState } from "@/components/empty-state";
import { ThemeToggle } from "@/components/theme-toggle";
import { Loader2, Sparkles } from "lucide-react";
import type { CreatePlanInput, TaskPlan } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [currentPlan, setCurrentPlan] = useState<TaskPlan | null>(null);
  const { toast } = useToast();

  const generatePlanMutation = useMutation({
    mutationFn: async (input: CreatePlanInput) => {
      const response = await apiRequest("POST", "/api/plan/generate", input);
      const data: TaskPlan = await response.json();
      return data;
    },
    onSuccess: (data) => {
      setCurrentPlan(data);
      toast({
        title: "Plan generated!",
        description: `Created ${data?.tasks?.length || 0} tasks for your goal`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to generate plan",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  const handleNewPlan = () => {
    setCurrentPlan(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border backdrop-blur-lg bg-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Smart Task Planner</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!currentPlan && <HeroSection />}

        <div className="py-12">
          {!currentPlan && (
            <div className="max-w-3xl mx-auto">
              <GoalInputForm
                onSubmit={(data) => generatePlanMutation.mutate(data)}
                isLoading={generatePlanMutation.isPending}
              />
            </div>
          )}

          {generatePlanMutation.isPending && (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold text-foreground">AI is analyzing your goal...</h3>
                <p className="text-sm text-muted-foreground">
                  Creating task breakdown with dependencies and timelines
                </p>
              </div>
            </div>
          )}

          {currentPlan && !generatePlanMutation.isPending && (
            <TaskPlanDisplay plan={currentPlan} onNewPlan={handleNewPlan} />
          )}

          {!currentPlan && !generatePlanMutation.isPending && <EmptyState />}
        </div>
      </main>

      <footer className="border-t border-border mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-sm text-muted-foreground">
            Powered by Gemini AI • Transform your goals into actionable plans
          </p>
        </div>
      </footer>
    </div>
  );
}
