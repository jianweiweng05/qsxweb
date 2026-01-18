import { getReportPayload } from "@/app/lib/qsx_api";
import { ProGate } from "@/app/lib/gate";
import { HelpButton } from "./help-modal";

export const dynamic = "force-dynamic";

export default async function ToolboxPage() {
  let payload: any = null;
  try {
    payload = await getReportPayload();
  } catch {
    payload = null;
  }

  const proStrategyText = payload?.pro_strategy_text;
  const similarityText = payload?.similarity_text;
  const crossAsset = payload?.cross_asset;

  return (
    <div className="min-h-full bg-black/90 text-white">
      {/* 页面居中容器，解决大屏偏移 */}
      <div className="mx-auto w-full max-w-6xl px-4 py-6">

        <h1 className="text-xl font-bold mb-6">PRO 工具箱</h1>

        {/* 跨资产轮动分析器 */}
        {crossAsset?.asset_board && Array.isArray(crossAsset.asset_board) && (() => {
          const total = crossAsset.asset_board.length;
          const segmentAngle = 360 / total;
          const gap = 2;
          const outerR = 120;
          const innerR = 72;
          const cx = 160;
          const cy = 160;

          return (
            <div className="mb-8 p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="text-sm font-medium text-white/80 mb-4">
                跨资产轮动分析器
              </div>

              <div className="flex flex-col lg:flex-row gap-8">
                {/* 图表 */}
                <div className="flex-shrink-0 mx-auto lg:mx-0">
                  <div className="text-xs text-white/50 mb-3">资产红绿灯</div>
                  <svg
                    width="320"
                    height="320"
                    viewBox="-40 -40 400 400"
                    className="overflow-visible"
                  >
                    {crossAsset.asset_board.map((item: any, i: number) => {
                      const startAngle = i * segmentAngle - 90;
                      const endAngle = (i + 1) * segmentAngle - 90 - gap;
                      const startRad = (startAngle * Math.PI) / 180;
                      const endRad = (endAngle * Math.PI) / 180;

                      const x1o = cx + outerR * Math.cos(startRad);
                      const y1o = cy + outerR * Math.sin(startRad);
                      const x2o = cx + outerR * Math.cos(endRad);
                      const y2o = cy + outerR * Math.sin(endRad);
                      const x1i = cx + innerR * Math.cos(startRad);
                      const y1i = cy + innerR * Math.sin(startRad);
                      const x2i = cx + innerR * Math.cos(endRad);
                      const y2i = cy + innerR * Math.sin(endRad);

                      const largeArc = endAngle - startAngle > 180 ? 1 : 0;
                      const color =
                        item.signal === "GREEN"
                          ? "#22c55e"
                          : item.signal === "YELLOW"
                            ? "#eab308"
                            : "#ef4444";

                      const midAngle = (startAngle + endAngle) / 2;
                      const midRad = (midAngle * Math.PI) / 180;
                      const labelX = cx + (outerR + 22) * Math.cos(midRad);
                      const labelY = cy + (outerR + 22) * Math.sin(midRad);

                      return (
                        <g key={i}>
                          <path
                            d={`M ${x1o} ${y1o}
                                A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2o} ${y2o}
                                L ${x2i} ${y2i}
                                A ${innerR} ${innerR} 0 ${largeArc} 0 ${x1i} ${y1i}
                                Z`}
                            fill={color}
                          />
                          <text
                            x={labelX}
                            y={labelY}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="fill-white text-[11px] font-medium"
                          >
                            {String(item.label)}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* 说明区 */}
                <div className="flex-1 space-y-4">
                  {crossAsset.macro_summary?.one_liner && (
                    <div className="pb-3 border-b border-white/10">
                      <div className="text-sm font-medium text-white/70 mb-2">
                        宏观结论
                      </div>
                      <div className="text-sm text-white/80 leading-relaxed">
                        {String(crossAsset.macro_summary.one_liner)}
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    {crossAsset.asset_board.map((item: any, i: number) => (
                      <div
                        key={i}
                        className="pb-2 border-b border-white/5 last:border-0"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div
                            className={`w-2 h-2 rounded-full ${item.signal === "GREEN"
                                ? "bg-green-400"
                                : item.signal === "YELLOW"
                                  ? "bg-yellow-400"
                                  : "bg-red-400"
                              }`}
                          />
                          <span className="text-sm font-medium">
                            {String(item.label)}
                          </span>
                          <span className="text-xs text-white/60">
                            {String(item.action)}
                          </span>
                        </div>
                        <div className="text-xs text-white/60 pl-4 leading-relaxed">
                          {String(item.one_liner)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* 下方左右结构 */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* 左 */}
          <div className="space-y-4">
            <div className="text-sm font-medium text-white/80">今日相似度</div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/10 relative min-h-[320px]">
              <div className="absolute bottom-3 right-3">
                <HelpButton content={<div className="text-xs text-white/70">历史相似性用于环境识别，不是预测工具。</div>} />
              </div>
              <ProGate lockedMessage="升级 Pro 查看完整分析">
                {similarityText ? (
                  <pre className="text-xs text-cyan-300/90 whitespace-pre-wrap leading-relaxed">
                    {similarityText}
                  </pre>
                ) : (
                  <div className="text-xs text-white/50">暂无历史相似性数据</div>
                )}
              </ProGate>
            </div>
          </div>

          {/* 右 */}
          <div className="space-y-4">
            <div className="text-sm font-medium text-white/80">今日策略指引</div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/10 relative min-h-[320px]">
              <div className="absolute bottom-3 right-3">
                <HelpButton content={<div className="text-xs text-white/70">策略用于风险管理，不构成投资建议。</div>} />
              </div>
              <ProGate lockedMessage="升级 Pro 查看今日策略">
                {proStrategyText ? (
                  <pre className="text-xs text-white/70 whitespace-pre-wrap leading-relaxed font-mono">
                    {proStrategyText}
                  </pre>
                ) : (
                  <div className="text-xs text-white/50">暂无在线策略输出</div>
                )}
              </ProGate>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}