import { AIAssistant } from "@/components/portfolio/ai-assistant";

export default function DemoAssistantPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <div className="container max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Ask Me Anything</h1>
          <p className="text-zinc-400 text-lg">
            Try the new inline AI assistant
          </p>
        </div>

        <AIAssistant lang="en" theme="dark" />

        <div className="mt-16 text-center">
          <p className="text-zinc-500 text-sm mb-4">Suggested questions:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <span className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 text-xs">
              What are your key skills?
            </span>
            <span className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 text-xs">
              Tell me about your experience
            </span>
            <span className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 text-xs">
              What projects have you worked on?
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
