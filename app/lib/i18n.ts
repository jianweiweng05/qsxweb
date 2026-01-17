export type Language = "zh" | "en";

export const translations = {
  zh: {
    // Settings
    settings: "设置",
    language: "语言",
    chinese: "中文",
    english: "English",

    // Common
    save: "保存",
    cancel: "取消",
    confirm: "确认",

    // Risk disclaimer
    riskDisclaimer: "本系统为研究型全市场风险分析工具，基于多维历史数据与结构化模型提供风险环境参考，不构成投资建议或收益承诺，所有决策与风险由用户自行承担。",
  },
  en: {
    // Settings
    settings: "Settings",
    language: "Language",
    chinese: "中文",
    english: "English",

    // Common
    save: "Save",
    cancel: "Cancel",
    confirm: "Confirm",

    // Risk disclaimer
    riskDisclaimer: "This system is a research-oriented market risk analysis tool that provides risk environment references based on multi-dimensional historical data and structured models. It does not constitute investment advice or profit guarantees. All decisions and risks are borne by users.",
  },
};

export function getLanguage(): Language {
  if (typeof window === "undefined") return "zh";
  return (localStorage.getItem("language") as Language) || "zh";
}

export function setLanguage(lang: Language) {
  if (typeof window !== "undefined") {
    localStorage.setItem("language", lang);
  }
}

export function useTranslation() {
  const lang = getLanguage();
  return {
    t: translations[lang],
    lang,
    setLang: setLanguage,
  };
}
