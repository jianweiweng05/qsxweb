import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="p-4 text-white min-h-screen bg-black/90">
      <h1 className="text-xl font-bold mb-6">选择方案</h1>
      <div className="space-y-4">
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="font-semibold mb-2">Pro</div>
          <div className="text-sm text-white/50 mb-3">策略建议 + 实时告警</div>
          <Link href="/subscribe?plan=pro" className="inline-block px-4 py-2 bg-blue-600 rounded-lg text-sm">升级到 Pro</Link>
        </div>
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="font-semibold mb-2">Max</div>
          <div className="text-sm text-white/50 mb-3">全部功能 + API 访问</div>
          <Link href="/subscribe?plan=max" className="inline-block px-4 py-2 bg-purple-600 rounded-lg text-sm">升级到 Max</Link>
        </div>
      </div>
    </div>
  );
}
