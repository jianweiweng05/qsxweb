"use client";

import { useState, useEffect } from "react";
import { PageGate } from "@/app/lib/gate";
import AlertsClient from "./client";
import { getLanguage, translations, type Language } from "@/app/lib/i18n";
import { getUserTier } from "@/app/lib/entitlements";
import { HelpButton } from "../toolbox/help-modal";

export default function AlertsPage() {
  const [lang, setLang] = useState<Language>("zh");

  useEffect(() => {
    setLang(getLanguage());
  }, []);

  const t = translations[lang];

  const tier = getUserTier();

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
      <div className="flex items-center gap-2 mb-4">
        <h1 className="text-xl font-bold">{t.alerts}</h1>
        <HelpButton indicatorKey="alert_system" />
      </div>
      <AlertsClient />
    </div>
  );
}
