"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getLanguage, setLanguage, translations, type Language } from "@/app/lib/i18n";

export default function SettingsPage() {
  const [lang, setLang] = useState<Language>("zh");
  const [showLangMenu, setShowLangMenu] = useState(false);

  useEffect(() => {
    setLang(getLanguage());
  }, []);

  const t = translations[lang];

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    setLanguage(newLang);
    setShowLangMenu(false);
    window.location.reload();
  };

  return (
    <div className="p-4 text-white min-h-full bg-black/90">
      <h1 className="text-xl font-bold mb-4">{t.settings}</h1>

      <div className="space-y-4">
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">{t.language}</div>
              <div className="text-sm text-white/50">
                {lang === "zh" ? "选择界面语言" : "Select interface language"}
              </div>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 transition"
              >
                {lang === "zh" ? t.chinese : t.english}
              </button>
              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-32 rounded-lg bg-slate-800 border border-white/20 shadow-lg z-10">
                  <button
                    onClick={() => handleLanguageChange("zh")}
                    className="w-full px-4 py-2 text-left hover:bg-white/10 rounded-t-lg"
                  >
                    {t.chinese}
                  </button>
                  <button
                    onClick={() => handleLanguageChange("en")}
                    className="w-full px-4 py-2 text-left hover:bg-white/10 rounded-b-lg"
                  >
                    {t.english}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">{lang === "zh" ? "时区" : "Timezone"}</div>
              <div className="text-sm text-white/50">
                {lang === "zh" ? "设置显示时区" : "Set display timezone"}
              </div>
            </div>
            <div className="text-white/50">UTC+8</div>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">{lang === "zh" ? "通知" : "Notifications"}</div>
              <div className="text-sm text-white/50">
                {lang === "zh" ? "管理推送通知" : "Manage push notifications"}
              </div>
            </div>
            <div className="text-white/50">{lang === "zh" ? "已开启" : "Enabled"}</div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Link href="/account" className="text-sm text-white/50 underline">
          {lang === "zh" ? "返回账户" : "Back to account"}
        </Link>
      </div>
    </div>
  );
}
