"use client";

import { useState, useEffect, useRef } from "react";
import { UnlockTrigger } from "@/app/lib/unlock-modal";

function DecisionCard({ text }: { text: string }) {
  const lines = text.split("\n").filter(Boolean);
  const fields: Record<string, string> = {};
  for (const line of lines) {
    const match = line.match(/【(.+?)】(.+)/);
    if (match) fields[match[1]] = match[2].trim();
  }

  return (
    <div className="max-w-[85%] rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-cyan-500/20 shadow-lg overflow-hidden">
      <div className="px-4 py-1.5 bg-cyan-500/10 border-b border-cyan-500/10 flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
        <span className="text-[10px] text-cyan-400/80 font-medium tracking-wide">系统裁决</span>
      </div>
      <div className="p-4 space-y-3">
        {fields["市场状态"] && (
          <div>
            <span className="text-[10px] text-white/40 uppercase tracking-wider">市场状态</span>
            <p className="text-sm text-white/90 font-medium mt-0.5">{fields["市场状态"]}</p>
          </div>
        )}
        {fields["风险等级"] && (
          <div>
            <span className="text-[10px] text-white/40 uppercase tracking-wider">风险等级</span>
            <p className="text-sm text-white/90 font-medium mt-0.5">{fields["风险等级"]}</p>
          </div>
        )}
        {fields["仓位建议"] && (
          <div className="py-2 px-3 -mx-1 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <span className="text-[10px] text-amber-400/80 uppercase tracking-wider">仓位建议</span>
            <p className="text-lg text-amber-400 font-bold mt-0.5">{fields["仓位建议"]}</p>
          </div>
        )}
        {fields["原因"] && (
          <div className="pt-2 border-t border-white/5">
            <span className="text-[10px] text-white/40 uppercase tracking-wider">原因</span>
            <p className="text-xs text-white/60 mt-1 leading-relaxed">{fields["原因"]}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function isDecisionText(text: string): boolean {
  return text.includes("【市场状态】") && text.includes("【仓位建议】");
}

const SUGGESTIONS = [
  "我已经看了说明，但不确定该不该执行",
  "多个指标结论冲突时，应该信哪个",
  "当前环境下，哪些风险说明没有覆盖",
];

type Message = { role: "user" | "ai"; text: string };

export function ChatPanel({
  messages,
  setMessages,
  context,
}: {
  messages: Message[];
  setMessages: (msgs: Message[] | ((prev: Message[]) => Message[])) => void;
  context?: { from?: string; symbol?: string; suggestions?: string[] };
}) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [upgradeHint, setUpgradeHint] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function handleAsk(msg?: string) {
    const message = msg || input;
    if (!message.trim()) return;

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setMessages((prev) => [...prev, { role: "user", text: message }]);
    setInput("");
    setUpgradeHint(false);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, context }),
        signal: abortRef.current.signal,
      });

      const contentType = res.headers.get("content-type") || "";

      if (contentType.includes("text/event-stream") && res.body) {
        setLoading(true);
        setStreaming(true);
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let aiText = "";

        setMessages((prev) => [...prev, { role: "ai", text: "" }]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") continue;
              try {
                const json = JSON.parse(data);
                const content = json.choices?.[0]?.delta?.content;
                if (content) {
                  aiText += content;
                  setMessages((prev) => {
                    const updated = [...prev];
                    updated[updated.length - 1] = { role: "ai", text: aiText };
                    return updated;
                  });
                }
              } catch {}
            }
          }
        }
        setStreaming(false);
        setLoading(false);
        inputRef.current?.focus();
      } else {
        const data = await res.json();
        setMessages((prev) => [...prev, { role: "ai", text: data.text || "请求失败" }]);
        if (data.upgrade_hint) setUpgradeHint(true);
        inputRef.current?.focus();
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        setMessages((prev) => [...prev, { role: "ai", text: "网络错误" }]);
      }
    }
  }

  const disabled = loading || streaming;
  const showSuggestions = messages.length === 0 && !input;
  const suggestions = context?.suggestions || SUGGESTIONS;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
        <div className="w-7 h-7 rounded bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center text-cyan-400 text-sm font-bold">
          Q
        </div>
        <div className="flex-1">
          <span className="text-white/60 text-sm">AI 市场研究员</span>
          {context?.from && (
            <span className="ml-2 text-xs text-white/40">· {context.from}</span>
          )}
          {context?.symbol && (
            <span className="ml-1 text-xs text-cyan-400/60">{context.symbol}</span>
          )}
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-auto space-y-4 pr-1">
        {messages.length === 0 ? (
          <div className="text-white/40 text-xs py-8 px-4 text-center leading-relaxed">
            💡 本页面的大部分指标与结论，都可以点击 ⓘ 查看说明<br />
            如果说明仍无法解答你的问题，再向我提问
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
              {m.role === "ai" && (
                <div className="w-6 h-6 rounded bg-cyan-500/10 flex items-center justify-center text-cyan-400 text-xs font-bold shrink-0 mt-0.5">
                  Q
                </div>
              )}
              {m.role === "ai" && isDecisionText(m.text) ? (
                <DecisionCard text={m.text} />
              ) : (
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-lg text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-blue-600/20 text-white/90"
                      : "bg-white/5 text-white/80 border border-white/5"
                  }`}
                >
                  <pre className="whitespace-pre-wrap font-sans">{m.text}</pre>
                </div>
              )}
            </div>
          ))
        )}
        {loading && !streaming && (
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded bg-cyan-500/10 flex items-center justify-center text-cyan-400 text-xs font-bold shrink-0">
              Q
            </div>
            <div className="text-white/40 text-sm">思考中...</div>
          </div>
        )}
      </div>

      {upgradeHint && (
        <UnlockTrigger
          tier="VIP"
          title="AI 深度分析"
          description="解锁更深入的市场分析能力，获取更详细的投资建议和风险评估。"
          features={[
            "无限次数 AI 对话",
            "深度市场分析报告",
            "个性化投资建议"
          ]}
        >
          <div className="mt-3 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-sm text-white/90 hover:bg-white/15 transition cursor-pointer inline-block">
            升级 VIP/PRO →
          </div>
        </UnlockTrigger>
      )}

      {showSuggestions && (
        <div className="flex gap-2 mt-4 flex-wrap">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => handleAsk(s)}
              disabled={disabled}
              className="px-3 py-1.5 text-xs rounded-lg bg-white/6 border border-white/12 text-white/70 hover:bg-white/10 hover:text-white/90 transition disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="mt-4 pt-4 px-4 -mx-4 -mb-4 bg-white/8 border-t border-white/15 rounded-t-lg">
        <div className="relative">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAsk();
              }
            }}
            placeholder="请输入市场问题..."
            disabled={disabled}
            rows={1}
            className="w-full px-4 py-3 pr-14 rounded-lg bg-white/10 border border-white/15 text-sm text-white/90 placeholder:text-white/40 resize-none disabled:opacity-50 focus:outline-none focus:border-cyan-500/30"
          />
          <button
            onClick={() => handleAsk()}
            disabled={disabled || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-md bg-white/10 hover:bg-cyan-500/70 flex items-center justify-center disabled:opacity-30 transition text-white/60 hover:text-white"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
