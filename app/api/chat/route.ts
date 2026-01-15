import { NextRequest, NextResponse } from "next/server";
import { getUserTier, UserTier } from "@/app/lib/entitlements";
import faqData from "@/app/lib/knowledge_faq.json";

// FREE miss 计数
const freeMissMap = new Map<string, number>();

// 锚点词表（按 group 分）
const ANCHOR_GROUPS: Record<string, string[]> = {
  L: ["l1","l2","l3","l4","l5","l6","宏观","资金","衍生品","链上","情绪","结构"],
  D: ["rr25","skew","偏度","funding","资金费率","ls","多空比","oi","未平仓","基差","basis","liq","清算","gamma","vega"],
  F: ["etf","净流","7dma","flow","资金流","dxy","vix","spx","ndx","us10y","gold","oil","liquidity","流动性"],
  R: ["risk_cap","仓位","风控","风险上限","回撤","阈值","分层"],
};

// 逻辑词表
const LOGIC_WORDS = ["为什么","背离","关联","暗示","因果","影响","说明","意味着","怎么解读","如何理解","冲突","共振","验证","确认"];

// 文案
const MSG = {
  invalid: "请输入有效的市场问题（2-200字）。",
  greeting: "你好！我是 QuantscopeX AI 助手。我能回答：市场状态/仓位规则/指标定义/页面功能。试试问：'今天市场状态？'或'仓位上限多少？'",
  upgrade: "当前功能需要 PRO 才能查看完整分析。\n\n🎁 新用户可享受 3 天 PRO 免费试用（可随时取消，仅一次）。\n👉 立即开通：/pricing",
};

// 闲聊检测
const GREETING_WORDS = ["你好", "在吗", "吃了吗", "hello", "hi", "嗨", "哈喽", "早", "晚上好", "下午好", "早上好"];

function getIP(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/\s+/g, "").replace(/[，。？！、：；""'']/g, "");
}

function isInvalid(s: string): boolean {
  if (s.length < 2 || s.length > 200) return true;
  // 纯数字/符号/重复字符占比 > 0.6
  const junk = s.replace(/[\u4e00-\u9fa5a-z0-9]/gi, "");
  if (junk.length / s.length > 0.6) return true;
  // 重复字符检测
  const chars = [...s];
  const unique = new Set(chars).size;
  if (unique <= 2 && s.length > 4) return true;
  return false;
}

function matchKB(s: string): { id: string; a: string } | null {
  for (const item of faqData.faq) {
    if (item.triggers.some((t: string) => s.includes(t.toLowerCase()))) {
      return { id: item.id, a: item.a };
    }
  }
  return null;
}

function countAnchorGroups(s: string): number {
  let count = 0;
  for (const words of Object.values(ANCHOR_GROUPS)) {
    if (words.some(w => s.includes(w))) count++;
  }
  return count;
}

function hasLogicWord(s: string): boolean {
  return LOGIC_WORDS.some(w => s.includes(w));
}

function isGreeting(s: string): boolean {
  return GREETING_WORDS.some(w => s.includes(w));
}

function isDataReasoning(s: string): boolean {
  const n = s.length;
  if (n < 15 || n > 120) return false;
  if (countAnchorGroups(s) < 2) return false;
  if (!hasLogicWord(s)) return false;
  return true;
}

type ClassifyResult =
  | { type: "blocked"; reason: string; text: string; upgrade_hint?: boolean }
  | { type: "kb"; text: string; id: string }
  | { type: "llm" };

function classifyQuery(q: string, tier: UserTier, ip: string): ClassifyResult {
  const s = normalize(q);

  // A0 输入校验
  if (isInvalid(s)) {
    return { type: "blocked", reason: "invalid", text: MSG.invalid };
  }

  // A0.5 闲聊检测（所有 tier 都用固定回复）
  if (isGreeting(s)) {
    return { type: "blocked", reason: "greeting", text: MSG.greeting };
  }

  // A1 KB 匹配（所有 tier，100% 优先）
  const kb = matchKB(s);
  if (kb) {
    return { type: "kb", text: kb.a, id: kb.id };
  }

  // A2 非 PRO 用户：未命中 KB 则返回订阅引导（不调用 LLM）
  if (tier !== "PRO") {
    const miss = freeMissMap.get(ip) || 0;
    freeMissMap.set(ip, miss + 1);
    return { type: "blocked", reason: "upgrade", text: MSG.upgrade, upgrade_hint: true };
  }

  // A3 PRO 用户：检查智力门槛
  if (!isDataReasoning(s)) {
    return { type: "blocked", reason: "upgrade", text: MSG.upgrade, upgrade_hint: true };
  }

  return { type: "llm" };
}

const SYSTEM_PROMPT = `你是 QuantscopeX AI 助手，专注于加密市场宏观分析。
输出格式：
1. 一句结论（不含买卖指令）
2. 三条要点（每条必须引用具体字段名或层级，如 L3.RR25 / L3.funding / L2.etf.btc.us_netflow）
3. 末尾固定："\n\nAI 分析仅基于当前数据，不构成投资建议。"`;

export async function POST(req: NextRequest) {
  const { message } = await req.json();
  const tier = getUserTier();
  const ip = getIP(req);

  const result = classifyQuery(message || "", tier, ip);

  if (result.type === "blocked") {
    console.log(`[chat] path=blocked tier=${tier} reason=${result.reason}`);
    return NextResponse.json({ type: "blocked", text: result.text, upgrade_hint: result.upgrade_hint });
  }

  if (result.type === "kb") {
    console.log(`[chat] path=kb tier=${tier} reason=${result.id}`);
    return NextResponse.json({ type: "kb", text: result.text });
  }

  // LLM
  console.log(`[chat] path=llm tier=${tier} reason=data_reasoning`);
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const baseUrl = process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com";
  if (!apiKey) {
    return NextResponse.json({ type: "blocked", text: "AI 服务暂不可用" });
  }

  try {
    const res = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "deepseek-chat",
        stream: true,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: message },
        ],
      }),
    });

    if (!res.ok || !res.body) {
      return NextResponse.json({ type: "blocked", text: "AI 服务暂时不可用" });
    }

    return new Response(res.body, {
      headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" },
    });
  } catch {
    return NextResponse.json({ type: "blocked", text: "网络错误，请稍后重试" });
  }
}
