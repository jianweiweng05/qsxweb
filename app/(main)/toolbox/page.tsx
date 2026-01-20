"use client";

import { useState } from "react";
import { ProGate } from "@/app/lib/gate";
import { HelpButton } from "./help-modal";
import { useReport } from "../report-provider";

export default function ToolboxPage() {
  const { data: payload } = useReport();
  const [similarityExpanded, setSimilarityExpanded] = useState(false);

  const proStrategyText = payload?.pro_strategy_text;
  const similarityText = payload?.similarity_text;
  const similarityTop3 = payload?.similarity?.top3;
  const similarityProSummary = payload?.similarity_pro_summary;
  const crossAsset = payload?.cross_asset;

  return (
    <div className="min-h-full bg-black/90 text-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-6">

        <h1 className="text-xl font-bold mb-6">工具箱</h1>

        {/* 全球资产风险监控仪 */}
        {crossAsset?.public?.assets_8 && Array.isArray(crossAsset.public.assets_8) && (() => {
          const green = crossAsset.public.assets_8.filter((x: any) => x.action === 'IN');
          const yellow = crossAsset.public.assets_8.filter((x: any) => x.action === 'NEUTRAL');
          const red = crossAsset.public.assets_8.filter((x: any) => x.action === 'OUT');

          const reordered: any[] = [];
          const maxLen = Math.max(green.length, yellow.length, red.length);
          for (let i = 0; i < maxLen; i++) {
            if (i < green.length) reordered.push(green[i]);
            if (i < yellow.length) reordered.push(yellow[i]);
            if (i < red.length) reordered.push(red[i]);
          }

          const weights = { IN: 3, NEUTRAL: 2, OUT: 1 };
          const totalWeight = reordered.reduce((sum, item) => sum + (weights[item.action as keyof typeof weights] || 1), 0);
          const gap = 2;

          const outerR = 100;
          const innerR = 60;
          const cx = 130;
          const cy = 130;

          let currentAngle = -90;

          return (
            <div className="mb-8 p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 text-sm font-medium text-white/80 mb-4">
                <span>全球资产风险监控仪</span>
                <HelpButton indicatorKey="cross_asset_rotation" />
              </div>

              <div className="grid lg:grid-cols-[320px_1fr] gap-6">
                {/* 左侧：图表 + 资产列表 */}
                <div>
                  <svg
                    width="260"
                    height="260"
                    viewBox="-20 -20 300 300"
                    className="overflow-visible max-w-full"
                  >
                    {reordered.map((item: any, i: number) => {
                      const weight = weights[item.action as keyof typeof weights] || 1;
                      const segmentAngle = (weight / totalWeight) * 360;

                      const startAngle = currentAngle;
                      const endAngle = currentAngle + segmentAngle - gap;
                      currentAngle += segmentAngle;

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
                        item.action === "IN"
                          ? "#22c55e"
                          : item.action === "NEUTRAL"
                            ? "#eab308"
                            : "#ef4444";

                      const midAngle = (startAngle + endAngle) / 2;
                      const midRad = (midAngle * Math.PI) / 180;
                      const labelX = cx + (outerR + 18) * Math.cos(midRad);
                      const labelY = cy + (outerR + 18) * Math.sin(midRad);

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
                            className="fill-white text-[10px] font-medium"
                          >
                            {String(item.label)}
                          </text>
                        </g>
                      );
                    })}
                  </svg>

                  <div className="mt-4 space-y-2">
                    {crossAsset.public.assets_8.map((item: any, i: number) => {
                      const posKey = item.key === 'SPX' ? 'US_EQUITY' :
                                     item.key === 'GOLD' ? 'GOLD' :
                                     item.key === 'BTC' ? 'BTC' :
                                     item.key === 'ETH' ? 'ETH' :
                                     item.key === 'CASH' ? 'CASH' : item.key;
                      const positionCap = crossAsset.pro?.position_caps?.[posKey];

                      return (
                        <div key={i} className="flex items-center gap-2 text-xs">
                          <div
                            className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${item.action === "IN"
                                ? "bg-green-400"
                                : item.action === "NEUTRAL"
                                  ? "bg-yellow-400"
                                  : "bg-red-400"
                              }`}
                          />
                          <span className="text-white/80">{String(item.label)}</span>
                          <span className="text-white/40 text-[10px]">{String(item.action)}</span>
                          {positionCap && (
                            <span className="text-cyan-400/70 text-[10px] ml-auto">{String(positionCap)}</span>
                          )}
                          {item.one_liner && (
                            <span className="text-white/40 text-[10px] truncate max-w-[120px]">{String(item.one_liner)}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 右侧：Pro 分析 */}
                <div className="min-w-0 min-h-[280px]">
                  <ProGate lockedMessage="升级 Pro 查看深度分析">
                    <div className="space-y-4">
                      {crossAsset.public.macro_one_liner && (
                        <div>
                          <div className="flex items-center gap-2 text-xs text-white/50 mb-2">
                            <span>宏观结论</span>
                            <HelpButton indicatorKey="macro_summary" />
                          </div>
                          <div className="text-xs text-white/80 leading-relaxed">
                            {String(crossAsset.public.macro_one_liner)}
                          </div>
                        </div>
                      )}
                      {crossAsset.pro?.portfolio_conclusion && (
                        <div>
                          <div className="text-xs text-white/50 mb-2">组合结论</div>
                          <div className="space-y-1">
                            {crossAsset.pro.portfolio_conclusion.map((line: string, i: number) => (
                              <div key={i} className="text-xs text-white/80 leading-relaxed">• {line}</div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </ProGate>
                </div>
              </div>
            </div>
          );
        })()}

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-white/80">
              <span>今日相似度</span>
              <HelpButton indicatorKey="similarity_analysis" />
            </div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/10 relative min-h-[320px]">
              <ProGate lockedMessage="升级 Pro 查看完整分析">
                {similarityText && (
                  <div className="text-xs text-cyan-300/90 whitespace-pre-wrap leading-relaxed mb-3">
                    {similarityText}
                  </div>
                )}
                {similarityProSummary && (
                  <div className="mb-3 p-3 rounded-lg bg-white/5 border border-white/10 space-y-2">
                    {typeof similarityProSummary === 'string' && similarityProSummary.split('\n').map((line: string, i: number) => (
                      line.trim() && (
                        <div key={i} className="text-xs text-white/80">
                          {line}
                        </div>
                      )
                    ))}
                  </div>
                )}
                {similarityTop3 && Array.isArray(similarityTop3) && similarityTop3.length > 0 && (
                  <>
                    <button
                      onClick={() => setSimilarityExpanded(!similarityExpanded)}
                      className="w-full flex items-center justify-between px-3 py-2 bg-white/5 rounded text-xs text-white/50 hover:text-white/70 transition-colors mb-2"
                    >
                      <span>历史结构卡片</span>
                      <svg className={`w-3 h-3 transition-transform ${similarityExpanded ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                    {similarityExpanded && (
                      <div className="space-y-3">
                        {similarityTop3.map((item: any, i: number) => (
                          <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/10">
                            <div className="text-xs text-white/70 leading-relaxed whitespace-pre-wrap">
                              {typeof item === 'string' ? item : JSON.stringify(item, null, 2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
                {!similarityText && !similarityProSummary && (!similarityTop3 || similarityTop3.length === 0) && (
                  <div className="text-xs text-white/50">暂无历史相似性数据</div>
                )}
              </ProGate>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-white/80">
              <span>今日策略指引</span>
              <HelpButton indicatorKey="pro_strategy" />
            </div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/10 relative min-h-[320px]">
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
