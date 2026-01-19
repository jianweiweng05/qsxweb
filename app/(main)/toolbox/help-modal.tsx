"use client";

import { useState, useEffect } from "react";
import indicatorHelp from "@/app/lib/kb/indicator_help.json";
import alertIndicators from "@/app/lib/kb/alert_indicators.json";

interface HelpContent {
  title: string;
  one_liner: string;
  how_to_read: string;
  notes: string[];
}

export function HelpButton({
  content,
  indicatorKey,
  kbFile = "indicator_help",
  size = "md"
}: {
  content?: React.ReactNode;
  indicatorKey?: string;
  kbFile?: "indicator_help" | "alert_indicators";
  size?: "xs" | "md";
}) {
  const [open, setOpen] = useState(false);

  // 根据 kbFile 选择知识库
  const kb = kbFile === "alert_indicators" ? alertIndicators : indicatorHelp;

  // 如果提供了 indicatorKey，从字典加载内容
  const helpData: HelpContent | null = indicatorKey
    ? (() => {
        if (kbFile === "alert_indicators") {
          // 新格式：在 threshold_indicators 和 composite_events 数组中查找
          const allItems = [
            ...(alertIndicators.threshold_indicators || []),
            ...(alertIndicators.composite_events || [])
          ];
          const item = allItems.find((x: any) =>
          x.id?.toUpperCase() === indicatorKey?.toUpperCase() ||
          x.code?.toUpperCase() === indicatorKey?.toUpperCase()
        );
          if (!item) {
            console.log('[HelpButton] Item not found for key:', indicatorKey);
            return null;
          }

          // 合并所有说明字段
          const notes = [
            ...(item.what_can_happen || []),
            ...(item.recommended_actions || []),
            ...((item as any).caveats || [])
          ];

          const result = {
            title: item.title,
            one_liner: item.short || "",
            how_to_read: item.what_it_means || "",
            notes
          };
          console.log('[HelpButton] Loaded data for', indicatorKey, ':', result);
          return result;
        }
        return (kb as Record<string, HelpContent>)[indicatorKey] || null;
      })()
    : null;

  // 锁定滚动
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const displayContent = helpData ? (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">{helpData.title}</h3>
      <div className="space-y-3">
        <div>
          <div className="text-xs text-white/50 mb-1">一句话</div>
          <div className="text-sm text-white/80">{helpData.one_liner}</div>
        </div>
        <div>
          <div className="text-xs text-white/50 mb-1">怎么读</div>
          <div className="text-sm text-white/80">{helpData.how_to_read}</div>
        </div>
        <div>
          <div className="text-xs text-white/50 mb-1">注意事项</div>
          <ul className="space-y-1.5">
            {helpData.notes.map((note, i) => (
              <li key={i} className="text-sm text-white/70 leading-relaxed">• {note}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  ) : content;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`text-white/40 hover:text-white/70 transition-colors flex-shrink-0 ${size === 'xs' ? 'opacity-60' : ''}`}
        aria-label="查看说明"
      >
        <svg className={size === 'xs' ? 'w-3 h-3' : 'w-4 h-4'} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
      </button>

      {open && (
        <>
          {/* PC: 居中弹窗 */}
          <div className="hidden md:flex fixed inset-0 z-50 items-center justify-center p-4 bg-black/80" onClick={() => setOpen(false)}>
            <div className="bg-zinc-900 rounded-lg border border-white/10 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                {displayContent}
                <button
                  onClick={() => setOpen(false)}
                  className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded text-sm transition-colors w-full"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>

          {/* 移动端: 底部抽屉 */}
          <div className="md:hidden fixed inset-0 z-50 flex items-end bg-black/80" onClick={() => setOpen(false)}>
            <div
              className="bg-zinc-900 rounded-t-2xl border-t border-white/10 w-full max-h-[85vh] overflow-y-auto animate-slide-up"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-zinc-900 border-b border-white/10 px-4 py-3 flex items-center justify-between">
                <div className="w-12 h-1 bg-white/20 rounded-full mx-auto" />
              </div>
              <div className="p-4 pb-8">
                {displayContent}
                <button
                  onClick={() => setOpen(false)}
                  className="mt-6 px-4 py-3 bg-white/10 active:bg-white/20 rounded-lg text-sm transition-colors w-full font-medium"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
