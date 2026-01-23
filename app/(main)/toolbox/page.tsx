"use client";

import { ProGate, isPro } from "@/app/lib/gate";
import { HelpButton } from "./help-modal";
import { useReport } from "../report-provider";
import { useState } from "react";

export default function ToolboxPage() {
  const { data: payload } = useReport();
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [expandedHistory, setExpandedHistory] = useState<number | null>(null);
  const isProUser = isPro();

  const strategyMatrix = payload?.strategy_matrix;
  const similarityTop3 = payload?.similarity?.top3;
  const similarityProSummary = payload?.similarity_pro_summary;
  const similarityHistoryRestore = payload?.similarity_history_restore;
  const crossAsset = payload?.cross_asset;

  return (
    <div className="min-h-full bg-black/90 text-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-6">

        <h1 className="text-xl font-bold mb-6">工具箱</h1>

        {/* 全球资产风险监控仪 */}
        {crossAsset?.public?.assets_8 && Array.isArray(crossAsset.public.assets_8) && (() => {
          const allAssets = crossAsset.public.assets_8;
          const green = allAssets.filter((x: any) => x.action === 'IN');
          const yellow = allAssets.filter((x: any) => x.action === 'NEUTRAL' || x.action === 'HOLD');
          const red = allAssets.filter((x: any) => x.action === 'OUT');

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
          const inCount = green.length;
          const outCount = red.length;
          const topIn = green.slice(0, 3);
          const topOut = red.slice(0, 3);

          return (
            <div className="mb-8 p-4 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm relative overflow-hidden">
              {/* 细网格背景 */}
              <div className="absolute inset-0 opacity-5 pointer-events-none" style={{backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%, transparent)', backgroundSize: '50px 50px'}} />

              <div className="relative z-10">
                {/* 顶部状态条 */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-white/80">全球资产风险监控仪</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">Live</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs text-white/50">状态</div>
                      <div className="text-sm font-semibold text-green-400">RISK_ON</div>
                    </div>
                    <HelpButton indicatorKey="cross_asset_rotation" />
                  </div>
                </div>

                <div className="grid lg:grid-cols-[420px_1fr] gap-6">
                  {/* 左侧：双圈仪表 */}
                  <div className="flex flex-col items-center relative">
                    <style>{`
                      @keyframes glow-pulse {
                        0%, 100% { filter: drop-shadow(0 0 8px rgba(34, 197, 94, 0.6)) drop-shadow(0 0 16px rgba(34, 197, 94, 0.3)); }
                        50% { filter: drop-shadow(0 0 12px rgba(34, 197, 94, 0.8)) drop-shadow(0 0 24px rgba(34, 197, 94, 0.5)); }
                      }
                      @keyframes glow-pulse-red {
                        0%, 100% { filter: drop-shadow(0 0 8px rgba(239, 68, 68, 0.6)) drop-shadow(0 0 16px rgba(239, 68, 68, 0.3)); }
                        50% { filter: drop-shadow(0 0 12px rgba(239, 68, 68, 0.8)) drop-shadow(0 0 24px rgba(239, 68, 68, 0.5)); }
                      }
                      @keyframes glow-pulse-yellow {
                        0%, 100% { filter: drop-shadow(0 0 8px rgba(234, 179, 8, 0.6)) drop-shadow(0 0 16px rgba(234, 179, 8, 0.3)); }
                        50% { filter: drop-shadow(0 0 12px rgba(234, 179, 8, 0.8)) drop-shadow(0 0 24px rgba(234, 179, 8, 0.5)); }
                      }
                      @keyframes sphere-rotate {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                      }
                      .gauge-segment-in { animation: glow-pulse 2s ease-in-out infinite; }
                      .gauge-segment-out { animation: glow-pulse-red 2s ease-in-out infinite; }
                      .gauge-segment-neutral { animation: glow-pulse-yellow 2s ease-in-out infinite; }
                      .sphere-3d { animation: sphere-rotate 8s linear infinite; }
                    `}</style>
                    <svg
                      width="360"
                      height="360"
                      viewBox="-20 -20 300 300"
                      className="overflow-visible max-w-full"
                    >
                      <defs>
                        <radialGradient id="earthGradient" cx="30%" cy="30%">
                          <stop offset="0%" stopColor="rgba(120, 180, 240, 0.9)" />
                          <stop offset="50%" stopColor="rgba(70, 130, 200, 0.8)" />
                          <stop offset="100%" stopColor="rgba(30, 80, 150, 0.9)" />
                        </radialGradient>
                        <radialGradient id="earthHighlight" cx="25%" cy="25%">
                          <stop offset="0%" stopColor="rgba(255, 255, 255, 0.4)" />
                          <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
                        </radialGradient>
                        <filter id="glow">
                          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                          <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                          </feMerge>
                        </filter>
                      </defs>

                      {/* 背景圆环 */}
                      <circle cx={cx} cy={cy} r={outerR + 8} fill="none" stroke="rgba(6, 182, 212, 0.15)" strokeWidth="2" opacity="0.5" />
                      <circle cx={cx} cy={cy} r={innerR - 8} fill="none" stroke="rgba(6, 182, 212, 0.1)" strokeWidth="1" opacity="0.3" />

                      {/* 外圈扇区 - 按颜色分组 */}
                      {(() => {
                        const segmentGap = 2;

                        const greenAssets = reordered.filter((item: any) => item.action === 'IN');
                        const yellowAssets = reordered.filter((item: any) => item.action === 'NEUTRAL' || item.action === 'HOLD');
                        const redAssets = reordered.filter((item: any) => item.action === 'OUT');

                        const assetWeights = { red: 1, yellow: 2, green: 4 };
                        const totalWeight = greenAssets.length * assetWeights.green + yellowAssets.length * assetWeights.yellow + redAssets.length * assetWeights.red;
                        const totalGaps = reordered.length * segmentGap;
                        const availableAngle = 360 - totalGaps;

                        const greenAnglePerAsset = totalWeight > 0 ? (availableAngle * assetWeights.green / totalWeight) : 0;
                        const yellowAnglePerAsset = totalWeight > 0 ? (availableAngle * assetWeights.yellow / totalWeight) : 0;
                        const redAnglePerAsset = totalWeight > 0 ? (availableAngle * assetWeights.red / totalWeight) : 0;

                        let currentAngle = -90;
                        const allGroups = [
                          { assets: greenAssets, anglePerAsset: greenAnglePerAsset, color: '#22c55e', className: 'gauge-segment-in' },
                          { assets: yellowAssets, anglePerAsset: yellowAnglePerAsset, color: '#eab308', className: 'gauge-segment-neutral' },
                          { assets: redAssets, anglePerAsset: redAnglePerAsset, color: '#ef4444', className: 'gauge-segment-out' }
                        ];

                        return allGroups.flatMap(({ assets, anglePerAsset, color, className }) => {
                          if (assets.length === 0) return [];

                          return assets.map((item: any, i: number) => {
                            const startAngle = currentAngle;
                            const endAngle = currentAngle + anglePerAsset;
                            currentAngle += anglePerAsset + segmentGap;

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

                            const midAngle = (startAngle + endAngle) / 2;
                            const midRad = (midAngle * Math.PI) / 180;
                            const labelX = cx + (outerR + 22) * Math.cos(midRad);
                            const labelY = cy + (outerR + 22) * Math.sin(midRad);

                            return (
                              <g key={`${item.action}-${i}`} onClick={() => setSelectedAsset(item)} style={{cursor: 'pointer'}}>
                                <path
                                  d={`M ${x1o} ${y1o}
                                      A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2o} ${y2o}
                                      L ${x2i} ${y2i}
                                      A ${innerR} ${innerR} 0 ${largeArc} 0 ${x1i} ${y1i}
                                      Z`}
                                  fill={color}
                                  opacity="0.3"
                                  style={{filter: 'drop-shadow(0 0 12px ' + (item.action === "IN" ? 'rgba(34, 197, 94, 0.8)' : item.action === "NEUTRAL" ? 'rgba(234, 179, 8, 0.8)' : 'rgba(239, 68, 68, 0.8)') + ')'}}
                                />
                                <path
                                  d={`M ${x1o} ${y1o}
                                      A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2o} ${y2o}
                                      L ${x2i} ${y2i}
                                      A ${innerR} ${innerR} 0 ${largeArc} 0 ${x1i} ${y1i}
                                      Z`}
                                  fill={color}
                                  opacity="0.9"
                                  className={className}
                                />
                                <path
                                  d={`M ${x1o} ${y1o}
                                      A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2o} ${y2o}
                                      L ${x2i} ${y2i}
                                      A ${innerR} ${innerR} 0 ${largeArc} 0 ${x1i} ${y1i}
                                      Z`}
                                  fill="none"
                                  stroke={color}
                                  strokeWidth="1.5"
                                  opacity="0.6"
                                />
                                <text
                                  x={labelX}
                                  y={labelY}
                                  textAnchor="middle"
                                  dominantBaseline="middle"
                                  className="fill-white text-[10px] font-bold pointer-events-none"
                                  style={{textShadow: '0 0 8px rgba(0,0,0,0.8)', filter: 'drop-shadow(0 0 2px ' + color + ')'}}
                                >
                                  {String(item.label).replace(/\(BTC\+ETH\)/g, '')}
                                </text>
                              </g>
                            );
                          });
                        });
                      })()}

                      {/* 地球中心 */}
                      <g className="sphere-3d" style={{transformOrigin: `${cx}px ${cy}px`}}>
                        <circle cx={cx} cy={cy} r="38" fill="url(#earthGradient)" filter="url(#glow)" />
                        <circle cx={cx} cy={cy} r="38" fill="url(#earthHighlight)" />

                        <animateTransform attributeName="transform" type="rotate" from="0 130 130" to="360 130 130" dur="8s" repeatCount="indefinite" />
                      </g>
                    </svg>
                  </div>

                  {/* 中间：Pro 分析 */}
                  <div className="min-w-0 min-h-[360px]">
                    <ProGate lockedMessage="升级 Pro 查看深度分析">
                      <div className="space-y-4">
                        {crossAsset.public.macro_one_liner && (
                          <div>
                            <div className="flex items-center gap-2 text-xs text-white/50 mb-2">
                              <span>宏观结论</span>
                              <HelpButton indicatorKey="macro_summary" />
                            </div>
                            <div className="text-xs text-white/80 leading-relaxed mb-3">
                              {String(crossAsset.public.macro_one_liner)}
                            </div>
                            <div className="overflow-x-auto">
                              <table className="w-full text-xs">
                                <thead>
                                  <tr className="border-b border-white/10">
                                    <th className="text-left py-2 text-white/50 font-normal w-8"></th>
                                    <th className="text-left py-2 text-white/50 font-normal">资产</th>
                                    <th className="text-left py-2 text-white/50 font-normal">状态</th>
                                    <th className="text-left py-2 text-white/50 font-normal">说明</th>
                                    <th className="text-left py-2 text-white/50 font-normal">
                                      <span className="flex items-center gap-1">
                                        Pro仓位建议
                                        <span className="px-1 py-0.5 rounded text-[8px] bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">PRO</span>
                                      </span>
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {crossAsset.public.assets_8.map((item: any, i: number) => {
                                    const posKey = item.key === 'SPX' ? 'US_EQUITY' :
                                                   item.key === 'GOLD' ? 'GOLD' :
                                                   item.key === 'BTC' ? 'BTC' :
                                                   item.key === 'ETH' ? 'ETH' :
                                                   item.key === 'CASH' ? 'CASH' : item.key;
                                    const positionCap = crossAsset?.pro?.position_caps?.[posKey];
                                    const hasPro = !!positionCap;
                                    const isExpanded = selectedAsset?.key === item.key;

                                    return (
                                      <>
                                        <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                                          <td className="py-2">
                                            <div className="flex items-center gap-1">
                                              <div
                                                className={`w-1.5 h-1.5 rounded-full ${item.action === "IN"
                                                    ? "bg-green-400"
                                                    : item.action === "NEUTRAL" || item.action === "HOLD"
                                                      ? "bg-yellow-400"
                                                      : "bg-red-400"
                                                  }`}
                                              />
                                              {hasPro && (
                                                <button
                                                  onClick={() => setSelectedAsset(isExpanded ? null : item)}
                                                  className="text-white/40 hover:text-white/80 transition-colors"
                                                >
                                                  <svg className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                  </svg>
                                                </button>
                                              )}
                                            </div>
                                          </td>
                                          <td className="py-2 text-white/80">{String(item.label).replace(/\(BTC\+ETH\)/g, '')}</td>
                                          <td className="py-2 text-white/40 text-[10px]">{String(item.action)}</td>
                                          <td className="py-2 text-white/40 text-[10px]">{item.one_liner || '-'}</td>
                                          <td className="py-2">
                                            <ProGate lockedMessage="Pro">
                                              <span className="text-white/80 font-mono">{positionCap || '-'}</span>
                                            </ProGate>
                                          </td>
                                        </tr>
                                        {isExpanded && hasPro && (
                                          <tr key={`${i}-detail`}>
                                            <td colSpan={5} className="py-3 px-4 bg-white/5">
                                              <ProGate lockedMessage="升级 Pro 查看详细分析">
                                                <div className="text-xs space-y-2">
                                                  <div className="flex items-center gap-2">
                                                    <span className="text-cyan-400/70">仓位上限:</span>
                                                    <span className="text-white/90 font-mono">{positionCap}</span>
                                                  </div>
                                                  <div className="text-white/60 leading-relaxed">
                                                    {item.one_liner || '暂无详细说明'}
                                                  </div>
                                                </div>
                                              </ProGate>
                                            </td>
                                          </tr>
                                        )}
                                      </>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    </ProGate>
                  </div>
                </div>

              </div>
            </div>
          );
        })()}

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-white/80">
              <span>历史相似度</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">PRO</span>
              <HelpButton indicatorKey="similarity_analysis" />
            </div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/10 relative min-h-[600px] max-h-[800px] overflow-y-auto">
              <ProGate lockedMessage="升级 Pro 查看完整分析">
                {similarityTop3 && Array.isArray(similarityTop3) && similarityTop3.length > 0 ? (
                  <>
                    <div className="text-xs text-white/50 mb-3">相似场景 Top 3</div>
                    <div className="space-y-3 mb-4">
                      {similarityTop3.map((item: any, i: number) => (
                        <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/10">
                          <div className="flex items-baseline gap-2 mb-1.5">
                            <span className="text-white/90 font-medium">{'①②③'[i]}</span>
                            <span className="text-white/60 text-[10px]">{item.date}</span>
                            <span className="text-white/90 text-xs">｜{item.name}</span>
                            {similarityHistoryRestore?.[i]?.text && (
                              <button
                                onClick={() => setExpandedHistory(expandedHistory === i ? null : i)}
                                className="ml-auto text-yellow-400/70 text-[10px] font-medium hover:text-yellow-400 transition-colors"
                              >
                                历史重现 {expandedHistory === i ? '▲' : '▼'}
                              </button>
                            )}
                          </div>
                          <div className="text-cyan-400/80 text-[10px] mb-1">相似度：{(item.sim * 100).toFixed(1)}%</div>
                          {similarityHistoryRestore?.[i]?.text && expandedHistory === i && (
                            <div className="mt-2 pt-2 border-t border-white/10">
                              <div className="text-white/60 text-[10px] leading-relaxed">{similarityHistoryRestore[i].text}</div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    {similarityProSummary && (
                      <>
                        <div className="border-t border-white/10 my-4" />
                        <div className="text-xs text-white/50 mb-2">Pro 结构解读</div>
                        <div className="space-y-1.5">
                          {typeof similarityProSummary === 'string' && similarityProSummary.split('\n').map((line: string, i: number) => (
                            line.trim() && (
                              <div key={i} className="text-xs text-white/90 leading-relaxed">
                                {line}
                              </div>
                            )
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="text-xs text-white/50">暂无历史相似性数据</div>
                )}
              </ProGate>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-white/80">
              <span>策略适配矩阵</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">PRO</span>
              <HelpButton indicatorKey="strategy_matrix" />
            </div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/10 relative min-h-[600px] max-h-[800px] overflow-y-auto">
              <ProGate lockedMessage="升级 Pro 查看策略适配矩阵">
                {strategyMatrix && (strategyMatrix.version === "matrix_v3_scored" || strategyMatrix.rows) ? (
                  <div className="space-y-3">
                    {/* 策略分布统计 */}
                    {strategyMatrix.summary && typeof strategyMatrix.summary === 'object' && (
                      <div className="mb-3 pb-3 border-b border-white/10">
                        <div className="flex items-center gap-4 text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-400"></div>
                            <span className="text-white/60">推荐: {strategyMatrix.summary.green} 个</span>
                            {strategyMatrix.summary.green_keys && strategyMatrix.summary.green_keys.length > 0 && (
                              <span className="text-white/40 text-[10px]">
                                ({strategyMatrix.summary.green_keys.join(', ')})
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                            <span className="text-white/60">可选: {strategyMatrix.summary.yellow} 个</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-400"></div>
                            <span className="text-white/60">规避: {strategyMatrix.summary.red} 个</span>
                            {strategyMatrix.summary.red_keys && strategyMatrix.summary.red_keys.length > 0 && (
                              <span className="text-white/40 text-[10px]">
                                ({strategyMatrix.summary.red_keys.join(', ')})
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 矩阵表格 */}
                    {(() => {
                      // 从 rows 字段获取矩阵数据
                      const rows = strategyMatrix.rows || [];

                      if (!Array.isArray(rows) || rows.length === 0) {
                        return <div className="text-xs text-white/50">暂无矩阵数据</div>;
                      }

                      // 获取红绿灯状态的颜色和文本
                      const getLightStyle = (light: string, decision: string) => {
                        const l = String(light).toUpperCase();
                        const d = String(decision).toUpperCase();

                        if (l === 'GREEN' || d === 'RECOMMENDED' || d === 'ALLOW') {
                          return { color: 'bg-green-400', text: 'text-green-400', label: '推荐' };
                        } else if (l === 'RED' || d === 'AVOID') {
                          return { color: 'bg-red-400', text: 'text-red-400', label: '规避' };
                        } else if (l === 'YELLOW' || d === 'OPTIONAL') {
                          return { color: 'bg-yellow-400', text: 'text-yellow-400', label: '可选' };
                        }
                        return { color: 'bg-gray-400', text: 'text-gray-400', label: d || l };
                      };

                      return (
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="border-b border-white/10">
                                <th className="text-left py-2 px-2 text-white/50 font-normal w-8"></th>
                                <th className="text-left py-2 px-2 text-white/50 font-normal">策略名称</th>
                                <th className="text-left py-2 px-2 text-white/50 font-normal">类型</th>
                                {isProUser && (
                                  <>
                                    <th className="text-left py-2 px-2 text-white/50 font-normal">决策</th>
                                    <th className="text-left py-2 px-2 text-white/50 font-normal">评分</th>
                                  </>
                                )}
                              </tr>
                            </thead>
                            <tbody>
                              {rows.map((row: any, i: number) => {
                                const lightStyle = getLightStyle(row.light, row.decision);
                                const score = row.score || 0;
                                const scorePercent = score; // score is already 0-100

                                return (
                                  <tr key={row.key || i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="py-2.5 px-2">
                                      <div className="flex items-center gap-1.5">
                                        {/* 红绿灯指示器 */}
                                        <div
                                          className={`w-2 h-2 rounded-full ${lightStyle.color} shadow-lg`}
                                          style={{
                                            boxShadow: `0 0 8px ${
                                              lightStyle.color === 'bg-green-400' ? 'rgba(34, 197, 94, 0.6)' :
                                              lightStyle.color === 'bg-red-400' ? 'rgba(239, 68, 68, 0.6)' :
                                              'rgba(234, 179, 8, 0.6)'
                                            }`
                                          }}
                                        />
                                      </div>
                                    </td>
                                    <td className="py-2.5 px-2">
                                      <div className="text-white/90 font-medium">{row.name}</div>
                                    </td>
                                    <td className="py-2.5 px-2">
                                      <span className="text-white/60 text-[10px]">{row.type}</span>
                                    </td>
                                    {isProUser && (
                                      <>
                                        <td className="py-2.5 px-2">
                                          <span className={`${lightStyle.text} text-[10px] font-semibold`}>
                                            {lightStyle.label}
                                          </span>
                                        </td>
                                        <td className="py-2.5 px-2">
                                          <div className="flex items-center gap-2">
                                            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden max-w-[50px]">
                                              <div
                                                className={`h-full ${lightStyle.color} transition-all`}
                                                style={{ width: `${scorePercent}%` }}
                                              />
                                            </div>
                                          </div>
                                        </td>
                                      </>
                                    )}
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="text-xs text-white/50">暂无策略适配矩阵数据</div>
                )}
              </ProGate>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
