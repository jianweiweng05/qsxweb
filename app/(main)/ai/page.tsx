import { VIPGate, ProGate } from "@/app/lib/gate";
import { getUserTier } from "@/app/lib/entitlements";

export const dynamic = "force-dynamic";

export default function AIPage() {
  const tier = getUserTier();

  return (
    <div className="p-4 text-white min-h-full bg-black/90">
      <h1 className="text-xl font-bold mb-4">AI 助手</h1>

      <div className="lg:grid lg:grid-cols-2 lg:gap-6">
        <div className="space-y-4">
          {/* AI 解读 - VIP+ */}
          <div className="text-sm text-white/50 mb-2">AI 解读</div>
          <VIPGate lockedMessage="AI 解读需要 VIP 订阅">
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="text-white/70">AI 市场解读（占位）</div>
            </div>
          </VIPGate>

          {/* 策略生成 - Pro */}
          <div className="text-sm text-white/50 mb-2 mt-4">策略生成</div>
          <ProGate lockedMessage="策略生成需要 Pro 订阅">
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="text-white/70">Pro 策略生成（占位）</div>
            </div>
          </ProGate>
        </div>

        <div className="mt-4 lg:mt-0 p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="text-sm text-white/50 mb-1">AI 助手说明</div>
          <div className="text-sm text-white/70">
            {tier === "FREE" && "升级到 VIP 解锁 AI 解读功能"}
            {tier === "VIP" && "升级到 Pro 解锁策略生成功能"}
            {tier === "PRO" && "您已解锁全部 AI 功能"}
          </div>
        </div>
      </div>
    </div>
  );
}
