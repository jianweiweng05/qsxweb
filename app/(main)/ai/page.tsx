import { AIClient } from "./client";

export const dynamic = "force-dynamic";

export default function AIPage() {
  return (
    <div className="p-4 text-white min-h-full bg-black/90 flex flex-col">
      <h1 className="text-xl font-bold mb-4">AI 助手</h1>
      <AIClient />
    </div>
  );
}
