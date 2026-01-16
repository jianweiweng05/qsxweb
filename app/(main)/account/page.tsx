import { getUserTier, getTierDisplayName } from "@/app/lib/entitlements";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const tier = getUserTier();
  const tierName = getTierDisplayName(tier);
  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress || "未知";

  return (
    <div className="p-4 text-white min-h-full bg-black/90">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">账户</h1>
        <UserButton />
      </div>

      <div className="p-4 rounded-lg bg-white/5 border border-white/10 mb-4">
        <div className="text-sm text-white/50 mb-1">邮箱</div>
        <div className="font-semibold">{email}</div>
      </div>

      <div className="p-4 rounded-lg bg-white/5 border border-white/10 mb-4">
        <div className="text-sm text-white/50 mb-1">当前方案</div>
        <div className="flex items-center justify-between">
          <div className="font-semibold">{tierName}</div>
          {tier !== "PRO" && (
            <Link
              href="/pricing"
              className="text-sm text-blue-400 underline"
            >
              升级
            </Link>
          )}
        </div>
      </div>

      <div className="p-4 rounded-lg bg-white/5 border border-white/10 mb-4">
        <div className="text-sm text-white/50 mb-1">到期时间</div>
        <div className="font-semibold">
          {tier === "FREE" ? "-" : "2026-12-31"}
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <Link
          href="/settings"
          className="block text-center px-4 py-3 bg-white/10 rounded-lg font-medium"
        >
          设置
        </Link>
      </div>

      {/* 订阅能力对比 */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">订阅能力</h2>

        <div className="space-y-4">
          {/* VIP 能力 */}
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium">VIP</span>
              {tier === "VIP" && (
                <span className="px-2 py-0.5 text-xs rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  当前方案
                </span>
              )}
            </div>
            <ul className="space-y-2 text-sm text-white/70">
              <li>• AI 市场解读</li>
              <li>• 多空信号分析</li>
              <li>• 无限次 AI 对话</li>
            </ul>
          </div>

          {/* Pro 能力 */}
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium">Pro</span>
              {tier === "PRO" && (
                <span className="px-2 py-0.5 text-xs rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  当前方案
                </span>
              )}
            </div>
            <ul className="space-y-2 text-sm text-white/70">
              <li>• 包含所有 VIP 功能</li>
              <li>• 实时报警系统</li>
              <li>• 波动状态监控 (Gamma)</li>
              <li>• 专业策略建议</li>
              <li>• 历史报警回溯</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
