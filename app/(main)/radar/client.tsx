'use client';

import { useState, useEffect, useCallback } from 'react';

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

// 获取层级总结（优先 layer_notes，其次 ui_text，最后 badge.label）
function getLayerSummary(
  key: string,
  layerNotes?: LayerNotes,
  uiText?: UIText,
  badge?: LayerBadge
): string {
  const k = key as keyof LayerNotes;
  if (layerNotes?.[k]) return layerNotes[k];
  const ut = uiText?.[k];
  if (ut) return `${ut.title} ${ut.desc}`.trim();
  return badge?.label || '';
}

// 发光雷达图组件
function GlowingRadar({
  values,
  layers,
  breakdown
}: {
  values: number[];
  layers: Layer[];
  breakdown?: MacroCoefBreakdown;
}) {

  const cx = 150, cy = 150, maxR = 120;

  const gridLevels = [
    { level: 0.33, color: 'rgba(200, 40, 40, 0.16)' },   // 高风险 红
    { level: 0.66, color: 'rgba(245, 200, 60, 0.10)' }, // 中性 黄
    { level: 1.0, color: 'rgba(60, 200, 120, 0.08)' }  // 健康 绿
  ];

  return (
    <svg viewBox="0 0 300 300" className="w-full max-w-[300px] mx-auto">
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="glowStrong" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00ffff" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#0080ff" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* 背景风险分区 */}
      {gridLevels.map((g, i) => (
        <polygon
          key={i}
          points={hexPoints(cx, cy, maxR * g.level, [1, 1, 1, 1, 1, 1])}
          fill={g.color}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
        />
      ))}

      {/* 轴线 */}
      {LAYER_KEYS.map((_, i) => {
        const angle = (Math.PI / 2) + (i * 2 * Math.PI) / 6;
        const x2 = cx + maxR * Math.cos(angle);
        const y2 = cy - maxR * Math.sin(angle);
        return (
          <line key={i} x1={cx} y1={cy} x2={x2} y2={y2}
            stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        );
      })}

      {/* 数据多边形 */}
      <polygon
        points={hexPoints(cx, cy, maxR, values)}
        fill="url(#radarGradient)"
        stroke="#00ffff"
        strokeWidth="2"
        filter="url(#glowStrong)"
        className="transition-all duration-500"
      />

      {/* 数据点 */}
      {values.map((v, i) => {
        const angle = (Math.PI / 2) + (i * 2 * Math.PI) / 6;
        const x = cx + maxR * v * Math.cos(angle);
        const y = cy - maxR * v * Math.sin(angle);
        const layer = layers[i];
        const color = layer?.badge?.color === 'red' ? '#ff4444'
          : layer?.badge?.color === 'green' ? '#e6ffff' : '#ffff44';
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="6" fill={color} filter="url(#glow)" />
            <circle cx={x} cy={y} r="3" fill="#fff" />
          </g>
        );
      })}

      {/* 轴标签 */}
      {LAYER_KEYS.map((label, i) => {
        const angle = (Math.PI / 2) + (i * 2 * Math.PI) / 6;
        const x = cx + (maxR + 22) * Math.cos(angle);
        const y = cy - (maxR + 22) * Math.sin(angle);
        const rawScore = breakdown?.[label] ?? 0;
        return (
          <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle"
            className="fill-white/70 text-[10px] font-medium">
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
  index,
  rawScore,
  summary
}: {
  layer: Layer;
  index: number;
  rawScore: number;
  summary: string;
}) {
  return (
    <div className="p-3 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-colors">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/40 font-mono">L{index + 1}</span>
          <span className="text-sm font-medium text-white">{layer.title}</span>
          <span className="text-xs text-cyan-400 font-mono">({rawScore})</span>
        </div>
        <span className={`px-2 py-0.5 text-xs rounded border ${badgeColorClass(layer.badge.color)}`}>
          {layer.badge.label}
        </span>
      </div>

      {/* metrics（最多5条） */}
      <div className="space-y-1 mb-2">
        {layer.metrics.slice(0, 5).map((m, i) => (
          <div key={i} className="flex justify-between text-xs">
            <span className="text-white/60">{m.label}</span>
            <span className="text-white/90 font-mono">
              {typeof m.v === 'number' ? m.v.toFixed(2) : m.v}
            </span>
          </div>
        ))}
      </div>

      {/* 多空总结一句话 */}
      {summary && (
        <div className="text-xs text-cyan-300/80 border-t border-white/5 pt-2 mt-2">
          {summary}
        </div>
      )}
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
      <div className="h-[300px] bg-white/5 rounded-lg mb-4" />
      <div className="space-y-3">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="h-20 bg-white/5 rounded-lg" />
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

  // 从 control_tower 构建 layers（过滤 L7/HCRI 和特定关键词）
  const layers: Layer[] = (ctData?.layers || [])
    .filter(ctLayer => ctLayer.layer !== 'L7' && ctLayer.layer !== 'HCRI')
    .map(ctLayer => ({
      key: ctLayer.layer,
      title: ctLayer.layer,
      badge: { label: '', color: 'green' as const },
      metrics: ctLayer.items
        .filter(item => {
          const name = item.display_name || '';
          return !name.includes('观望') && !name.includes('结构') && !name.includes('震荡');
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

  // ai_json 数据
  const layerNotes = data?.ai_json?.layer_notes;
  const uiText = data?.ai_json?.ui_text;

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchData} />;
  }

  return (
    <div className="lg:grid lg:grid-cols-2 lg:gap-6">
      {/* 左列：雷达图 */}
      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
        <h2 className="text-sm text-white/50 mb-4">六维雷达 (MacroCoef)</h2>
        <GlowingRadar values={radarValues} layers={layers} breakdown={breakdown} />
        {breakdown && (
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
            {LAYER_KEYS.map((k, i) => (
              <div key={k} className="bg-white/5 rounded p-2">
                <div className="text-white/40">{k}</div>
                <div className="text-cyan-400 font-mono">{breakdown[k]}</div>
                <div className="text-white/30">norm: {radarValues[i].toFixed(2)}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 右列：层级卡片 */}
      <div className="mt-4 lg:mt-0 p-4 rounded-lg bg-white/5 border border-white/10">
        <h2 className="text-sm text-white/50 mb-4">层级详情</h2>
        {layers.length === 0 ? (
          <div className="text-white/30 text-sm text-center py-4">暂无层级数据</div>
        ) : (
          <div className="space-y-3">
            {layers.map((layer, i) => {
              const key = layer.key || LAYER_KEYS[i];
              const rawScore = breakdown?.[key as keyof MacroCoefBreakdown] ?? 0;
              const summary = getLayerSummary(key, layerNotes, uiText, layer.badge);
              return (
                <LayerCard
                  key={key}
                  layer={layer}
                  index={i}
                  rawScore={rawScore}
                  summary={summary}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
