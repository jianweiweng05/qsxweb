import { useState, useEffect } from "react";

export type Language = "zh" | "en";

export const translations = {
  zh: {
    // Navigation
    today: "今日",
    dataCenter: "数据中心",
    pro: "工具箱",
    myAccount: "我的",
    alerts: "报警",

    // Account
    account: "账户",
    email: "邮箱",
    currentPlan: "当前方案",
    upgrade: "升级",
    expiryDate: "到期时间",
    subscriptionFeatures: "订阅能力",
    currentPlanBadge: "当前方案",

    // Settings
    settings: "设置",
    language: "语言",
    chinese: "中文",
    english: "English",
    selectLanguage: "选择界面语言",
    timezone: "时区",
    setTimezone: "设置显示时区",
    notifications: "通知",
    manageNotifications: "管理推送通知",
    enabled: "已开启",
    backToAccount: "返回账户",

    // Alerts
    currentAlerts: "当前报警",
    historyAlerts: "历史报警",
    redAlerts: "红色警报",
    noRedAlerts: "当前无红色警报",
    noHistoryAlerts: "暂无历史报警记录",
    days: "天",
    retry: "重试",

    // Common
    save: "保存",
    cancel: "取消",
    confirm: "确认",
    unknown: "未知",

    // Features
    aiMarketAnalysis: "AI 市场解读",
    longShortSignal: "多空信号分析",
    unlimitedAiChat: "无限次 AI 对话",
    allVipFeatures: "包含所有 VIP 功能",
    realtimeAlertSystem: "实时报警系统",
    volatilityMonitoring: "波动状态监控 (Gamma)",
    professionalStrategy: "专业策略建议",
    historicalAlertReview: "历史报警回溯",

    // Alert page unlock
    alertSystemTitle: "实时报警系统",
    alertSystemDesc: "7x24 小时监控市场异常信号，第一时间发现风险和机会。",
    alertFeature1: "多层级风险监控",
    alertFeature2: "历史报警回溯分析",
    alertFeature3: "关键指标异常提醒",

    // Risk disclaimer
    riskDisclaimer: "本系统为研究型全市场风险分析工具，基于多维历史数据与结构化模型提供风险环境参考，不构成投资建议或收益承诺，所有决策与风险由用户自行承担。",
  },
  en: {
    // Navigation
    today: "Today",
    dataCenter: "Data Center",
    pro: "Toolbox",
    myAccount: "My Account",
    alerts: "Alerts",

    // Account
    account: "Account",
    email: "Email",
    currentPlan: "Current Plan",
    upgrade: "Upgrade",
    expiryDate: "Expiry Date",
    subscriptionFeatures: "Subscription Features",
    currentPlanBadge: "Current Plan",

    // Settings
    settings: "Settings",
    language: "Language",
    chinese: "中文",
    english: "English",
    selectLanguage: "Select interface language",
    timezone: "Timezone",
    setTimezone: "Set display timezone",
    notifications: "Notifications",
    manageNotifications: "Manage push notifications",
    enabled: "Enabled",
    backToAccount: "Back to account",

    // Alerts
    currentAlerts: "Current Alerts",
    historyAlerts: "Alert History",
    redAlerts: "Red Alerts",
    noRedAlerts: "No red alerts",
    noHistoryAlerts: "No alert history",
    days: "days",
    retry: "Retry",

    // Common
    save: "Save",
    cancel: "Cancel",
    confirm: "Confirm",
    unknown: "Unknown",

    // Features
    aiMarketAnalysis: "AI Market Analysis",
    longShortSignal: "Long/Short Signal Analysis",
    unlimitedAiChat: "Unlimited AI Chat",
    allVipFeatures: "All VIP Features",
    realtimeAlertSystem: "Real-time Alert System",
    volatilityMonitoring: "Volatility Monitoring (Gamma)",
    professionalStrategy: "Professional Strategy Advice",
    historicalAlertReview: "Historical Alert Review",

    // Alert page unlock
    alertSystemTitle: "Real-time Alert System",
    alertSystemDesc: "24/7 market anomaly monitoring, detect risks and opportunities in real-time.",
    alertFeature1: "Multi-level risk monitoring",
    alertFeature2: "Historical alert analysis",
    alertFeature3: "Key indicator alerts",

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
  const [mounted, setMounted] = useState(false);
  const [lang, setLang] = useState<Language>("zh");

  useEffect(() => {
    setMounted(true);
    setLang(getLanguage());
  }, []);

  return {
    t: translations[lang],
    lang,
    setLang: setLanguage,
    mounted,
  };
}
