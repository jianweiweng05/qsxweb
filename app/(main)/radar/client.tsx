'use client';

import { useState, useEffect, useCallback } from 'react';

// 类型定义
interface Metric {
  label: string;
  v: string | number;
  bar?: { norm: number };
}

interface LayerBadge {
  label: string;
  color: 'red' | 'yellow' | 'green';
}

interface Layer {
  id: string;
  title: string;
  badge: LayerBadge;
  asof: string;
  metrics: Metric[];
}

interface ReportPayload {
  macro_state: string;
  risk_cap: number;
  generated_at: string;
  layers?: Layer[];
  ui?: { layers?: Layer[] };
}

// 6维雷达标签
const RADAR_LABELS = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6'];

// 计算每层的雷达值（metrics[].bar.norm 均值，无则 0.4）
function calcLayerValue(layer: Layer): number {
  const norms = layer.metrics
    .map(m => m.bar?.norm)
    .filter((n): n is number => typeof n === 'number');
  if (norms.length === 0) return 0.4;
  return norms.reduce((a, b) => a + b, 0) / norms.length;
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
function GlowingRadar({ values, layers }: { values: number[]; layers: Layer[] }) {
  const cx = 150, cy = 150, maxR = 120;

  // 背景网格层
  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  return (
    <svg viewBox="0 0 300 300" className="w-full max-w-[300px] mx-auto">
      <defs>
        {/* 发光滤镜 */}
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* 强发光 */}
        <filter id="glowStrong" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* 渐变填充 */}
        <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00ffff" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#0080ff" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* 背景网格 */}
      {gridLevels.map((level, i) => (
        <polygon
          key={i}
          points={hexPoints(cx, cy, maxR * level, [1,1,1,1,1,1])}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
        />
      ))}

      {/* 轴线 */}
      {RADAR_LABELS.map((_, i) => {
        const angle = (Math.PI / 2) + (i * 2 * Math.PI) / 6;
        const x2 = cx + maxR * Math.cos(angle);
        const y2 = cy - maxR * Math.sin(angle);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={x2}
            y2={y2}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
          />
        );
      })}

      {/* 数据多边形 - 发光效果 */}
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
          : layer?.badge?.color === 'green' ? '#44ff44'
          : '#ffff44';
        return (
          <g key={i}>
            <circle
              cx={x}
              cy={y}
              r="6"
              fill={color}
              filter="url(#glow)"
              className="transition-all duration-300"
            />
            <circle
              cx={x}
              cy={y}
              r="3"
              fill="#fff"
            />
          </g>
        );
      })}

      {/* 标签 */}
      {RADAR_LABELS.map((label, i) => {
        const angle = (Math.PI / 2) + (i * 2 * Math.PI) / 6;
        const x = cx + (maxR + 20) * Math.cos(angle);
        const y = cy - (maxR + 20) * Math.sin(angle);
        const layer = layers[i];
        return (
          <text
            key={i}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-white/70 text-xs font-medium"
          >
            {layer?.title || label}
          </text>
        );
      })}
    </svg>
  );
}

// 中心信息组件
function CenterInfo({ macroState, riskCap, generatedAt }: {
  macroState: string;
  riskCap: number;
  generatedAt: string;
}) {
  const riskPercent = (riskCap * 100).toFixed(1);
  const time = new Date(generatedAt).toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="text-center mt-4">
      <div className="text-lg font-bold text-cyan-400 mb-1" style={{ textShadow: '0 0 10px #00ffff' }}>
        {macroState}
      </div>
      <div className="text-sm text-white/70">
        风险仓位: <span className="text-yellow-400 font-mono">{riskPercent}%</span>
      </div>
      <div className="text-xs text-white/40 mt-1">{time}</div>
    </div>
  );
}

// 层级卡片组件
function LayerCard({ layer, index }: { layer: Layer; index: number }) {
  return (
    <div className="p-3 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-colors">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/40 font-mono">L{index + 1}</span>
          <span className="text-sm font-medium text-white">{layer.title}</span>
        </div>
        <span className={`px-2 py-0.5 text-xs rounded border ${badgeColorClass(layer.badge.color)}`}>
          {layer.badge.label}
        </span>
      </div>

      {/* asof */}
      <div className="text-xs text-white/40 mb-2">{layer.asof}</div>

      {/* metrics */}
      <div className="space-y-1">
        {layer.metrics.slice(0, 4).map((m, i) => (
          <div key={i} className="flex justify-between text-xs">
            <span className="text-white/60">{m.label}</span>
            <span className="text-white/90 font-mono">
              {typeof m.v === 'number' ? m.v.toFixed(2) : m.v}
            </span>
          </div>
        ))}
        {layer.metrics.length > 4 && (
          <div className="text-xs text-white/30">+{layer.metrics.length - 4} more</div>
        )}
      </div>
    </div>
  );
}

// 错误态组件
function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="p-6 rounded-lg bg-red-500/10 border border-red-500/30 text-center">
      <div className="text-red-400 mb-3">⚠️ {message}</div>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 text-sm transition-colors"
      >
        重试
      </button>
    </div>
  );
}

// 加载态组件
function LoadingState() {
  return (
    <div className="p-6 text-center">
      <div className="inline-block w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
      <div className="text-white/50 mt-3 text-sm">加载中...</div>
    </div>
  );
}

// 主组件
export default function RadarClient() {
  const [data, setData] = useState<ReportPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('https://qsx-ai.onrender.com/macro/v1/report_payload', {
        cache: 'no-store',
      });
      if (!res.ok) {
        throw new Error(`API 返回 ${res.status}`);
      }
      const json = await res.json();
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : '网络错误');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 获取 layers 数据（优先 ui.layers）
  const layers: Layer[] = data?.ui?.layers || data?.layers || [];

  // 计算雷达值
  const radarValues = layers.length === 6
    ? layers.map(calcLayerValue)
    : [0.4, 0.4, 0.4, 0.4, 0.4, 0.4];

  return (
    <div className="lg:grid lg:grid-cols-2 lg:gap-6">
      {/* 左列：雷达图 */}
      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
        <h2 className="text-sm text-white/50 mb-4">六维雷达</h2>

        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchData} />
        ) : (
          <>
            <GlowingRadar values={radarValues} layers={layers} />
            {data && (
              <CenterInfo
                macroState={data.macro_state}
                riskCap={data.risk_cap}
                generatedAt={data.generated_at}
              />
            )}
          </>
        )}
      </div>

      {/* 右列：层级卡片 */}
      <div className="mt-4 lg:mt-0 p-4 rounded-lg bg-white/5 border border-white/10">
        <h2 className="text-sm text-white/50 mb-4">层级详情</h2>

        {loading ? (
          <LoadingState />
        ) : error ? (
          <div className="text-white/30 text-sm text-center py-4">数据不可用</div>
        ) : layers.length === 0 ? (
          <div className="text-white/30 text-sm text-center py-4">暂无层级数据</div>
        ) : (
          <div className="space-y-3">
            {layers.map((layer, i) => (
              <LayerCard key={layer.id || i} layer={layer} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
