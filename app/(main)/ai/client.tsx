"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ChatPanel } from "./chat-panel";
import { useEffect } from "react";

function AIChat() {
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([]);
  const [initialQ, setInitialQ] = useState<string | null>(null);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q && !initialQ) {
      setInitialQ(q);
    }
  }, [searchParams, initialQ]);

  return <ChatPanel messages={messages} setMessages={setMessages} context={{ from: "/ai" }} />;
}

export function AIClient() {
  return (
    <Suspense fallback={<div className="text-white/40 text-sm">加载中...</div>}>
      <AIChat />
    </Suspense>
  );
}
