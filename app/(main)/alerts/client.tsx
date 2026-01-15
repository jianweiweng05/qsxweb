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

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-16 bg-white/5 rounded-lg" />
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
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
  const [tab, setTab] = useState<'current' | 'history'>('current');

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

  // 只收集红色报警
  const redItems = layers.flatMap(layer =>
    layer.items
      .filter(item => item.signal === 'RED')
      .map(item => ({ ...item, layer: layer.layer }))
  );

  return (
    <div className="space-y-4">
      {/* Tab 切换 */}
      <div className="flex gap-2">
        <button
          onClick={() => setTab('current')}
          className={`px-4 py-2 text-sm rounded-lg border transition ${
            tab === 'current'
              ? 'bg-red-500/20 border-red-500/30 text-red-400'
              : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'
          }`}
        >
          当前报警
        </button>
        <button
          onClick={() => setTab('history')}
          className={`px-4 py-2 text-sm rounded-lg border transition ${
            tab === 'history'
              ? 'bg-white/10 border-white/30 text-white'
              : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'
          }`}
        >
          历史报警
        </button>
      </div>

      {tab === 'current' ? (
        <>
          {/* 红色报警统计 */}
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
            <div className="text-xs text-red-400 mb-1">红色警报</div>
            <div className="text-3xl font-bold text-red-400">{summary.red}</div>
          </div>

          {/* 红色报警列表 */}
          <div className="space-y-2">
            {redItems.length === 0 ? (
              <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-center text-white/50">
                当前无红色警报
              </div>
            ) : (
              redItems.map((item, i) => (
                <div
                  key={`${item.key}-${i}`}
                  className="p-3 rounded-lg bg-red-500/5 border border-red-500/20 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-block w-3 h-3 rounded-full bg-red-500" />
                    <div>
                      <div className="text-sm text-white">{item.display_name}</div>
                      <div className="text-xs text-white/40">{item.layer}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-mono text-white/80">{item.value}</div>
                    {item.reason && item.reason !== 'ok' && (
                      <div className="text-xs text-red-400/70 max-w-[150px] truncate">{item.reason}</div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        /* 历史报警占位 */
        <div className="p-6 rounded-lg bg-white/5 border border-white/10 text-center">
          <div className="text-white/50 mb-2">历史报警</div>
          <div className="text-xs text-white/30">功能开发中...</div>
        </div>
      )}
    </div>
  );
}
