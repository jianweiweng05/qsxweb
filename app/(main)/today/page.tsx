"use client";

import { useState } from "react";
import { VIPGate, ProGate } from "@/app/lib/gate";
import { HelpButton } from "../toolbox/help-modal";
import { useReport } from "../report-provider";

export default function TodayPage() {
  const { data: payload, isLoading } = useReport();
  const [expandComment, setExpandComment] = useState(false);

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
            <div className="text-[22px] font-semibold text-white/90 leading-snug">
              {weatherTitle}
            </div>
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
              <span>波动状态</span>
              <span className="text-[9px] text-white/30">(Gamma)</span>
              <HelpButton indicatorKey="gamma" />
              <span className="px-1 py-0.5 text-[8px] rounded bg-white/5 text-white/40 border border-white/10">
                PRO
              </span>
            </div>
            <ProGate
              lockedMessage="升级 Pro 查看"
              unlockConfig={{
                title: "波动状态监控",
                description: "实时追踪市场波动率变化，帮助您把握市场节奏，优化进出场时机。",
                features: ["Gamma 波动率实时监控", "市场情绪波动预警", "历史波动率对比分析"]
              }}
            >
              <div className="text-[22px] font-semibold text-white/90 leading-snug">
                {gammaTitle}
              </div>
            </ProGate>
          </div>
        </div>

        {allocationWeights && (
          <div className="rounded-xl bg-white/5 border border-white/10 p-6 mb-8">
            <div className="flex items-center gap-2 text-sm font-medium text-white/60 mb-5">
              <span>加密资产配置</span>
              <HelpButton indicatorKey="crypto_allocation" />
              <span className="px-1.5 py-0.5 text-[9px] rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-medium">
                PRO
              </span>
            </div>

            <ProGate
              lockedMessage="升级 Pro 查看资产配置建议"
              unlockConfig={{
                title: "加密资产配置",
                description: "基于市场结构风险分析，为您提供 BTC、ETH 和山寨币的动态配置建议。",
                features: ["实时资产配置权重", "风险传导分析", "流动性闸门监控"]
              }}
            >
              <div className="space-y-4">
                {/* BTC */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white/80 font-medium">BTC</span>
                    <span className="text-lg font-bold text-cyan-400">
                      {(allocationWeights.BTC * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full"
                      style={{ width: `${allocationWeights.BTC * 100}%` }}
                    />
                  </div>
                </div>

                {/* ETH */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white/80 font-medium">ETH</span>
                    <span className="text-lg font-bold text-cyan-400">
                      {(allocationWeights.ETH * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full"
                      style={{ width: `${allocationWeights.ETH * 100}%` }}
                    />
                  </div>
                </div>

                {/* ALTS */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white/80 font-medium">ALTS</span>
                      {allocationLocks?.ALTS && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                          🔒 已锁定
                        </span>
                      )}
                    </div>
                    <span className="text-lg font-bold text-white/40">
                      {(allocationWeights.ALTS * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white/20 rounded-full"
                      style={{ width: `${allocationWeights.ALTS * 100}%` }}
                    />
                  </div>
                </div>

                {allocationOneLiner && (
                  <div className="pt-3 mt-3 border-t border-white/10">
                    <div className="text-xs text-white/60 leading-relaxed">
                      {allocationOneLiner}
                    </div>
                  </div>
                )}
              </div>
            </ProGate>
          </div>
        )}

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