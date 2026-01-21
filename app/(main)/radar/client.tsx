'use client';

import { useState, useEffect, useCallback } from 'react';
import { HelpButton } from '../toolbox/help-modal';
import { ProGate } from '@/app/lib/gate';

// 类型定义
interface Metric {
  label: string;
  v: string | number;
}

interface ControlTowerItem {
  display_name: string;
  value: any;
}

interface ControlTowerLayer {
  layer: string;
  items: ControlTowerItem[];
}

interface LayerBadge {
  label: string;
  color: 'red' | 'yellow' | 'green';
}

interface Layer {
  key: string;
  title: string;
  badge: LayerBadge;
  metrics: Metric[];
}

interface MacroCoefBreakdown {
  L1: number;
  L2: number;
  L3: number;
  L4: number;
  L5: number;
  L6: number;
}

interface LayerNotes {
  L1?: string;
  L2?: string;
  L3?: string;
  L4?: string;
  L5?: string;
  L6?: string;
}

interface UIText {
  L1?: { title: string; desc: string };
  L2?: { title: string; desc: string };
  L3?: { title: string; desc: string };
  L4?: { title: string; desc: string };
  L5?: { title: string; desc: string };
  L6?: { title: string; desc: string };
}

interface ReportPayload {
  macro?: {
    macro_coef?: {
      breakdown?: MacroCoefBreakdown;
    };
  };
  ai_json?: {
    layer_notes?: LayerNotes;
    ui_text?: UIText;
  };
  pro_one_liner?: string;
  pro_evidence_panels?: {
    macro_gravity?: {
      status: string;
      conclusion: string;
      evidences: string[];
    };
    smart_money_skew?: {
      status: string;
      conclusion: string;
      evidences: string[];
    };
    liquidation_battlefield?: {
      status: string;
      conclusion: string;
      evidences: string[];
    };
  };
}

interface ControlTowerPayload {
  layers?: ControlTowerLayer[];
}

const LAYER_KEYS = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6'] as const;

// 归一化算法：将 breakdown 分数转为 0~1
function normalizeBreakdown(breakdown: MacroCoefBreakdown): number[] {
  const scores = LAYER_KEYS.map(k => breakdown[k] ?? 0);
  const maxAbs = Math.max(...scores.map(Math.abs));
  if (maxAbs === 0) return scores.map(() => 0.5);
  return scores.map(s => Math.max(0, Math.min(1, (s / maxAbs + 1) / 2)));
}

// 生成六边形顶点坐标
function hexPoints(cx: number, cy: number, r: number, values: number[]): string {
  return values
    .map((v, i) => {
      const angle = (Math.PI / 2) + (i * 2 * Math.PI) / 6;
      const x = cx + r * v * Math.cos(angle);
      const y = cy - r * v * Math.sin(angle);
      return `${x},${y}`;
    })
    .join(' ');
}

// Badge 颜色映射
function badgeColorClass(color: string): string {
  switch (color) {
    case 'red': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'green': return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'yellow': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    default: return 'bg-white/10 text-white/70 border-white/20';
  }
}

