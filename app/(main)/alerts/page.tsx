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
          title: t.alertSystemTitle,
          description: t.alertSystemDesc,
          features: [t.alertFeature1, t.alertFeature2, t.alertFeature3]
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
