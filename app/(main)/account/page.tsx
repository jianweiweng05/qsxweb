"use client";

import { useState, useEffect } from "react";
import { UserButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { getLanguage, translations, type Language } from "@/app/lib/i18n";

export default function AccountPage() {
  const [lang, setLang] = useState<Language>("zh");
  const { user } = useUser();

  useEffect(() => {
    setLang(getLanguage());
  }, []);

  const t = translations[lang];
  const email = user?.emailAddresses?.[0]?.emailAddress || t.unknown;

  // Mock tier data - replace with actual tier logic
  const tier = "FREE" as "FREE" | "VIP" | "PRO";
  const tierName = tier === "PRO" ? "Pro" : tier === "VIP" ? "VIP" : "Free";

  return (
    <div className="p-4 text-white min-h-full bg-black/90">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">{t.account}</h1>
        <UserButton />
      </div>

      <div className="p-4 rounded-lg bg-white/5 border border-white/10 mb-4">
        <div className="text-sm text-white/50 mb-1">{t.email}</div>
        <div className="font-semibold">{email}</div>
      </div>

      <div className="p-4 rounded-lg bg-white/5 border border-white/10 mb-4">
        <div className="text-sm text-white/50 mb-1">{t.currentPlan}</div>
        <div className="flex items-center justify-between">
          <div className="font-semibold">{tierName}</div>
          {tier !== "PRO" && (
            <Link
              href="/pricing"
              className="text-sm text-blue-400 underline"
            >
              {t.upgrade}
            </Link>
          )}
        </div>
      </div>

      <div className="p-4 rounded-lg bg-white/5 border border-white/10 mb-4">
        <div className="text-sm text-white/50 mb-1">{t.expiryDate}</div>
        <div className="font-semibold">
          {tier === "FREE" ? "-" : "2026-12-31"}
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <Link
          href="/settings"
          className="block text-center px-4 py-3 bg-white/10 rounded-lg font-medium"
        >
          {t.settings}
        </Link>
      </div>

      {/* 订阅能力对比 */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">{t.subscriptionFeatures}</h2>

        <div className="space-y-4">
          {/* VIP 能力 */}
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium">VIP</span>
              {tier === "VIP" && (
                <span className="px-2 py-0.5 text-xs rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  {t.currentPlanBadge}
                </span>
              )}
            </div>
            <ul className="space-y-2 text-sm text-white/70">
              <li>• {lang === "zh" ? "AI 市场解读" : "AI Market Analysis"}</li>
              <li>• {lang === "zh" ? "多空信号分析" : "Long/Short Signal Analysis"}</li>
              <li>• {lang === "zh" ? "无限次 AI 对话" : "Unlimited AI Chat"}</li>
            </ul>
          </div>

          {/* Pro 能力 */}
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium">Pro</span>
              {tier === "PRO" && (
                <span className="px-2 py-0.5 text-xs rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  {t.currentPlanBadge}
                </span>
              )}
            </div>
            <ul className="space-y-2 text-sm text-white/70">
              <li>• {lang === "zh" ? "包含所有 VIP 功能" : "All VIP Features"}</li>
              <li>• {lang === "zh" ? "实时报警系统" : "Real-time Alert System"}</li>
              <li>• {lang === "zh" ? "波动状态监控 (Gamma)" : "Volatility Monitoring (Gamma)"}</li>
              <li>• {lang === "zh" ? "专业策略建议" : "Professional Strategy Advice"}</li>
              <li>• {lang === "zh" ? "历史报警回溯" : "Historical Alert Review"}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
