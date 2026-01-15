"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const SUGGESTIONS = [
  "今天市场状态一句话？",
  "我现在建议仓位是多少？给上限%",
  "L1-L6 哪一层最危险？为什么？",
  "今天最重要的 3 个风险点？",
  "有没有红色警报？如果没有，最接近的是哪项？",
  "历史相似性 Top3 是什么？各自一句话意义",
];

function AIChat() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [input, setInput] = useState("");
  const [reply, setReply] = useState("");
  const [replyType, setReplyType] = useState<"kb" | "llm" | "blocked" | "upgrade" | "">("");
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setInput(q);
      handleAsk(q);
    }
  }, [searchParams]);

  async function handleAsk(msg?: string) {
    const message = msg || input;
    if (!message.trim()) return;

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    setReply("");
    setReplyType("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
        signal: abortRef.current.signal,
      });

      const contentType = res.headers.get("content-type") || "";

      // 流式响应 (LLM)
      if (contentType.includes("text/event-stream") && res.body) {
        setReplyType("llm");
        setInput("");
        setStreaming(true);
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

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
                if (content) setReply((prev) => prev + content);
              } catch {}
            }
          }
        }
        setStreaming(false);
        inputRef.current?.focus();
      } else {
        // JSON 响应 (KB/blocked/upgrade)
        const data = await res.json();
        setReplyType(data.type || "blocked");
        setReply(data.text || "请求失败");
        setInput("");
        inputRef.current?.focus();
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        setReply("网络错误");
        setReplyType("blocked");
        // 出错不清空输入
      }
    }
    setLoading(false);
  }

  const disabled = loading || streaming;

  return (
    <div className="flex flex-col h-full">
      {!reply && !input && (
        <div className="flex gap-2 mb-3 flex-wrap">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => { setInput(s); handleAsk(s); }}
              disabled={disabled}
              className="px-3 py-1 text-xs rounded-full bg-white/10 hover:bg-white/20 transition disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>
      )}
      <div className="flex-1 p-4 rounded-lg bg-white/5 border border-white/10 overflow-auto mb-4">
        {reply ? (
          <div>
            <pre className="text-sm text-white/80 whitespace-pre-wrap">{reply}</pre>
            {replyType === "upgrade" && (
              <button
                onClick={() => router.push("/pricing")}
                className="mt-4 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-sm font-medium"
              >
                升级 Pro
              </button>
            )}
          </div>
        ) : (
          <div className="text-sm text-white/40">AI 回复将显示在这里</div>
        )}
      </div>
      <div className="relative">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAsk(); } }}
          placeholder="输入问题..."
          disabled={disabled}
          rows={2}
          className="w-full px-3 py-3 pr-16 rounded-lg bg-white/10 border border-white/20 text-sm resize-none disabled:opacity-50"
        />
        <button
          onClick={() => handleAsk()}
          disabled={disabled || !input.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-md bg-blue-600 text-xs disabled:opacity-50"
        >
          {loading ? "..." : "发送"}
        </button>
      </div>
    </div>
  );
}

export function AIClient() {
  return (
    <Suspense fallback={<div className="text-white/40">加载中...</div>}>
      <AIChat />
    </Suspense>
  );
}
