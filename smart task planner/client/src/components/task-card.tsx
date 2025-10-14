import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import type { Task } from "@shared/schema";
import { format } from "date-fns";

interface TaskCardProps {
  task: Task;
  allTasks: Task[];
}

export function TaskCard({ task, allTasks }: TaskCardProps) {
  const priorityColors = {
    high: "border-l-destructive",
    medium: "border-l-chart-3",
    low: "border-l-chart-2",
  };

  const priorityBadgeVariants = {
    high: "destructive",
    medium: "default",
    low: "secondary",
  } as const;

  const dependencyTasks = task.dependencies
    .map(depId => allTasks.find(t => t.id === depId))
    .filter(Boolean) as Task[];

  return (
    <Card 
      className={`border-l-4 ${priorityColors[task.priority]} p-6 hover-elevate transition-all duration-200`}
      data-testid={`card-task-${task.id}`}
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <h3 className="text-lg font-semibold text-foreground flex-1" data-testid={`text-task-name-${task.id}`}>
            {task.name}
          </h3>
          <Badge 
            variant={priorityBadgeVariants[task.priority]}
            className="capitalize"
            data-testid={`badge-priority-${task.id}`}
          >
            {task.priority}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed" data-testid={`text-task-description-${task.id}`}>
          {task.description}
        </p>

        <div className="flex items-center gap-6 flex-wrap text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className="font-mono" data-testid={`text-duration-${task.id}`}>{task.duration}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span className="font-mono" data-testid={`text-deadline-${task.id}`}>
              {format(new Date(task.deadline), "MMM d, yyyy")}
            </span>
          </div>
        </div>

        {dependencyTasks.length > 0 && (
          <div className="pt-3 border-t border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <ArrowRight className="h-3 w-3" />
              <span>Depends on:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {dependencyTasks.map(depTask => (
                <Badge 
                  key={depTask.id} 
                  variant="outline" 
                  className="text-xs"
                  data-testid={`badge-dependency-${task.id}-${depTask.id}`}
                >
                  {depTask.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
