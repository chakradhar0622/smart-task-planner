import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Sparkles, Loader2 } from "lucide-react";
import type { CreatePlanInput } from "@shared/schema";

interface GoalInputFormProps {
  onSubmit: (data: CreatePlanInput) => void;
  isLoading?: boolean;
}

export function GoalInputForm({ onSubmit, isLoading = false }: GoalInputFormProps) {
  const [goal, setGoal] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (goal.trim().length < 10) {
      setError("Please describe your goal in at least 10 characters");
      return;
    }

    if (goal.trim().length > 1000) {
      setError("Goal description must be less than 1000 characters");
      return;
    }

    onSubmit({ goal: goal.trim() });
  };

  const exampleGoals = [
    "Launch a product in 2 weeks",
    "Organize a team offsite event in 30 days",
    "Learn React and build a portfolio website in 3 months",
    "Plan a wedding in 6 months",
  ];

  return (
    <div className="w-full space-y-6">
      <Card className="border-2 p-8 shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <label htmlFor="goal-input" className="text-sm font-medium text-foreground">
              Describe your goal
            </label>
            <Textarea
              id="goal-input"
              data-testid="input-goal"
              placeholder="e.g., Launch a product in 2 weeks, organize a conference, learn a new skill..."
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="min-h-32 resize-none text-base"
              disabled={isLoading}
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {goal.length}/1000 characters
              </span>
              {error && (
                <span className="text-xs text-destructive" data-testid="text-error">
                  {error}
                </span>
              )}
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full md:w-auto"
            disabled={isLoading || goal.trim().length < 10}
            data-testid="button-generate-plan"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                AI is planning...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Generate Task Plan
              </>
            )}
          </Button>
        </form>
      </Card>

      <div className="text-center space-y-3">
        <p className="text-sm text-muted-foreground">Try these examples:</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {exampleGoals.map((example, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => setGoal(example)}
              disabled={isLoading}
              data-testid={`button-example-${index}`}
              className="text-xs"
            >
              {example}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
