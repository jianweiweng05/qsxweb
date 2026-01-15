"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const SUGGESTIONS = [
  "现在的市场状态是什么？",
  "当前仓位应该怎么控制？",
  "有没有需要特别注意的风险？",
];

function AIChat() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [upgradeHint, setUpgradeHint] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setInput(q);
      handleAsk(q);
    }
  }, [searchParams]);

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
    setLoading(true);
    setUpgradeHint(false);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
        signal: abortRef.current.signal,
      });

      const contentType = res.headers.get("content-type") || "";

      if (contentType.includes("text/event-stream") && res.body) {
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
    setLoading(false);
  }

  const disabled = loading || streaming;
  const showSuggestions = messages.length === 0 && !input;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
        <div className="w-7 h-7 rounded bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center text-cyan-400 text-sm font-bold">
          Q
        </div>
        <span className="text-white/60 text-sm">AI 市场研究员</span>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-auto space-y-4 pr-1">
        {messages.length === 0 ? (
          <div className="text-white/30 text-sm py-8 text-center">
            输入问题开始对话
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
              {m.role === "ai" && (
                <div className="w-6 h-6 rounded bg-cyan-500/10 flex items-center justify-center text-cyan-400 text-xs font-bold shrink-0 mt-0.5">
                  Q
                </div>
              )}
              <div
                className={`max-w-[85%] px-4 py-3 rounded-lg text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-blue-600/20 text-white/90"
                    : "bg-white/5 text-white/80 border border-white/5"
                }`}
              >
                <pre className="whitespace-pre-wrap font-sans">{m.text}</pre>
              </div>
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

      {/* Upgrade hint */}
      {upgradeHint && (
        <button
          onClick={() => router.push("/pricing")}
          className="mt-3 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600/80 to-blue-600/80 text-sm text-white/90 hover:from-cyan-600 hover:to-blue-600 transition self-start"
        >
          升级 VIP/PRO →
        </button>
      )}

      {/* Suggestions */}
      {showSuggestions && (
        <div className="flex gap-2 mt-4 flex-wrap">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => handleAsk(s)}
              disabled={disabled}
              className="px-3 py-1.5 text-xs rounded-full bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white/80 transition disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="mt-4 pt-3 border-t border-white/10">
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
            className="w-full px-4 py-3 pr-14 rounded-lg bg-white/5 border border-white/10 text-sm text-white/90 placeholder:text-white/30 resize-none disabled:opacity-50 focus:outline-none focus:border-cyan-500/50"
          />
          <button
            onClick={() => handleAsk()}
            disabled={disabled || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-md bg-cyan-600/80 hover:bg-cyan-600 flex items-center justify-center disabled:opacity-30 transition"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export function AIClient() {
  return (
    <Suspense fallback={<div className="text-white/40 text-sm">加载中...</div>}>
      <AIChat />
    </Suspense>
  );
}
