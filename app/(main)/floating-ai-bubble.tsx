"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { ChatPanel } from "../ai/chat-panel";

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
    const parts = pathname.split("/").filter(Boolean);
    const page = parts[parts.length - 1] || "today";
    return { from: `/${page}` };
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed z-40 w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 hover:from-cyan-500/30 hover:to-blue-600/30 transition-all shadow-lg"
        style={{ bottom: "calc(72px + env(safe-area-inset-bottom) + 16px)", right: "16px" }}
        aria-label="AI助手"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
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
