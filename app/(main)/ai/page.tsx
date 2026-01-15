import { AIClient } from "./client";

export const dynamic = "force-dynamic";

export default function AIPage() {
  return (
    <div className="p-4 text-white h-full bg-[#0a0e14] flex flex-col">
      <AIClient />
    </div>
  );
}
