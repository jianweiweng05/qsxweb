"use client";

import { useState } from "react";
import { VIPGate, ProGate } from "@/app/lib/gate";
import { HelpButton } from "../toolbox/help-modal";
import { useReport } from "../report-provider";
import { useTranslation, getBilingualText } from "@/app/lib/i18n";
import { getBilingualMarketText } from "@/app/lib/market-regime-translator";

// Weather icon mapping based on market state
function getWeatherIcon(weatherTitle: string): string {
  const state = weatherTitle.split('｜')[0].trim();

  if (state.includes('牛市过热')) return '🌞'; // Scorching sun
  if (state.includes('健康牛市') || state.includes('牛市')) return '☀️'; // Sunny
  if (state.includes('震荡市')) return '🌤️'; // Partly cloudy with sun
  if (state.includes('熊市震荡')) return '🌧️'; // Light rain
  if (state.includes('熊市恐慌')) return '⛈️'; // Thunderstorm
  if (state.includes('熊市')) return '🌧️'; // Light rain (default bear)

  return '☁️'; // Default cloudy
}

export default function TodayPage() {
  const { data: payload, isLoading, mutate } = useReport();
  const { lang, t } = useTranslation();
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

  // Get original Chinese title for icon determination
  const weatherTitleOriginal = typeof payload?.weather?.title === 'string'
    ? payload.weather.title
    : (payload?.weather?.title?.zh || '');
  const weatherTitle = getBilingualMarketText(payload?.weather?.title, lang) || t.noData;

  // New weather data structure
  const macroState = payload?.macro_state || t.noData;
  const qsx100Index = payload?.weather?.index != null ? Math.round(payload.weather.index) : null;
  const operationSuggestion = payload?.weather?.suggestion || t.noData;

  const generatedAt = payload?.generated_at
    ? new Date(payload.generated_at).toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" })
    : t.noData;
  const riskCap =
    payload?.risk_cap != null ? Math.round(payload.risk_cap * 100 * 10) / 10 : null;
  const gammaTitle = getBilingualMarketText(payload?.gamma?.title, lang) || t.noData;

  const oneLiner = getBilingualText(payload?.ai_json?.one_liner, lang) || t.noData;
  const marketComment = getBilingualText(payload?.ai_json?.market_comment, lang) || t.noData;
  const bearish = payload?.ai_json?.collision?.bearish_2 || [];
  const bullish = payload?.ai_json?.collision?.bullish_2 || [];

  const cryptoAllocation = payload?.crypto_risk_allocation;
  const allocationWeights = cryptoAllocation?.weights;
  const allocationLocks = cryptoAllocation?.locks;
  const allocationOneLiner = getBilingualText(cryptoAllocation?.one_liner, lang);

  // Debug: log the allocation data
  if (typeof window !== 'undefined') {
    console.log('[TodayPage] crypto_risk_allocation:', cryptoAllocation);
    console.log('[TodayPage] allocationWeights:', allocationWeights);
  }

  return (
    <div className="text-white pb-28">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-6 py-8">
        <div className="flex items-baseline justify-between mb-10">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold">{t.todayOverview}</h1>
            <span className="text-2xl" title={weatherTitle}>
              {getWeatherIcon(macroState)}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => mutate()}
              className="text-xs text-cyan-400/70 hover:text-cyan-400 transition-colors"
              title="刷新数据"
            >
              🔄
            </button>
            <span className="text-xs text-white/40">{generatedAt}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            {/* 市场状态 */}
            <div className="mb-4 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2 text-xs text-white/40 mb-3">
                <span>市场状态</span>
                <HelpButton indicatorKey="market_weather" />
              </div>
              <div className="text-2xl font-bold text-cyan-400">
                {macroState}
              </div>
            </div>

            {/* Collapsible Gamma section */}
            <button
              onClick={() => setExpandGamma(!expandGamma)}
              className="flex items-center gap-1.5 text-[10px] text-cyan-400/70 hover:text-cyan-400 transition-colors"
            >
              <span>{expandGamma ? `${t.hideVolatilityDetails} ▲` : `${t.viewVolatilityDetails} ▼`}</span>
              <span className="px-1 py-0.5 text-[8px] rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                PRO
              </span>
            </button>

            {/* Collapsible gamma details - PRO exclusive */}
            {expandGamma && (
              <ProGate
                lockedMessage={t.upgradeProForVolatility}
                unlockConfig={{
                  title: t.volatilityMonitoringTitle,
                  description: t.volatilityMonitoringDesc,
                  features: [t.volatilityFeature1, t.volatilityFeature2, t.volatilityFeature3]
                }}
              >
                <div className="pt-3 space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] text-white/50">
                    <span>{t.volatilityStatus}</span>
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
              <span>{t.recommendedPosition}</span>
              <HelpButton indicatorKey="risk_cap" />
            </div>
            <div className="flex items-end justify-between gap-3">
              <div className="text-4xl font-bold text-cyan-400 tracking-tight">
                {riskCap != null ? `≤ ${riskCap}%` : "—"}
              </div>
              <div className="text-base font-medium text-white/70 pb-1">
                分批买入
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-1.5 text-xs text-white/40 mb-3">
              <span>{t.riskAllocation}</span>
              <HelpButton indicatorKey="crypto_allocation" />
            </div>
            <ProGate
              lockedMessage={t.upgradeProForAllocation}
              unlockConfig={{
                title: t.riskAllocationTitle,
                description: t.riskAllocationDesc,
                features: [t.riskAllocationFeature1, t.riskAllocationFeature2, t.riskAllocationFeature3]
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
                    <span>{expandAllocation ? `${t.hideAllocationDetails} ▲` : `${t.viewAllocationDetails} ▼`}</span>
                    <span className="px-1 py-0.5 text-[8px] rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                      PRO
                    </span>
                  </button>

                  {/* Collapsible allocation details - PRO exclusive */}
                  {expandAllocation && (
                    <ProGate
                      lockedMessage={t.upgradeProForDetails}
                      unlockConfig={{
                        title: t.allocationDetailsTitle,
                        description: t.allocationDetailsDesc,
                        features: [t.riskAllocationFeature1, t.riskAllocationFeature2, t.riskAllocationFeature3]
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
                <div className="text-sm text-white/40">{t.noData}</div>
              )}
            </ProGate>
          </div>
        </div>

        <div className="rounded-xl bg-white/6 border border-white/10 p-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2 text-sm font-medium text-white/60">
              <span>{t.aiAnalysis}</span>
              <HelpButton indicatorKey="ai_analysis" />
            </div>
            <button
              className="text-xs text-white/50 hover:text-white/80"
              onClick={() => setExpandComment(v => !v)}
            >
              {expandComment ? t.collapse : t.expand}
            </button>
          </div>

          <VIPGate
            lockedMessage={t.vipRequired}
            unlockConfig={{
              title: t.aiMarketAnalysisTitle,
              description: t.aiMarketAnalysisDesc,
              features: [t.aiMarketFeature1, t.aiMarketFeature2, t.aiMarketFeature3]
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
                <span>{t.bearishSignals}</span>
                <HelpButton indicatorKey="bearish_signals" />
              </div>
              <VIPGate lockedMessage={t.vipVisible}>
                {bearish.length > 0 ? (
                  <div className="space-y-2">
                    {bearish.map((item: string, i: number) => (
                      <div key={i} className="text-xs text-white/70 leading-relaxed">
                        • {item}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-white/40">{t.noData}</div>
                )}
              </VIPGate>
            </div>

            <div className="p-5 rounded-xl bg-green-500/8 border border-green-500/15">
              <div className="flex items-center gap-2 text-xs text-green-400/80 mb-3">
                <span>{t.bullishSignals}</span>
                <HelpButton indicatorKey="bullish_signals" />
              </div>
              <VIPGate lockedMessage={t.vipVisible}>
                {bullish.length > 0 ? (
                  <div className="space-y-2">
                    {bullish.map((item: string, i: number) => (
                      <div key={i} className="text-xs text-white/70 leading-relaxed">
                        • {item}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-white/40">{t.noData}</div>
                )}
              </VIPGate>
            </div>
          </div>
        )}

        <div className="p-5 rounded-xl bg-red-500/10 border border-red-500/20 mt-8">
          <div className="text-sm font-medium text-red-400 mb-2">📌 {t.riskWarning}</div>
          <div className="text-xs text-white/60 leading-relaxed">
            {t.riskDisclaimer}
          </div>
        </div>
      </div>
    </div>
  );
}