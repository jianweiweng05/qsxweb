"use client";

import { ProGate } from "@/app/lib/gate";
import { HelpButton } from "./help-modal";
import { useReport } from "../report-provider";
import { useState } from "react";

export default function ToolboxPage() {
  const { data: payload } = useReport();
  const [selectedAsset, setSelectedAsset] = useState<any>(null);

  const proStrategyText = payload?.pro_strategy_text;
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
                    <div className="text-right">
                      <div className="text-xs text-white/50">置信度</div>
                      <div className="text-sm font-semibold text-cyan-400">78%</div>
                    </div>
                    <HelpButton indicatorKey="cross_asset_rotation" />
                  </div>
                </div>

                <div className="grid lg:grid-cols-[320px_1fr_200px] gap-6">
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
                      width="260"
                      height="260"
                      viewBox="-20 -20 300 300"
                      className="overflow-visible max-w-full"
                    >
                      <defs>
                        <radialGradient id="sphereGradient" cx="35%" cy="35%">
                          <stop offset="0%" stopColor="rgba(56, 189, 248, 0.9)" />
                          <stop offset="50%" stopColor="rgba(14, 165, 233, 0.7)" />
                          <stop offset="100%" stopColor="rgba(2, 132, 199, 0.4)" />
                        </radialGradient>
                        <radialGradient id="sphereHighlight" cx="30%" cy="30%">
                          <stop offset="0%" stopColor="rgba(255, 255, 255, 0.6)" />
                          <stop offset="40%" stopColor="rgba(125, 211, 252, 0.3)" />
                          <stop offset="100%" stopColor="transparent" />
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

                      {/* 外圈扇区 */}
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
                        const labelX = cx + (outerR + 22) * Math.cos(midRad);
                        const labelY = cy + (outerR + 22) * Math.sin(midRad);

                        const segmentClass = item.action === "IN" ? "gauge-segment-in" : item.action === "NEUTRAL" ? "gauge-segment-neutral" : "gauge-segment-out";

                        return (
                          <g key={i} onClick={() => setSelectedAsset(item)} style={{cursor: 'pointer'}}>
                            {/* 外层发光边框 */}
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
                            {/* 主体段 */}
                            <path
                              d={`M ${x1o} ${y1o}
                                  A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2o} ${y2o}
                                  L ${x2i} ${y2i}
                                  A ${innerR} ${innerR} 0 ${largeArc} 0 ${x1i} ${y1i}
                                  Z`}
                              fill={color}
                              opacity="0.9"
                              className={segmentClass}
                            />
                            {/* 边框 */}
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
                              {String(item.label)}
                            </text>
                          </g>
                        );
                      })}

                      {/* 3D 球体中心 */}
                      <g className="sphere-3d" style={{transformOrigin: `${cx}px ${cy}px`}}>
                        {/* 球体主体 */}
                        <circle cx={cx} cy={cy} r="38" fill="url(#sphereGradient)" filter="url(#glow)" />

                        {/* 高光 */}
                        <circle cx={cx - 8} cy={cy - 8} r="15" fill="url(#sphereHighlight)" opacity="0.8" />

                        {/* 经线 */}
                        <ellipse cx={cx} cy={cy} rx="38" ry="38" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
                        <ellipse cx={cx} cy={cy} rx="30" ry="38" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
                        <ellipse cx={cx} cy={cy} rx="20" ry="38" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                        <ellipse cx={cx} cy={cy} rx="10" ry="38" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />

                        {/* 纬线 */}
                        <ellipse cx={cx} cy={cy - 20} rx="30" ry="8" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                        <ellipse cx={cx} cy={cy} rx="38" ry="10" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
                        <ellipse cx={cx} cy={cy + 20} rx="30" ry="8" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                      </g>
                    </svg>
                  </div>

                  {/* 中间：Pro 分析 */}
                  <div className="min-w-0 min-h-[280px]">
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
                                    <th className="text-left py-2 text-white/50 font-normal"></th>
                                    <th className="text-left py-2 text-white/50 font-normal">资产</th>
                                    <th className="text-left py-2 text-white/50 font-normal">状态</th>
                                    <th className="text-left py-2 text-white/50 font-normal">说明</th>
                                    <th className="text-right py-2 text-white/50 font-normal">
                                      仓位
                                      <span className="ml-1 px-1 py-0.5 rounded text-[9px] bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">PRO</span>
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
                                    const positionCap = crossAsset.pro?.position_caps?.[posKey];

                                    return (
                                      <tr key={i} className="border-b border-white/5 hover:bg-white/5 cursor-pointer" onClick={() => setSelectedAsset(item)}>
                                        <td className="py-2">
                                          <div
                                            className={`w-1.5 h-1.5 rounded-full ${item.action === "IN"
                                                ? "bg-green-400"
                                                : item.action === "NEUTRAL"
                                                  ? "bg-yellow-400"
                                                  : "bg-red-400"
                                              }`}
                                          />
                                        </td>
                                        <td className="py-2 text-white/80">{String(item.label)}</td>
                                        <td className="py-2 text-white/40 text-[10px]">{String(item.action)}</td>
                                        <td className="py-2 text-white/40 text-[10px]">{item.one_liner || '-'}</td>
                                        <td className="py-2 text-right">
                                          <ProGate lockedMessage="">
                                            <span className="text-cyan-400/70 text-[10px]">{positionCap || '-'}</span>
                                          </ProGate>
                                        </td>
                                      </tr>
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

                  {/* 右侧：行动摘要 */}
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm h-fit">
                    <div className="text-xs text-white/50 mb-4 font-medium">行动摘要</div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="p-2 rounded bg-green-500/10 border border-green-500/20">
                        <div className="text-[10px] text-white/50">IN</div>
                        <div className="text-lg font-bold text-green-400">{inCount}</div>
                      </div>
                      <div className="p-2 rounded bg-red-500/10 border border-red-500/20">
                        <div className="text-[10px] text-white/50">OUT</div>
                        <div className="text-lg font-bold text-red-400">{outCount}</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="text-[10px] text-white/50 mb-1.5">Top IN</div>
                        <div className="space-y-1">
                          {topIn.map((item: any, i: number) => (
                            <div key={i} className="flex items-center gap-2 text-[10px] cursor-pointer hover:text-green-400 transition" onClick={() => setSelectedAsset(item)}>
                              <div className="w-1 h-1 rounded-full bg-green-400" />
                              <span className="text-white/70">{item.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-white/10 pt-3">
                        <div className="text-[10px] text-white/50 mb-1.5">Top OUT</div>
                        <div className="space-y-1">
                          {topOut.map((item: any, i: number) => (
                            <div key={i} className="flex items-center gap-2 text-[10px] cursor-pointer hover:text-red-400 transition" onClick={() => setSelectedAsset(item)}>
                              <div className="w-1 h-1 rounded-full bg-red-400" />
                              <span className="text-white/70">{item.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 资产详情抽屉 */}
                {selectedAsset && (
                  <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedAsset(null)} />
                    <div className="relative bg-black/80 border border-white/10 backdrop-blur-md rounded-lg p-4 w-full sm:w-80 sm:mr-4 mb-4 sm:mb-0 max-h-96 overflow-y-auto">
                      <button onClick={() => setSelectedAsset(null)} className="absolute top-3 right-3 text-white/50 hover:text-white/80">✕</button>
                      <div className="pr-6">
                        <div className="flex items-center gap-2 mb-3">
                          <div className={`w-2 h-2 rounded-full ${selectedAsset.action === "IN" ? "bg-green-400" : selectedAsset.action === "NEUTRAL" ? "bg-yellow-400" : "bg-red-400"}`} />
                          <h3 className="text-sm font-semibold text-white">{selectedAsset.label}</h3>
                        </div>
                        <div className="text-xs text-white/50 mb-3">{selectedAsset.action}</div>
                        <div className="text-xs text-white/70 leading-relaxed mb-3">{selectedAsset.one_liner || '暂无说明'}</div>
                        <ProGate lockedMessage="">
                          <div className="text-xs text-cyan-400/70 mb-2">仓位上限</div>
                          <div className="text-sm font-mono text-white/80">≤35%</div>
                        </ProGate>
                        <div className="text-[10px] text-white/40 mt-3">更新于 2024-01-21 14:30</div>
                      </div>
                    </div>
                  </div>
                )}
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
            <div className="p-4 rounded-lg bg-white/5 border border-white/10 relative min-h-[320px]">
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
                            <span className="text-white/40 text-[10px]">（{item.group}）</span>
                          </div>
                          <div className="text-cyan-400/80 text-[10px] mb-1">相似度：{item.sim}</div>
                          <div className="text-white/70 text-[10px] leading-relaxed">{item.what_it_is}</div>
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
                              <div key={i} className="text-[10px] text-white/70 leading-relaxed">
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
