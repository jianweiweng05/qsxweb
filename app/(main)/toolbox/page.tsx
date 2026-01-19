"use client";

import { useState } from "react";
import { ProGate } from "@/app/lib/gate";
import { HelpButton } from "./help-modal";
import { useReport } from "../report-provider";

export default function ToolboxPage() {
  const { data: payload } = useReport();
  const [totalAmount, setTotalAmount] = useState("1,000,000");

  const proStrategyText = payload?.pro_strategy_text;
  const similarityText = payload?.similarity_text;
  const crossAsset = payload?.cross_asset;

  const parseAmount = (input: string): number => {
    const num = parseFloat(input.replace(/,/g, ''));
    return isNaN(num) ? 0 : num;
  };

  const formatAmount = (amount: number): string => {
    return amount.toLocaleString('en-US', { maximumFractionDigits: 0 });
  };

  const parsePercentage = (text: string): { operator: string; value: number } | null => {
    const match = text.match(/([≤≥])(\d+)%/);
    if (!match) return null;
    return { operator: match[1], value: parseFloat(match[2]) / 100 };
  };

  const calculateAmount = (percentText: string, total: number): string => {
    const parsed = parsePercentage(percentText);
    if (!parsed || total === 0) return '—';
    const amount = total * parsed.value;
    return `${parsed.operator}${formatAmount(amount)}`;
  };

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
                  <div className="text-xs text-white/50 mb-2">资产红绿灯</div>
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
                            {String(item.key)}
                          </text>
                        </g>
                      );
                    })}
                  </svg>

                  <div className="mt-4 space-y-2">
                    {crossAsset.public.assets_8.map((item: any, i: number) => (
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
                      </div>
                    ))}
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
                      {crossAsset.pro?.position_caps && (
                        <div>
                          <div className="text-xs text-white/50 mb-2">仓位上限计算器</div>
                          <input
                            type="text"
                            value={totalAmount}
                            onChange={(e) => setTotalAmount(e.target.value)}
                            placeholder="输入总资产"
                            className="w-full mb-3 px-3 py-2 bg-white/5 border border-white/10 rounded text-sm text-white/90 font-mono focus:outline-none focus:border-cyan-500/50"
                          />
                          <div className="space-y-2">
                            {Object.entries(crossAsset.pro.position_caps).map(([key, val]) => {
                              const total = parseAmount(totalAmount);
                              const amountText = calculateAmount(String(val), total);
                              return (
                                <div key={key} className="bg-white/5 rounded px-3 py-2">
                                  <div className="flex justify-between items-baseline mb-1">
                                    <span className="text-white/60 text-xs">{key}</span>
                                    <span className="text-white/90 font-mono text-sm">{amountText}</span>
                                  </div>
                                  <div className="text-white/40 text-[10px] text-right">{String(val)}</div>
                                </div>
                              );
                            })}
                            {crossAsset.pro?.portfolio_rules?.risk_assets_max && (
                              <div className="bg-cyan-500/10 border border-cyan-500/20 rounded px-3 py-2">
                                <div className="flex justify-between items-baseline mb-1">
                                  <span className="text-cyan-400/80 text-xs">风险资产合计上限</span>
                                  <span className="text-cyan-400 font-mono text-sm">
                                    {calculateAmount(String(crossAsset.pro.portfolio_rules.risk_assets_max), parseAmount(totalAmount))}
                                  </span>
                                </div>
                                <div className="text-cyan-400/40 text-[10px] text-right">{String(crossAsset.pro.portfolio_rules.risk_assets_max)}</div>
                              </div>
                            )}
                            {crossAsset.pro?.portfolio_rules?.cash_min && (
                              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded px-3 py-2">
                                <div className="flex justify-between items-baseline mb-1">
                                  <span className="text-yellow-400/80 text-xs">现金最低保留</span>
                                  <span className="text-yellow-400 font-mono text-sm">
                                    {calculateAmount(String(crossAsset.pro.portfolio_rules.cash_min), parseAmount(totalAmount))}
                                  </span>
                                </div>
                                <div className="text-yellow-400/40 text-[10px] text-right">{String(crossAsset.pro.portfolio_rules.cash_min)}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      {crossAsset.pro?.portfolio_rules && (
                        <div>
                          <div className="text-xs text-white/50 mb-2">组合规则</div>
                          <div className="space-y-1">
                            {Object.entries(crossAsset.pro.portfolio_rules).map(([key, val]) => (
                              <div key={key} className="flex justify-between text-xs">
                                <span className="text-white/60">{key}</span>
                                <span className="text-white/90 font-mono">{String(val)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {crossAsset.pro?.methodology_note && (
                        <div className="pt-2 border-t border-white/10">
                          <div className="text-[10px] text-white/40 leading-relaxed">{crossAsset.pro.methodology_note}</div>
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
