"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

const SUGGESTIONS = ["RR25 是什么？", "L3 层是什么？", "仓位建议规则"];

function AIChat() {
  const searchParams = useSearchParams();
  const [input, setInput] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    setReply("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      setReply(data.text || "请求失败");
    } catch {
      setReply("网络错误");
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
          <pre className="text-sm text-white/80 whitespace-pre-wrap">{reply}</pre>
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
