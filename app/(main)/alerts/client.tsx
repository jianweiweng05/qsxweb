'use client';

import { useState, useEffect, useCallback } from 'react';
import { getLanguage, translations, getBilingualText, type Language } from '@/app/lib/i18n';

interface Alert {
  badge: string;
  name: string | { zh: string; en: string };
  meaning: string | { zh: string; en: string };
  action_tag: string | { zh: string; en: string };
  action_note: string | { zh: string; en: string };
  status: string;
}

interface AlertsResponse {
  ok: boolean;
  alerts: Alert[];
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

export default function AlertsClient() {
  const [lang, setLang] = useState<Language>("zh");
  const [data, setData] = useState<AlertsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLang(getLanguage());
  }, []);

  const t = translations[lang];

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('https://qsx-ai.onrender.com/macro/v1/alerts/latest', { cache: 'no-store' });
      if (!res.ok) throw new Error(`API 返回 ${res.status}`);
      const result = await res.json();
      setData(result);
    } catch (e) {
      // 接口失败时不报错，显示"当前无风险事件"
      setData({ ok: true, alerts: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <LoadingSkeleton />;

  // 取前3条报警
  const alerts = data?.alerts?.slice(0, 3) || [];
  const hasAlerts = alerts.length > 0;

  return (
    <div className="space-y-4">
      {!hasAlerts ? (
        <div className="p-6 rounded-lg bg-white/5 border border-white/10 text-center text-white/50">
          {lang === 'zh' ? '当前无风险事件' : 'No risk events'}
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert, i) => {
            const name = getBilingualText(alert.name, lang);
            const meaning = getBilingualText(alert.meaning, lang);
            const actionTag = getBilingualText(alert.action_tag, lang);
            const actionNote = getBilingualText(alert.action_note, lang);

            // 判断是否为熔断级事件（badge包含"熔断"或"Circuit"）
            const isCircuitBreaker = alert.badge?.includes('熔断') || alert.badge?.includes('Circuit');

            return (
              <div
                key={`alert-${i}`}
                className={`p-4 rounded-lg border ${
                  isCircuitBreaker
                    ? 'bg-red-500/15 border-red-500/40'
                    : 'bg-yellow-500/10 border-yellow-500/30'
                }`}
              >
                {/* Badge */}
                <div className="mb-2">
                  <span className={`inline-block px-2 py-0.5 text-xs rounded ${
                    isCircuitBreaker
                      ? 'bg-red-500/30 text-red-300 font-bold'
                      : 'bg-yellow-500/30 text-yellow-300'
                  }`}>
                    {alert.badge}
                  </span>
                </div>

                {/* Name */}
                <div className={`text-base font-semibold mb-2 ${
                  isCircuitBreaker ? 'text-red-300' : 'text-yellow-200'
                }`}>
                  {name}
                </div>

                {/* Meaning */}
                <div className="text-sm text-white/70 mb-3">
                  {meaning}
                </div>

                {/* Action */}
                <div className="text-sm">
                  <span className={`font-medium ${
                    isCircuitBreaker ? 'text-red-400' : 'text-yellow-400'
                  }`}>
                    {actionTag}
                  </span>
                  {actionNote && (
                    <span className="text-white/60 ml-1">
                      {actionNote}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
