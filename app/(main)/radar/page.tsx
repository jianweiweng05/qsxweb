export const dynamic = "force-dynamic";

export default function RadarPage() {
  return (
    <div className="p-4 text-white min-h-full bg-black/90">
      <h1 className="text-xl font-bold mb-4">雷达</h1>
      <div className="lg:grid lg:grid-cols-2 lg:gap-6">
        {/* 左列：主可视化 */}
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="text-white/50">
            雷达页（后续接入 payload.ui.radar）
          </div>
        </div>
        {/* 右列：详情说明 */}
        <div className="mt-4 lg:mt-0 p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="text-sm text-white/50 mb-1">雷达说明</div>
          <div className="text-sm text-white/70">桌面端可查看更多雷达指标详情</div>
        </div>
      </div>
    </div>
  );
}
