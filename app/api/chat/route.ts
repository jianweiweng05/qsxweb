import { NextRequest, NextResponse } from "next/server";
import { getUserTier, UserTier } from "@/app/lib/entitlements";
import faqData from "@/app/lib/knowledge_faq.json";

// 频率限制存储 (内存 Map)
const rateLimitMap = new Map<string, number>();
const RATE_LIMITS: Record<UserTier, number> = { FREE: 10000, VIP: 3000, PRO: 1000 };

// PRO 专属关键词
const PRO_KEYWORDS = faqData.pro_config.pro_keywords;

// 获取客户端 IP
function getClientIP(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
}

// 检查频率限制
function checkRateLimit(ip: string, tier: UserTier): boolean {
  const now = Date.now();
  const lastTime = rateLimitMap.get(ip) || 0;
  const limit = RATE_LIMITS[tier];
  if (now - lastTime < limit) return false;
  rateLimitMap.set(ip, now);
  return true;
}

// 知识库匹配
function matchKB(message: string): { id: string; q: string; a: string } | null {
  const lower = message.toLowerCase();
  for (const item of faqData.faq) {
    if (item.keywords.some((kw) => lower.includes(kw.toLowerCase()))) {
      return item;
    }
  }
  return null;
}

// 检查是否命中 PRO 专属关键词
function hitProKeywords(message: string): boolean {
  const lower = message.toLowerCase();
  return PRO_KEYWORDS.some((kw) => lower.includes(kw.toLowerCase()));
}

// 系统提示词
const SYSTEM_PROMPT = `你是 QuantscopeX 的 AI 助手，专注于加密货币市场分析。
规则：
1. 基于数据客观分析，不编造数据
2. 如果缺少数据，明确说明"当前数据不可用"
3. 禁止给出"建议买入/卖出"等指令性投资建议
4. 回答末尾必须加上："\n\n⚠️ 以上内容仅供参考，不构成投资建议。"`;

export async function POST(req: NextRequest) {
  const { message } = await req.json();
  const tier = getUserTier();
  const ip = getClientIP(req);

  // 1. 输入校验
  if (!message || typeof message !== "string") {
    console.log("[chat] blocked: empty input");
    return NextResponse.json({ type: "blocked", text: "请输入有效问题", reason: "empty" });
  }
  if (message.length > 2000) {
    console.log("[chat] blocked: too long");
    return NextResponse.json({ type: "blocked", text: "问题过长，请精简后重试（最多2000字）", reason: "too_long" });
  }

  // 2. 频率限制
  if (!checkRateLimit(ip, tier)) {
    const wait = tier === "FREE" ? 10 : tier === "VIP" ? 3 : 1;
    console.log(`[chat] blocked: rate limit (${tier})`);
    return NextResponse.json({ type: "blocked", text: `请求过于频繁，请 ${wait} 秒后重试`, reason: "rate_limit" });
  }

  // 3. PRO 专属内容拦截
  if (hitProKeywords(message) && tier !== "PRO") {
    console.log(`[chat] blocked: pro content (${tier})`);
    return NextResponse.json({ type: "blocked", text: "该功能需要 Pro 订阅，请升级后使用", reason: "pro_required" });
  }

  // 4. 知识库匹配
  const kbMatch = matchKB(message);
  if (kbMatch) {
    console.log(`[chat] kb hit: ${kbMatch.id}`);
    return NextResponse.json({ type: "kb", text: `${kbMatch.a}\n\n来源：FAQ#${kbMatch.id} ${kbMatch.q}` });
  }

  // 5. DeepSeek 兜底
  console.log("[chat] llm call");
  const baseUrl = process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com";
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ type: "blocked", text: "AI 服务暂不可用", reason: "no_key" });
  }

  try {
    const res = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: message },
        ],
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ type: "blocked", text: "AI 服务暂时不可用，请稍后重试", reason: "api_error" });
    }

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || "无法生成回复";
    return NextResponse.json({ type: "llm", text: reply });
  } catch {
    return NextResponse.json({ type: "blocked", text: "网络错误，请稍后重试", reason: "network" });
  }
}
