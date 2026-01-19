"use client";

import { getUserTier } from "@/app/lib/entitlements";

export default function HistoryPage() {
  const tier = getUserTier();

  return (
    <div className="p-4 text-white min-h-full bg-black/90">
      <h1 className="text-xl font-bold mb-4">历史</h1>

      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
        <div className="text-sm text-white/50 mb-2">延迟历史日报</div>
        <div className="text-sm text-white/70 mb-3">
          {tier === "FREE"
            ? "免费用户可查看 3-7 天前的历史日报"
            : "查看历史日报存档"}
        </div>
        <div className="text-xs text-yellow-500/70">
          {tier === "FREE" && "* 数据延迟 3-7 天"}
        </div>
      </div>
    </div>
  );
}
