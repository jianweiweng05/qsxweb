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
      <div className="lg:grid lg:grid-cols-2 lg:gap-6">
        {/* 左列：主历史数据 */}
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="text-white/50">历史相似性（占位）</div>
        </div>
        {/* 右列：历史详情 */}
        <div className="mt-4 lg:mt-0 p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="text-sm text-white/50 mb-1">历史说明</div>
          <div className="text-sm text-white/70">桌面端可查看详细历史对比</div>
        </div>
      </div>
    </div>
  );
}
