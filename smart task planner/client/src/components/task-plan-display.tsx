import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TaskCard } from "./task-card";
import { Download, Copy, CheckCircle2 } from "lucide-react";
import type { TaskPlan } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface TaskPlanDisplayProps {
  plan: TaskPlan;
  onNewPlan: () => void;
}

export function TaskPlanDisplay({ plan, onNewPlan }: TaskPlanDisplayProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopyToClipboard = async () => {
    const planText = `
Goal: ${plan.goal}

Tasks:
${plan.tasks.map((task, index) => `
${index + 1}. ${task.name}
   Description: ${task.description}
   Duration: ${task.duration}
   Deadline: ${task.deadline}
   Priority: ${task.priority}
   Dependencies: ${task.dependencies.length > 0 ? task.dependencies.join(", ") : "None"}
`).join("\n")}
    `.trim();

    try {
      await navigator.clipboard.writeText(planText);
      setCopied(true);
      toast({
        title: "Copied to clipboard!",
        description: "Task plan has been copied to your clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleDownloadJSON = () => {
    const dataStr = JSON.stringify(plan, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `task-plan-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "Task plan has been saved as JSON",
    });
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-chart-2" />
            <h2 className="text-2xl font-semibold text-foreground">Your Task Plan</h2>
          </div>
          <p className="text-sm text-muted-foreground" data-testid="text-goal">
            Goal: {plan.goal}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyToClipboard}
            data-testid="button-copy-plan"
          >
            {copied ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadJSON}
            data-testid="button-download-plan"
          >
            <Download className="mr-2 h-4 w-4" />
            Export JSON
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={onNewPlan}
            data-testid="button-new-plan"
          >
            New Plan
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plan?.tasks?.map((task) => (
          <TaskCard key={task.id} task={task} allTasks={plan.tasks} />
        )) || (
          <div className="col-span-full text-center text-muted-foreground py-8">
            No tasks found in the plan
          </div>
        )}
      </div>
    </div>
  );
}
