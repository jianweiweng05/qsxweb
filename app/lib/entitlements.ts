// 会员门禁：支持环境变量切换
export function getUserTier(): "PRO" | "NONE" {
  const tier = process.env.NEXT_PUBLIC_QSX_TIER;
  return tier === "PRO" ? "PRO" : "NONE";
}
