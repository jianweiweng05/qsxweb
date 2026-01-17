"use client";

import { useState, useEffect } from "react";
import { PageGate } from "@/app/lib/gate";
import AlertsClient from "./client";
import { getLanguage, translations, type Language } from "@/app/lib/i18n";

export default function AlertsPage() {
  const [lang, setLang] = useState<Language>("zh");

  useEffect(() => {
    setLang(getLanguage());
  }, []);

  const t = translations[lang];

  // Mock tier - replace with actual tier logic
  const tier = "FREE" as "FREE" | "VIP" | "PRO";

  if (tier !== "PRO") {
    return (
      <PageGate
        requiredTier="PRO"
        title={t.alerts}
        unlockConfig={{
          title: lang === "zh" ? "实时报警系统" : "Real-time Alert System",
          description: lang === "zh"
            ? "7x24 小时监控市场异常信号，第一时间发现风险和机会。"
            : "24/7 market anomaly monitoring, detect risks and opportunities in real-time.",
          features: lang === "zh"
            ? [
                "多层级风险监控",
                "历史报警回溯分析",
                "关键指标异常提醒"
              ]
            : [
                "Multi-level risk monitoring",
                "Historical alert analysis",
                "Key indicator alerts"
              ]
        }}
      >
        <></>
      </PageGate>
    );
  }

  return (
    <div className="p-4 text-white min-h-full bg-black/90">
      <h1 className="text-xl font-bold mb-4">{t.alerts}</h1>
      <AlertsClient />
    </div>
  );
}
