import { Lightbulb } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
      <div className="p-6 rounded-full bg-muted/50">
        <Lightbulb className="h-12 w-12 text-muted-foreground" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-foreground">Ready to turn your goals into action?</h3>
        <p className="text-muted-foreground max-w-md">
          Describe your goal above and let AI create a comprehensive task plan with timelines and dependencies
        </p>
      </div>
    </div>
  );
}
