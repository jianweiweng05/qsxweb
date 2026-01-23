"use client";

import { useState } from "react";
import { VIPGate, ProGate } from "@/app/lib/gate";
import { HelpButton } from "../toolbox/help-modal";
import { useReport } from "../report-provider";

export default function TodayPage() {
  const { data: payload, isLoading } = useReport();
  const [expandComment, setExpandComment] = useState(false);
  const [expandAllocation, setExpandAllocation] = useState(false);
  const [expandGamma, setExpandGamma] = useState(false);

  if (isLoading) {
    return (
      <div className="py-8 text-white">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-white/5 rounded w-32" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map(i => <div key={i} className="h-24 bg-white/5 rounded" />)}
          </div>
        </div>
      </div>
    );
  }

  const weatherTitle = payload?.weather?.title || "暂无数据";
  const generatedAt = payload?.generated_at
    ? new Date(payload.generated_at).toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" })
    : "暂无数据";
  const riskCap =
    payload?.risk_cap != null ? Math.round(payload.risk_cap * 100 * 10) / 10 : null;
  const gammaTitle = payload?.gamma?.title || "暂无数据";

  const oneLiner = payload?.ai_json?.one_liner || "暂无数据";
  const marketComment = payload?.ai_json?.market_comment || "暂无数据";
  const bearish = payload?.ai_json?.collision?.bearish_2 || [];
  const bullish = payload?.ai_json?.collision?.bullish_2 || [];

  const cryptoAllocation = payload?.crypto_risk_allocation;
  const allocationWeights = cryptoAllocation?.weights;
  const allocationLocks = cryptoAllocation?.locks;
  const allocationOneLiner = cryptoAllocation?.one_liner;

  return (
    <div className="text-white pb-28">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-6 py-8">
        <div className="flex items-baseline justify-between mb-10">
          <h1 className="text-xl font-semibold">今日概览</h1>
          <span className="text-xs text-white/40">{generatedAt}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 text-xs text-white/40 mb-3">
              <span>市场状态</span>
              <HelpButton indicatorKey="market_weather" />
            </div>
            <div className="text-[22px] font-semibold text-white/90 leading-snug mb-3">
              {weatherTitle}
            </div>

            {/* Collapsible Gamma section */}
            <button
              onClick={() => setExpandGamma(!expandGamma)}
              className="flex items-center gap-1.5 text-[10px] text-cyan-400/70 hover:text-cyan-400 transition-colors"
            >
              <span>{expandGamma ? "收起波动详情 ▲" : "查看波动详情 ▼"}</span>
              <span className="px-1 py-0.5 text-[8px] rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                PRO
              </span>
            </button>

            {/* Collapsible gamma details - PRO exclusive */}
            {expandGamma && (
              <ProGate
                lockedMessage="升级 Pro 查看波动详情"
                unlockConfig={{
                  title: "波动状态监控",
                  description: "实时追踪市场波动率变化，帮助您把握市场节奏，优化进出场时机。",
                  features: ["Gamma 波动率实时监控", "市场情绪波动预警", "历史波动率对比分析"]
                }}
              >
                <div className="pt-3 space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] text-white/50">
                    <span>波动状态</span>
                    <span className="text-[9px] text-white/30">(Gamma)</span>
                    <HelpButton indicatorKey="gamma" />
                  </div>
                  <div className="text-base font-semibold text-white/90 leading-snug">
                    {gammaTitle}
                  </div>
                </div>
              </ProGate>
            )}
          </div>

          <div className="p-6 rounded-xl bg-cyan-500/15 border border-cyan-500/30">
            <div className="flex items-center gap-2 text-xs text-white/50 mb-3">
              <span>建议仓位</span>
              <HelpButton indicatorKey="risk_cap" />
            </div>
            <div className="text-4xl font-bold text-cyan-400 tracking-tight">
              {riskCap != null ? `≤ ${riskCap}%` : "—"}
            </div>
          </div>

          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-1.5 text-xs text-white/40 mb-3">
              <span>风险配置建议</span>
              <HelpButton indicatorKey="crypto_allocation" />
            </div>
            <ProGate
              lockedMessage="升级 Pro 查看"
              unlockConfig={{
                title: "风险配置建议",
                description: "基于市场结构风险分析，为您提供 BTC、ETH 和山寨币的动态配置建议。",
                features: ["实时资产配置权重", "风险传导分析", "流动性闸门监控"]
              }}
            >
              {allocationWeights ? (
                <div className="space-y-3">
                  {/* One-liner summary - visible to PRO users */}
                  {allocationOneLiner && (
                    <div className="text-[11px] text-white/90 leading-relaxed">
                      {allocationOneLiner}
                    </div>
                  )}

                  {/* Expand/Collapse button */}
                  <button
                    onClick={() => setExpandAllocation(!expandAllocation)}
                    className="flex items-center gap-1.5 text-[10px] text-cyan-400/70 hover:text-cyan-400 transition-colors"
                  >
                    <span>{expandAllocation ? "收起配置详情 ▲" : "查看配置详情 ▼"}</span>
                    <span className="px-1 py-0.5 text-[8px] rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                      PRO
                    </span>
                  </button>

                  {/* Collapsible allocation details - PRO exclusive */}
                  {expandAllocation && (
                    <ProGate
                      lockedMessage="升级 Pro 查看配置详情"
                      unlockConfig={{
                        title: "配置详情",
                        description: "查看 BTC、ETH 和山寨币的具体配置权重。",
                        features: ["实时资产配置权重", "风险传导分析", "流动性闸门监控"]
                      }}
                    >
                      <div className="space-y-2.5 pt-2">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] text-white/60">BTC</span>
                            <span className="text-xs font-bold text-cyan-400">
                              {(allocationWeights.BTC * 100).toFixed(0)}%
                            </span>
                          </div>
                          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400"
                              style={{ width: `${allocationWeights.BTC * 100}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] text-white/60">ETH</span>
                            <span className="text-xs font-bold text-cyan-400">
                              {(allocationWeights.ETH * 100).toFixed(0)}%
                            </span>
                          </div>
                          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400"
                              style={{ width: `${allocationWeights.ETH * 100}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-1">
                              <span className="text-[10px] text-white/60">ALTS</span>
                              {allocationLocks?.ALTS && (
                                <span className="text-[8px]">🔒</span>
                              )}
                            </div>
                            <span className="text-xs font-bold text-white/40">
                              {(allocationWeights.ALTS * 100).toFixed(0)}%
                            </span>
                          </div>
                          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-white/20"
                              style={{ width: `${allocationWeights.ALTS * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </ProGate>
                  )}
                </div>
              ) : (
                <div className="text-sm text-white/40">暂无数据</div>
              )}
            </ProGate>
          </div>
        </div>

        <div className="rounded-xl bg-white/6 border border-white/10 p-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2 text-sm font-medium text-white/60">
              <span>机构分析师观点</span>
              <HelpButton indicatorKey="ai_analysis" />
            </div>
            <button
              className="text-xs text-white/50 hover:text-white/80"
              onClick={() => setExpandComment(v => !v)}
            >
              {expandComment ? "收起" : "展开"}
            </button>
          </div>

          <VIPGate
            lockedMessage="AI 解读需要 VIP 订阅"
            unlockConfig={{
              title: "AI 市场解读",
              description: "基于多维度数据分析，为您提供专业的市场解读和投资建议。",
              features: ["每日市场核心观点总结", "多空信号智能识别", "关键风险点提示"]
            }}
          >
            <div className="space-y-4">
              <div className="text-sm text-white/95 font-medium leading-relaxed">
                {oneLiner}
              </div>
              <div className={expandComment ? "text-sm text-white/70 leading-relaxed" : "text-sm text-white/70 leading-relaxed line-clamp-5"}>
                {marketComment}
              </div>
            </div>
          </VIPGate>
        </div>

        {(bearish.length > 0 || bullish.length > 0) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-8">
            <div className="p-5 rounded-xl bg-red-500/8 border border-red-500/15">
              <div className="flex items-center gap-2 text-xs text-red-400/80 mb-3">
                <span>空方信号</span>
                <HelpButton indicatorKey="bearish_signals" />
              </div>
              <VIPGate lockedMessage="VIP 可见">
                {bearish.length > 0 ? (
                  <div className="space-y-2">
                    {bearish.map((item: string, i: number) => (
                      <div key={i} className="text-xs text-white/70 leading-relaxed">
                        • {item}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-white/40">暂无</div>
                )}
              </VIPGate>
            </div>

            <div className="p-5 rounded-xl bg-green-500/8 border border-green-500/15">
              <div className="flex items-center gap-2 text-xs text-green-400/80 mb-3">
                <span>多方信号</span>
                <HelpButton indicatorKey="bullish_signals" />
              </div>
              <VIPGate lockedMessage="VIP 可见">
                {bullish.length > 0 ? (
                  <div className="space-y-2">
                    {bullish.map((item: string, i: number) => (
                      <div key={i} className="text-xs text-white/70 leading-relaxed">
                        • {item}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-white/40">暂无</div>
                )}
              </VIPGate>
            </div>
          </div>
        )}

        <div className="p-5 rounded-xl bg-red-500/10 border border-red-500/20 mt-8">
          <div className="text-sm font-medium text-red-400 mb-2">📌 风险提示</div>
          <div className="text-xs text-white/60 leading-relaxed">
            本系统为研究型全市场风险分析工具，基于多维历史数据与结构化模型提供风险环境参考，不构成投资建议或收益承诺，所有决策与风险由用户自行承担。
          </div>
        </div>
      </div>
    </div>
  );
}