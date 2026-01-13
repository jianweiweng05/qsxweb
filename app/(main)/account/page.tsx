import { getUserTier } from "@/app/lib/entitlements";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const tier = getUserTier();
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
        <div className="font-semibold">{tier === "PRO" ? "Pro" : "免费版"}</div>
      </div>
      <div className="p-4 rounded-lg bg-white/5 border border-white/10 mb-4">
        <div className="text-sm text-white/50 mb-1">到期时间</div>
        <div className="font-semibold">{tier === "PRO" ? "2026-12-31" : "-"}</div>
      </div>
      <Link href="/pricing" className="inline-block px-4 py-2 bg-blue-600 rounded-lg text-sm">管理订阅</Link>
    </div>
  );
}
