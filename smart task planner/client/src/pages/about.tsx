import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <Card className="w-full max-w-2xl mx-4">
        <CardContent className="p-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">About Smart Task Planner</h1>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            This is an example static page. Add your pages under `client/src/pages` and wire them into the
            router in `client/src/App.tsx`.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
