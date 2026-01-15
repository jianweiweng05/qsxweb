'use client';

import { useState, useEffect, useCallback } from 'react';

interface AlertItem {
  key: string;
  display_name: string;
  value: string | number;
  signal: 'RED' | 'YELLOW' | 'GREEN';
  reason: string;
}

interface AlertLayer {
  layer: string;
  items: AlertItem[];
}

interface AlertSummary {
  total_items: number;
  red: number;
  yellow: number;
  green: number;
}

interface AlertData {
  ok: boolean;
  generated_at: string;
  summary: AlertSummary;
  layers: AlertLayer[];
}

function SignalBadge({ signal }: { signal: string }) {
  const colorMap: Record<string, string> = {
    RED: 'bg-red-500',
    YELLOW: 'bg-yellow-500',
    GREEN: 'bg-green-500',
  };
  return (
    <span className={`inline-block w-3 h-3 rounded-full ${colorMap[signal] || 'bg-gray-500'}`} />
  );
}

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-16 bg-white/5 rounded-lg" />
        ))}
      </div>
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-12 bg-white/5 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="p-6 rounded-lg bg-red-500/10 border border-red-500/30 text-center">
      <div className="text-red-400 mb-3">{message}</div>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 text-sm"
      >
        重试
      </button>
    </div>
  );
}

export default function AlertsClient() {
  const [data, setData] = useState<AlertData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'RED' | 'YELLOW'>('all');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/control_tower', { cache: 'no-store' });
      if (!res.ok) throw new Error(`API 返回 ${res.status}`);
      setData(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : '网络错误');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorState message={error} onRetry={fetchData} />;
  if (!data) return null;

  const { summary, layers } = data;

  // 收集所有报警项
  const allItems = layers.flatMap(layer =>
    layer.items.map(item => ({ ...item, layer: layer.layer }))
  );

  // 过滤
  const filteredItems = filter === 'all'
    ? allItems.filter(item => item.signal === 'RED' || item.signal === 'YELLOW')
    : allItems.filter(item => item.signal === filter);

  return (
    <div className="space-y-4">
      {/* 统计卡片 */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
          <div className="text-xs text-red-400 mb-1">红色警报</div>
          <div className="text-2xl font-bold text-red-400">{summary.red}</div>
        </div>
        <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
          <div className="text-xs text-yellow-400 mb-1">黄色警报</div>
          <div className="text-2xl font-bold text-yellow-400">{summary.yellow}</div>
        </div>
        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
          <div className="text-xs text-green-400 mb-1">正常</div>
          <div className="text-2xl font-bold text-green-400">{summary.green}</div>
        </div>
      </div>

      {/* 过滤按钮 */}
      <div className="flex gap-2">
        {(['all', 'RED', 'YELLOW'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-xs rounded-lg border transition ${
              filter === f
                ? 'bg-white/10 border-white/30 text-white'
                : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'
            }`}
          >
            {f === 'all' ? '全部警报' : f === 'RED' ? '红色' : '黄色'}
          </button>
        ))}
      </div>

      {/* 警报列表 */}
      <div className="space-y-2">
        {filteredItems.length === 0 ? (
          <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-center text-white/50">
            {filter === 'all' ? '当前无警报' : `无${filter === 'RED' ? '红色' : '黄色'}警报`}
          </div>
        ) : (
          filteredItems.map((item, i) => (
            <div
              key={`${item.key}-${i}`}
              className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <SignalBadge signal={item.signal} />
                <div>
                  <div className="text-sm text-white">{item.display_name}</div>
                  <div className="text-xs text-white/40">{item.layer}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-mono text-white/80">{item.value}</div>
                {item.reason && item.reason !== 'ok' && (
                  <div className="text-xs text-white/40 max-w-[150px] truncate">{item.reason}</div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
