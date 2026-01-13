import Link from "next/link";
import { getUserTier } from "./entitlements";

export function isPro(): boolean {
  return getUserTier() === "PRO";
}

export function ProGate({ children }: { children: React.ReactNode }) {
  if (isPro()) return <>{children}</>;
  return (
    <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-center py-6">
      <div className="text-white/50 mb-3">🔒 Pro 内容已锁定</div>
      <Link href="/pricing" className="inline-block px-4 py-2 bg-blue-600 rounded-lg text-sm text-white">
        升级 Pro
      </Link>
    </div>
  );
}
