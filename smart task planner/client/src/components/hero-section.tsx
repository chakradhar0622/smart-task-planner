import { Sparkles, Target, Network, Calendar } from "lucide-react";

export function HeroSection() {
  return (
    <div className="relative py-20 md:py-32">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-chart-2/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">AI-Powered Planning</span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
          Transform Your Goals Into{" "}
          <span className="text-primary">Actionable Tasks</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Break down any goal into a structured task plan with AI-generated timelines, 
          dependencies, and priorities. From product launches to personal projects.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 max-w-3xl mx-auto">
          <div className="flex flex-col items-center gap-3 p-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">Smart Breakdown</h3>
            <p className="text-sm text-muted-foreground text-center">
              AI analyzes your goal and creates detailed, actionable tasks
            </p>
          </div>
          
          <div className="flex flex-col items-center gap-3 p-4">
            <div className="p-3 rounded-lg bg-chart-3/10">
              <Network className="h-6 w-6 text-chart-3" />
            </div>
            <h3 className="font-semibold text-foreground">Dependencies</h3>
            <p className="text-sm text-muted-foreground text-center">
              Automatically detect task relationships and execution order
            </p>
          </div>
          
          <div className="flex flex-col items-center gap-3 p-4">
            <div className="p-3 rounded-lg bg-chart-2/10">
              <Calendar className="h-6 w-6 text-chart-2" />
            </div>
            <h3 className="font-semibold text-foreground">Timeline</h3>
            <p className="text-sm text-muted-foreground text-center">
              Get estimated durations and suggested deadlines for each task
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