// 发光雷达图组件
function GlowingRadar({
  values
}: {
  values: number[];
  layers: Layer[];
}) {

  const cx = 150, cy = 150, maxR = 120;

  return (
    <svg viewBox="0 0 300 300" className="w-full max-w-[320px] sm:max-w-[360px] lg:max-w-[400px] mx-auto">
      <defs>
        <radialGradient id="bgGlow" cx="50%" cy="50%">
          <stop offset="0%" stopColor="rgba(21, 26, 31, 0.8)" />
          <stop offset="100%" stopColor="rgba(11, 15, 20, 1)" />
        </radialGradient>
        <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="labelGlow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="riskZoneRed" cx="50%" cy="50%">
          <stop offset="0%" stopColor="rgba(255,85,60,0.45)" />
          <stop offset="100%" stopColor="rgba(220,60,60,0.18)" />
        </radialGradient>
        <radialGradient id="riskZoneYellow" cx="50%" cy="50%">
          <stop offset="0%" stopColor="rgba(255,200,60,0.35)" />
          <stop offset="100%" stopColor="rgba(245,180,60,0.12)" />
        </radialGradient>
        <radialGradient id="riskZoneGreen" cx="50%" cy="50%">
          <stop offset="0%" stopColor="rgba(60,220,140,0.28)" />
          <stop offset="100%" stopColor="rgba(40,180,120,0.08)" />
        </radialGradient>
        <linearGradient id="dataFill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.08" />
        </linearGradient>
      </defs>

      <rect width="300" height="300" fill="url(#bgGlow)" />

      {/* 风险分区渐变 */}
      <polygon points={hexPoints(cx, cy, maxR * 0.33, [1,1,1,1,1,1])} fill="url(#riskZoneRed)" />
      <polygon points={hexPoints(cx, cy, maxR * 0.66, [1,1,1,1,1,1])} fill="url(#riskZoneYellow)" />
      <polygon points={hexPoints(cx, cy, maxR, [1,1,1,1,1,1])} fill="url(#riskZoneGreen)" />

      {/* 同心六边形网格 */}
      {[0.33, 0.66, 1.0].map((level, i) => (
        <polygon key={i} points={hexPoints(cx, cy, maxR * level, [1,1,1,1,1,1])}
          fill="none" stroke={i === 2 ? "rgba(60,220,140,0.5)" : "rgba(255,255,255,0.15)"}
          strokeWidth={i === 2 ? "2" : "1"} filter={i === 2 ? "url(#neonGlow)" : undefined} />
      ))}

      {/* 轴线 */}
      {LAYER_KEYS.map((_, i) => {
        const angle = (Math.PI / 2) + (i * 2 * Math.PI) / 6;
        const x2 = cx + maxR * Math.cos(angle);
        const y2 = cy - maxR * Math.sin(angle);
        return <line key={i} x1={cx} y1={cy} x2={x2} y2={y2} stroke="rgba(255,255,255,0.12)" strokeWidth="1" />;
      })}

      {/* 数据多边形 */}
      <polygon points={hexPoints(cx, cy, maxR, values)} fill="url(#dataFill)"
        stroke="#22d3ee" strokeWidth="3.5" filter="url(#neonGlow)"
        className="transition-all duration-500" />

      {/* 数据点 - 双层节点 */}
      {values.map((v, i) => {
        const angle = (Math.PI / 2) + (i * 2 * Math.PI) / 6;
        const x = cx + maxR * v * Math.cos(angle);
        const y = cy - maxR * v * Math.sin(angle);
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="8" fill="#22d3ee" opacity="0.5" filter="url(#neonGlow)" />
            <circle cx={x} cy={y} r="3" fill="#fff" />
          </g>
        );
      })}

      {/* 轴标签 HUD 风格 */}
      {LAYER_KEYS.map((label, i) => {
        const angle = (Math.PI / 2) + (i * 2 * Math.PI) / 6;
        const x = cx + (maxR + 26) * Math.cos(angle);
        const y = cy - (maxR + 26) * Math.sin(angle);
        return (
          <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle"
            className="fill-white/85 text-[10px] font-mono tracking-wider font-semibold"
            style={{letterSpacing: '0.05em', paintOrder: 'stroke fill'}}
            stroke="rgba(0,0,0,0.6)" strokeWidth="2" filter="url(#labelGlow)">
            {label}
          </text>
        );
      })}
    </svg>
  );
}

