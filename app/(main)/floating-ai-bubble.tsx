"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { ChatPanel } from "./ai/chat-panel";

const PAGE_SUGGESTIONS: Record<string, string[]> = {
  today: [
    "今天的建议仓位是多少？为什么？",
    "当前市场状态下应该采取什么策略？",
    "多空信号分别指向什么？"
  ],
  radar: [
    "如何解读当前的市场数据？",
    "哪些指标值得重点关注？",
    "数据显示的趋势是什么？"
  ],
  toolbox: [
    "今日相似度分析说明了什么？",
    "策略指引建议如何操作？",
    "如何使用这些工具优化决策？"
  ],
  alerts: [
    "当前有哪些重要的风险信号？",
    "报警级别如何判断？",
    "历史报警数据显示什么规律？"
  ],
  account: [
    "VIP 和 Pro 订阅有什么区别？",
    "如何修改账户信息或取消订阅？",
    "遇到问题如何联系客服或提交反馈？"
  ]
};

export function FloatingAIBubble({
  messages,
  setMessages,
}: {
  messages: { role: "user" | "ai"; text: string }[];
  setMessages: (msgs: { role: "user" | "ai"; text: string }[] | ((prev: { role: "user" | "ai"; text: string }[]) => { role: "user" | "ai"; text: string }[])) => void;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const getContext = () => {
    if (pathname.startsWith("/account")) return { from: "/account", suggestions: PAGE_SUGGESTIONS.account };
    if (pathname.startsWith("/alerts")) return { from: "/alerts", suggestions: PAGE_SUGGESTIONS.alerts };
    if (pathname.startsWith("/toolbox")) return { from: "/toolbox", suggestions: PAGE_SUGGESTIONS.toolbox };
    if (pathname.startsWith("/radar")) return { from: "/radar", suggestions: PAGE_SUGGESTIONS.radar };
    return { from: "/today", suggestions: PAGE_SUGGESTIONS.today };
  };

  return (
    <>
      <style jsx>{`
        @keyframes breathe {
          0%, 100% { box-shadow: 0 0 8px rgba(0, 229, 255, 0.3), 0 0 16px rgba(0, 229, 255, 0.15); }
          50% { box-shadow: 0 0 12px rgba(0, 229, 255, 0.5), 0 0 24px rgba(0, 229, 255, 0.25); }
        }
        .ai-bubble {
          animation: breathe 3.5s ease-in-out infinite;
        }
        .ai-bubble:hover {
          transform: scale(1.05);
          box-shadow: 0 0 16px rgba(0, 229, 255, 0.6), 0 0 32px rgba(0, 229, 255, 0.3) !important;
        }
      `}</style>
      <button
        onClick={() => setOpen(true)}
        className="ai-bubble fixed z-40 w-14 h-14 rounded-full flex items-center justify-center transition-all"
        style={{
          bottom: "calc(72px + env(safe-area-inset-bottom) + 16px)",
          right: "16px",
          background: "rgba(10, 20, 30, 0.65)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(0, 229, 255, 0.6)"
        }}
        aria-label="AI助手"
      >
        <span className="text-cyan-400 text-xl font-semibold tracking-tight" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
          AI
        </span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 bg-black/60 z-50 lg:hidden" onClick={() => setOpen(false)} />
          <div className="fixed inset-0 bg-black/40 z-50 hidden lg:block" onClick={() => setOpen(false)} />

          <div
            className="fixed z-50 bg-[#0a0e14]/95 backdrop-blur-md border-white/10 shadow-2xl
                       bottom-0 left-0 right-0 h-[80vh] rounded-t-2xl border-t border-l border-r
                       lg:bottom-auto lg:top-0 lg:left-auto lg:right-0 lg:h-full lg:w-[480px] lg:rounded-none lg:border-l lg:border-t-0 lg:border-r-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white/80 text-sm font-medium">AI 助手</h2>
                <button
                  onClick={() => setOpen(false)}
                  className="text-white/40 hover:text-white/80 transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <ChatPanel messages={messages} setMessages={setMessages} context={getContext()} />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
