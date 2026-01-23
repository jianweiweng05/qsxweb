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
    noData: "暂无数据",
    expand: "展开",
    collapse: "收起",
    viewDetails: "查看详情",
    hideDetails: "收起详情",

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

    // Today page
    todayOverview: "今日概览",
    marketStatus: "市场状态",
    recommendedPosition: "建议仓位",
    riskAllocation: "风险配置建议",
    aiAnalysis: "机构分析师观点",
    bearishSignals: "空方信号",
    bullishSignals: "多方信号",
    volatilityStatus: "波动状态",
    viewVolatilityDetails: "查看波动详情",
    hideVolatilityDetails: "收起波动详情",
    viewAllocationDetails: "查看配置详情",
    hideAllocationDetails: "收起配置详情",
    upgradeProForVolatility: "升级 Pro 查看波动详情",
    upgradeProForAllocation: "升级 Pro 查看",
    upgradeProForDetails: "升级 Pro 查看配置详情",
    volatilityMonitoringTitle: "波动状态监控",
    volatilityMonitoringDesc: "实时追踪市场波动率变化，帮助您把握市场节奏，优化进出场时机。",
    volatilityFeature1: "Gamma 波动率实时监控",
    volatilityFeature2: "市场情绪波动预警",
    volatilityFeature3: "历史波动率对比分析",
    riskAllocationTitle: "风险配置建议",
    riskAllocationDesc: "基于市场结构风险分析，为您提供 BTC、ETH 和山寨币的动态配置建议。",
    riskAllocationFeature1: "实时资产配置权重",
    riskAllocationFeature2: "风险传导分析",
    riskAllocationFeature3: "流动性闸门监控",
    allocationDetailsTitle: "配置详情",
    allocationDetailsDesc: "查看 BTC、ETH 和山寨币的具体配置权重。",
    aiMarketAnalysisTitle: "AI 市场解读",
    aiMarketAnalysisDesc: "基于多维度数据分析，为您提供专业的市场解读和投资建议。",
    aiMarketFeature1: "每日市场核心观点总结",
    aiMarketFeature2: "多空信号智能识别",
    aiMarketFeature3: "关键风险点提示",
    vipRequired: "AI 解读需要 VIP 订阅",
    vipVisible: "VIP 可见",
    riskWarning: "风险提示",

    // Toolbox page
    toolbox: "工具箱",
    globalRiskMonitor: "全球资产风险监控仪",
    globalRiskAllocation: "全球资产风险配置建议",
    status: "状态",
    asset: "资产",
    action: "状态",
    positionAdvice: "仓位建议",
    historicalSimilarity: "历史相似度",
    strategyMatrix: "策略适配矩阵",
    similarScenes: "相似场景",
    proAnalysis: "Pro 结构解读",
    similarity: "相似度",
    historyReplay: "历史重现",
    noChartData: "暂无K线图",
    noSimilarityData: "暂无历史相似性数据",
    noMatrixData: "暂无矩阵数据",
    noStrategyData: "暂无策略适配矩阵数据",
    upgradeProForSimilarity: "升级 Pro 查看完整分析",
    upgradeProForMatrix: "升级 Pro 查看策略适配矩阵",
    upgradeProForPosition: "升级 Pro 查看仓位建议",
    upgradeProForAnalysis: "升级 Pro 查看详细分析",
    strategyName: "策略名称",
    strategyType: "类型",
    decision: "决策",
    score: "评分",
    recommended: "推荐",
    optional: "可选",
    avoid: "规避",
    recommendedCount: "推荐",
    optionalCount: "可选",
    avoidCount: "规避",
    items: "个",
    macroConclusion: "宏观结论",
    noDetailedDescription: "暂无详细说明",

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
    noData: "No data",
    expand: "Expand",
    collapse: "Collapse",
    viewDetails: "View details",
    hideDetails: "Hide details",

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

    // Today page
    todayOverview: "Today's Overview",
    marketStatus: "Market Status",
    recommendedPosition: "Recommended Position",
    riskAllocation: "Risk Allocation",
    aiAnalysis: "Analyst Insights",
    bearishSignals: "Bearish Signals",
    bullishSignals: "Bullish Signals",
    volatilityStatus: "Volatility Status",
    viewVolatilityDetails: "View volatility details",
    hideVolatilityDetails: "Hide volatility details",
    viewAllocationDetails: "View allocation details",
    hideAllocationDetails: "Hide allocation details",
    upgradeProForVolatility: "Upgrade to Pro for volatility details",
    upgradeProForAllocation: "Upgrade to Pro",
    upgradeProForDetails: "Upgrade to Pro for allocation details",
    volatilityMonitoringTitle: "Volatility Monitoring",
    volatilityMonitoringDesc: "Real-time tracking of market volatility changes to help you optimize entry and exit timing.",
    volatilityFeature1: "Real-time Gamma volatility monitoring",
    volatilityFeature2: "Market sentiment volatility alerts",
    volatilityFeature3: "Historical volatility comparison",
    riskAllocationTitle: "Risk Allocation Advice",
    riskAllocationDesc: "Dynamic allocation recommendations for BTC, ETH, and altcoins based on market structure risk analysis.",
    riskAllocationFeature1: "Real-time asset allocation weights",
    riskAllocationFeature2: "Risk contagion analysis",
    riskAllocationFeature3: "Liquidity gate monitoring",
    allocationDetailsTitle: "Allocation Details",
    allocationDetailsDesc: "View specific allocation weights for BTC, ETH, and altcoins.",
    aiMarketAnalysisTitle: "AI Market Analysis",
    aiMarketAnalysisDesc: "Professional market insights and investment advice based on multi-dimensional data analysis.",
    aiMarketFeature1: "Daily market core insights",
    aiMarketFeature2: "Intelligent long/short signal identification",
    aiMarketFeature3: "Key risk point alerts",
    vipRequired: "VIP subscription required for AI analysis",
    vipVisible: "VIP only",
    riskWarning: "Risk Warning",

    // Toolbox page
    toolbox: "Toolbox",
    globalRiskMonitor: "Global Asset Risk Monitor",
    globalRiskAllocation: "Global Asset Risk Allocation",
    status: "Status",
    asset: "Asset",
    action: "Action",
    positionAdvice: "Position Advice",
    historicalSimilarity: "Historical Similarity",
    strategyMatrix: "Strategy Matrix",
    similarScenes: "Similar Scenarios",
    proAnalysis: "Pro Analysis",
    similarity: "Similarity",
    historyReplay: "History Replay",
    noChartData: "No chart data",
    noSimilarityData: "No historical similarity data",
    noMatrixData: "No matrix data",
    noStrategyData: "No strategy matrix data",
    upgradeProForSimilarity: "Upgrade to Pro for full analysis",
    upgradeProForMatrix: "Upgrade to Pro for strategy matrix",
    upgradeProForPosition: "Upgrade to Pro for position advice",
    upgradeProForAnalysis: "Upgrade to Pro for detailed analysis",
    strategyName: "Strategy",
    strategyType: "Type",
    decision: "Decision",
    score: "Score",
    recommended: "Recommended",
    optional: "Optional",
    avoid: "Avoid",
    recommendedCount: "Recommended",
    optionalCount: "Optional",
    avoidCount: "Avoid",
    items: "",
    macroConclusion: "Macro Conclusion",
    noDetailedDescription: "No detailed description",

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

// Helper to extract bilingual field
export function getBilingualText(field: any, lang: Language): string {
  if (!field) return "";
  if (typeof field === "string") return field;
  if (typeof field === "object") {
    return field[lang] || field[lang === "zh" ? "en" : "zh"] || "";
  }
  return "";
}
