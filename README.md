**SMART TASK PLANNER**
An AI-powered smart goal planner that helps users transform their goals into actionable task plans with timelines and dependencies.
Built using React + TypeScript + Vite, styled with TailwindCSS and shadcn/ui, and powered by an AI backend (e.g., Gemini API / OpenAI).

**Installation & Setup**
Clone the repository:
git clone https://github.com/yourusername/GoalBreakdown.git
cd GoalBreakdown

Install dependencies:
npm install

Configure environment variables:

Create a .env file in the root directory and add:
VITE_API_KEY=your_gemini_or_openai_api_key
VITE_API_URL=http://localhost:5000  # or your backend endpoint

Run the development server
npm run dev

Then open http://localhost:5173
 in your browser.

**How It Works**

The user enters a goal in the input form.

The system sends it to an AI backend (e.g., Gemini or OpenAI) via API.

The AI returns a structured breakdown with tasks, durations, and dependencies.

The frontend renders each task as an interactive card with timeline details.
