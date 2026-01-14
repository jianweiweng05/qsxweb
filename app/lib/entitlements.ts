// 订阅分层类型
export type UserTier = "FREE" | "VIP" | "PRO";

// 功能权限映射
export const TIER_FEATURES = {
  FREE: {
    landing: true,
    delayedReports: true,      // 延迟 3-7 天的历史日报
    delayDays: 3,              // 最小延迟天数
  },
  VIP: {
    landing: true,
    delayedReports: true,
    todayReport: true,         // 当日日报
    marketState: true,         // 市场状态
    riskCap: true,             // 仓位上限
    aiInterpretation: true,    // AI 解读
  },
  PRO: {
    landing: true,
    delayedReports: true,
    todayReport: true,
    marketState: true,
    riskCap: true,
    aiInterpretation: true,
    strategySuggestion: true,  // 策略建议
    alerts: true,              // 报警
    historySimilarity: true,   // 历史相似性
  },
} as const;

// 获取用户当前订阅层级（支持环境变量切换）
export function getUserTier(): UserTier {
  const tier = process.env.NEXT_PUBLIC_QSX_TIER;
  if (tier === "PRO") return "PRO";
  if (tier === "VIP") return "VIP";
  return "FREE";
}

// 检查用户是否至少达到指定层级
export function hasMinTier(requiredTier: UserTier): boolean {
  const currentTier = getUserTier();
  const tierOrder: UserTier[] = ["FREE", "VIP", "PRO"];
  return tierOrder.indexOf(currentTier) >= tierOrder.indexOf(requiredTier);
}

// 检查用户是否有特定功能权限
export function hasFeature(feature: string): boolean {
  const tier = getUserTier();
  const features = TIER_FEATURES[tier] as Record<string, boolean | number>;
  return !!features[feature];
}

// 获取层级显示名称
export function getTierDisplayName(tier: UserTier): string {
  const names: Record<UserTier, string> = {
    FREE: "免费版",
    VIP: "VIP",
    PRO: "Pro",
  };
  return names[tier];
}
