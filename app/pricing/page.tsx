import Link from "next/link";
import { getUserTier, getTierDisplayName } from "@/app/lib/entitlements";

export const dynamic = "force-dynamic";

const plans = [
  {
    id: "free",
    name: "免费版",
    price: "¥0",
    period: "/月",
    features: [
      "Landing 页面访问",
      "功能介绍",
      "延迟历史日报（3-7天）",
    ],
    cta: null,
    highlight: false,
  },
  {
    id: "vip",
    name: "VIP",
    price: "¥99",
    period: "/月",
    features: [
      "当日日报",
      "市场状态",
      "仓位上限建议",
      "AI 解读",
    ],
    cta: { text: "升级到 VIP", href: "/subscribe?plan=vip" },
    highlight: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "¥299",
    period: "/月",
    features: [
      "包含 VIP 全部功能",
      "策略建议",
      "实时报警",
      "历史相似性分析",
    ],
    cta: { text: "升级到 Pro", href: "/subscribe?plan=pro" },
    highlight: true,
  },
];

export default function PricingPage() {
  const currentTier = getUserTier();
  const currentTierName = getTierDisplayName(currentTier);

  return (
    <div className="p-4 text-white min-h-screen bg-black/90">
      <h1 className="text-xl font-bold mb-2">选择方案</h1>
      <p className="text-sm text-white/50 mb-6">
        当前方案：{currentTierName}
      </p>

      <div className="space-y-4">
        {plans.map((plan) => {
          const isCurrent = 
            (plan.id === "free" && currentTier === "FREE") ||
            (plan.id === "vip" && currentTier === "VIP") ||
            (plan.id === "pro" && currentTier === "PRO");

          return (
            <div
              key={plan.id}
              className={`p-4 rounded-lg border ${
                plan.highlight
                  ? "bg-blue-900/20 border-blue-500/50"
                  : "bg-white/5 border-white/10"
              }`}
            >
              <div className="flex items-baseline justify-between mb-2">
                <div className="font-semibold text-lg">{plan.name}</div>
                <div>
                  <span className="text-xl font-bold">{plan.price}</span>
                  <span className="text-sm text-white/50">{plan.period}</span>
                </div>
              </div>

              <ul className="text-sm text-white/70 space-y-1 mb-4">
                {plan.features.map((f, i) => (
                  <li key={i}>• {f}</li>
                ))}
              </ul>

              {isCurrent ? (
                <div className="text-sm text-white/50 text-center py-2">
                  当前方案
                </div>
              ) : plan.cta ? (
                <Link
                  href={plan.cta.href}
                  className={`block text-center px-4 py-2 rounded-lg text-sm font-medium ${
                    plan.highlight
                      ? "bg-blue-600 text-white"
                      : "bg-white/10 text-white"
                  }`}
                >
                  {plan.cta.text}
                </Link>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="mt-6 text-center">
        <Link href="/account" className="text-sm text-white/50 underline">
          返回账户
        </Link>
      </div>
    </div>
  );
}