// 层级卡片组件
function LayerCard({
  layer,
  breakdown
}: {
  layer: Layer;
  breakdown?: MacroCoefBreakdown;
}) {
  // 根据 layer.key 确定 indicatorKey
  const indicatorKey = `layer_${layer.key}`;

  // 根据 breakdown 计算颜色
  const raw = breakdown?.[layer.key as keyof MacroCoefBreakdown] ?? 0;
  const dotColor = raw <= -5 ? 'bg-red-400' : raw >= 5 ? 'bg-green-400' : 'bg-yellow-400';

  return (
    <div className="p-3 rounded-lg bg-white/8 border border-white/10 hover:border-cyan-500/30 transition-colors">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white">{layer.title}</span>
          <HelpButton indicatorKey={indicatorKey} />
        </div>
        <div className={`w-2 h-2 rounded-full ${dotColor}`} />
      </div>

      {/* metrics（显示全部） */}
      <div className="space-y-1">
        {layer.metrics.map((m, i) => (
          <div key={i} className="flex justify-between text-xs">
            <span className="text-white/60">{m.label}</span>
            <span className="text-white/95 font-mono">
              {typeof m.v === 'number' ? m.v.toFixed(2) : m.v}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 错误态组件
function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="p-6 rounded-lg bg-red-500/10 border border-red-500/30 text-center">
      <div className="text-red-400 mb-3">{message}</div>
      <button onClick={onRetry}
        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 text-sm">
        重试
      </button>
    </div>
  );
}

// 加载骨架屏
function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-[300px] bg-white/8 rounded-lg mb-4" />
      <div className="space-y-3">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="h-20 bg-white/8 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

// 主组件
export default function RadarClient() {
  const [data, setData] = useState<ReportPayload | null>(null);
  const [ctData, setCtData] = useState<ControlTowerPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [res1, res2] = await Promise.all([
        fetch('/api/proxy', { cache: 'no-store' }),
        fetch('/api/control_tower', { cache: 'no-store' })
      ]);

      if (!res1.ok) throw new Error(`report_payload 返回 ${res1.status}`);
      if (!res2.ok) throw new Error(`control_tower 返回 ${res2.status}`);

      setData(await res1.json());
      setCtData(await res2.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : '网络错误');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // 层级名称映射
  const layerTitles: Record<string, string> = {
    'L1': 'L1｜宏观环境层',
    'L2': 'L2｜资金流动层',
    'L3': 'L3｜杠杆与衍生品层',
    'L4': 'L4｜链上行为层',
    'L5': 'L5｜市场情绪层',
    'L6': 'L6｜结构与趋势层'
  };

  // 从 control_tower 构建 layers（过滤 L7/HCRI 和特定关键词）
  const layers: Layer[] = (ctData?.layers || [])
    .filter(ctLayer => ctLayer.layer !== 'L7' && ctLayer.layer !== 'HCRI')
    .map(ctLayer => ({
      key: ctLayer.layer,
      title: layerTitles[ctLayer.layer] || ctLayer.layer,
      badge: { label: '', color: 'green' as const },
      metrics: ctLayer.items
        .filter(item => {
          const name = item.display_name || '';
          return !name.includes('观望') && !name.includes('结构') && !name.includes('震荡')
            && !name.includes('比特币现价') && !name.includes('以太坊现价')
            && !name.includes('ETH/USDT 4H Open') && !name.includes('ETH 合约标的');
        })
        .map(item => ({
          label: item.display_name,
          v: item.value
        }))
    }));

  // 获取 breakdown 并归一化
  const breakdown = data?.macro?.macro_coef?.breakdown;
  const radarValues = breakdown
    ? normalizeBreakdown(breakdown)
    : [0.5, 0.5, 0.5, 0.5, 0.5, 0.5];

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchData} />;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
      {/* 左列：雷达图 */}
      <div className="h-full p-4 rounded-lg bg-white/8 border border-white/10 flex flex-col">
        <div className="flex items-center gap-2 text-sm text-white/50 mb-4">
          <span>六维雷达</span>
          <HelpButton indicatorKey="radar_chart" />
        </div>
        <div className="flex justify-center">
          <GlowingRadar values={radarValues} layers={layers} />
        </div>
        {breakdown && (
          <div className="mt-6 grid grid-cols-3 gap-4">
            {LAYER_KEYS.map((k) => {
              const raw = breakdown[k];
              const normalized = Math.min(1, Math.max(-1, raw / 15));
              const needleAngle = -135 + (normalized + 1) * 67.5;
              const needleRad = (needleAngle * Math.PI) / 180;
              const cx = 150, cy = 150, outerR = 110, innerR = 85, needleLen = 80;
              const needleX = cx + needleLen * Math.cos(needleRad);
              const needleY = cy + needleLen * Math.sin(needleRad);

              const segments = 12;
              const colors = ['#3cc878','#5bc878','#7bc878','#9bc878','#bbc878','#dbc878','#f5c83c','#f5b03c','#f5983c','#f5803c','#dc5c3c','#dc3c3c'];

              return (
                <div key={k} className="bg-white/5 rounded-lg p-2 flex flex-col items-center">
                  <div className="text-white/60 text-xs font-mono mb-1">{k}</div>
                  <svg viewBox="0 0 300 180" className="w-full" style={{aspectRatio: '300/180'}}>
                    <defs>
                      <linearGradient id={`ng-${k}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ff8866" />
                        <stop offset="100%" stopColor="#cc3333" />
                      </linearGradient>
                      <filter id={`gg-${k}`}>
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                      </filter>
                    </defs>
                    <circle cx={cx} cy={cy} r={outerR + 12} fill="rgba(15,15,15,0.95)" />
                    <circle cx={cx} cy={cy} r={outerR + 10} fill="none" stroke="rgba(180,180,180,0.6)" strokeWidth="8" />
                    <circle cx={cx} cy={cy} r={outerR + 6} fill="none" stroke="rgba(100,100,100,0.4)" strokeWidth="2" />
                    {Array.from({length: segments}).map((_, i) => {
                      const startAngle = -135 + (i * 135 / segments);
                      const endAngle = -135 + ((i + 1) * 135 / segments) - 2;
                      const sRad = (startAngle * Math.PI) / 180;
                      const eRad = (endAngle * Math.PI) / 180;
                      const x1 = cx + outerR * Math.cos(sRad);
                      const y1 = cy + outerR * Math.sin(sRad);
                      const x2 = cx + outerR * Math.cos(eRad);
                      const y2 = cy + outerR * Math.sin(eRad);
                      const ix1 = cx + innerR * Math.cos(sRad);
                      const iy1 = cy + innerR * Math.sin(sRad);
                      const ix2 = cx + innerR * Math.cos(eRad);
                      const iy2 = cy + innerR * Math.sin(eRad);
                      const pathData = `M ${x1} ${y1} A ${outerR} ${outerR} 0 0 1 ${x2} ${y2} L ${ix2} ${iy2} A ${innerR} ${innerR} 0 0 0 ${ix1} ${iy1} Z`;
                      return <path key={i} d={pathData} fill={colors[i]} opacity="0.85" stroke="rgba(0,0,0,0.5)" strokeWidth="1" />;
                    })}
                    {Array.from({length: segments + 1}).map((_, i) => {
                      const angle = -135 + (i * 135 / segments);
                      const rad = (angle * Math.PI) / 180;
                      const x1 = cx + outerR * Math.cos(rad);
                      const y1 = cy + outerR * Math.sin(rad);
                      const x2 = cx + (innerR - 2) * Math.cos(rad);
                      const y2 = cy + (innerR - 2) * Math.sin(rad);
                      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(0,0,0,0.6)" strokeWidth="2" />;
                    })}
                    <circle cx={cx} cy={cy} r={innerR - 5} fill="rgba(10,10,10,0.98)" />
                    <line x1={cx} y1={cy} x2={needleX} y2={needleY} stroke={`url(#ng-${k})`} strokeWidth="5" strokeLinecap="round" filter={`url(#gg-${k})`} />
                    <circle cx={cx} cy={cy} r="8" fill="rgba(150,150,150,0.5)" />
                    <circle cx={cx} cy={cy} r="5" fill="rgba(200,200,200,0.9)" />
                    <circle cx={cx} cy={cy} r="2" fill="rgba(255,255,255,0.8)" />
                  </svg>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 右列：机构风险内参 */}
      <div className="h-full mt-4 lg:mt-0 p-4 rounded-lg bg-white/8 border border-white/10 flex flex-col">
        <div className="flex items-center gap-2 text-sm text-white/50 mb-4">
          <span>机构风险内参</span>
          <span className="text-white/30 text-xs">Risk Decomposition</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">PRO</span>
          <HelpButton indicatorKey="risk_decomposition" size="xs" />
        </div>
        <div className="flex-1 overflow-y-auto">
          <ProGate lockedMessage="Pro 专属：解锁后可见">
          {(() => {
            const oneLiner = data?.pro_one_liner;
            const panels = data?.pro_evidence_panels;
            if (!oneLiner && !panels) return <div className="text-white/30 text-sm text-center py-4">暂无数据</div>;

            const statusColors: Record<string, string> = {
              RISK_ON: 'bg-green-500/20 text-green-400 border-green-500/30',
              RISK_OFF: 'bg-red-500/20 text-red-400 border-red-500/30',
              NEUTRAL: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
              OFFENSIVE: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
              DEFENSIVE: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
              CONFLICT: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
              HIGH_RISK: 'bg-red-500/20 text-red-400 border-red-500/30',
              MEDIUM_RISK: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
              LOW_RISK: 'bg-green-500/20 text-green-400 border-green-500/30',
            };

            const boxes = [
              { key: 'macro_gravity', title: '宏观引力场', data: panels?.macro_gravity },
              { key: 'smart_money_skew', title: '机构暗流', data: panels?.smart_money_skew },
              { key: 'liquidation_battlefield', title: '清算猎杀区', data: panels?.liquidation_battlefield },
            ];

            return (
              <div className="flex flex-col gap-3 h-full">
                {oneLiner && (
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-sm text-white/70 leading-relaxed">{oneLiner}</div>
                  </div>
                )}
                {boxes.map(box => {
                  if (!box.data) return null;
                  const { status, conclusion, evidences } = box.data;
                  const badgeClass = statusColors[status] || statusColors.NEUTRAL;

                  return (
                    <div key={box.key} className="flex-1 p-3 rounded-lg bg-white/5 border border-white/10 flex flex-col">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-white/80">{box.title}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] border ${badgeClass}`}>
                          {status}
                        </span>
                      </div>
                      <div className="text-xs text-white/70 mb-2 leading-relaxed">{conclusion}</div>
                      {evidences && evidences.length > 0 && (
                        <div className="space-y-1">
                          {evidences.map((ev: string, i: number) => (
                            <div key={i} className="text-[10px] text-white/50 leading-relaxed">• {ev}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })()}
          </ProGate>
        </div>
      </div>
    </div>
  );
}
