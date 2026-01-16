"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AIInput() {
  const [question, setQuestion] = useState("");
  const router = useRouter();

  const handleSubmit = () => {
    if (question.trim()) {
      router.push(`/ai?q=${encodeURIComponent(question.trim())}`);
    }
  };

  return (
    <div className="flex gap-2 h-10">
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        placeholder="向 AI 提问..."
        className="flex-1 px-3 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/30"
      />
      <button
        onClick={handleSubmit}
        disabled={!question.trim()}
        className="px-4 rounded-lg bg-white/5 border border-white/10 text-sm hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        确认
      </button>
    </div>
  );
}
