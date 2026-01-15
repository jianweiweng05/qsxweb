"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const SUGGESTIONS = ["RR25 是什么？", "L3 层是什么？", "仓位规则"];

function AIChat() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [input, setInput] = useState("");
  const [reply, setReply] = useState("");
  const [replyType, setReplyType] = useState<"kb" | "llm" | "blocked" | "upgrade" | "">("");
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

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
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          // 解析 SSE
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
      } else {
        // JSON 响应 (KB/blocked/upgrade)
        const data = await res.json();
        setReplyType(data.type || "blocked");
        setReply(data.text || "请求失败");
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        setReply("网络错误");
        setReplyType("blocked");
      }
    }
    setLoading(false);
  }

  return (
    <>
      <div className="flex gap-2 mb-3 flex-wrap">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => { setInput(s); handleAsk(s); }}
            className="px-3 py-1 text-xs rounded-full bg-white/10 hover:bg-white/20 transition"
          >
            {s}
          </button>
        ))}
      </div>
      <div className="flex gap-2 mb-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAsk()}
          placeholder="输入问题..."
          className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-sm"
        />
        <button
          onClick={() => handleAsk()}
          disabled={loading || !input.trim()}
          className="px-4 py-2 rounded-lg bg-blue-600 text-sm disabled:opacity-50"
        >
          {loading ? "..." : "发送"}
        </button>
      </div>
      <div className="flex-1 p-4 rounded-lg bg-white/5 border border-white/10 overflow-auto">
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
    </>
  );
}

export function AIClient() {
  return (
    <Suspense fallback={<div className="text-white/40">加载中...</div>}>
      <AIChat />
    </Suspense>
  );
}
