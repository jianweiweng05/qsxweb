import { isPro, ProGate } from "@/app/lib/gate";

export const dynamic = "force-dynamic";

export default function HistoryPage() {
  if (!isPro()) {
    return (
      <div className="p-4 text-white min-h-full bg-black/90">
        <h1 className="text-xl font-bold mb-4">历史</h1>
        <ProGate><></></ProGate>
      </div>
    );
  }
  return (
    <div className="p-4 text-white min-h-full bg-black/90">
      <h1 className="text-xl font-bold mb-4">历史</h1>
      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
        <div className="text-white/50">历史相似性（占位）</div>
      </div>
    </div>
  );
}
