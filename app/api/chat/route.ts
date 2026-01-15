import { NextRequest, NextResponse } from "next/server";
import { getUserTier, UserTier } from "@/app/lib/entitlements";
import manifest from "@/app/lib/kb/manifest.json";
import constitution from "@/app/lib/kb/constitution.json";
import rules from "@/app/lib/kb/rules.json";
import terms from "@/app/lib/kb/terms.json";
import templates from "@/app/lib/kb/templates.json";

type KBItem = { id: string; triggers: string[]; a: string };
const KB_FILES: Record<string, KBItem[]> = {
  constitution: constitution.constitution,
  rules: rules.rules,
  terms: terms.terms,
  templates: templates.templates,
};

const GREETING_WORDS = ["你好", "在吗", "吃了吗", "hello", "hi", "嗨", "哈喽", "早", "晚上好", "下午好", "早上好"];
const LOGIC_WORDS = ["为什么", "背离", "关联", "导致", "影响", "原因", "逻辑"];
const ANCHOR_WORDS = ["l1", "l2", "l3", "l4", "l5", "l6", "rr25", "gamma", "funding", "ls", "etf", "fgi", "hcri", "risk_cap", "coef", "macrocoef"];

// Session-based repeat tracking (in-memory, per IP)
const repeatTracker = new Map<string, { id: string; count: number }>();

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
  for (const cat of manifest.match_policy.priority_order) {
    const items = KB_FILES[cat] || [];
    for (const item of items) {
      if (item.triggers.some((t: string) => s.includes(t.toLowerCase()))) {
        return { id: item.id, a: item.a };
      }
    }
  }
  return null;
}

function matchProKeyword(s: string): boolean {
  return manifest.pro_config.pro_keywords.some(k => s.includes(k.toLowerCase()));
}

function canUseLLM(s: string): boolean {
  // Require 2+ anchor words + 1+ logic word + length 15+
  const anchorCount = ANCHOR_WORDS.filter(w => s.includes(w)).length;
  const hasLogic = LOGIC_WORDS.some(w => s.includes(w));
  return s.length >= 15 && anchorCount >= 2 && hasLogic;
}

function isGreeting(s: string): boolean {
  return GREETING_WORDS.some(w => s.includes(w));
}

const MSG_GREETING = "你好！我是 QuantscopeX AI 助手。我能回答：市场状态/仓位规则/指标定义/页面功能。试试问：'RR25 是什么？'或'仓位规则'";
const MSG_INVALID = "请输入有效的市场问题（2-200字）。";

type ClassifyResult =
  | { type: "blocked"; reason: string; text: string; upgrade_hint?: boolean }
  | { type: "kb"; text: string; source_id: string }
  | { type: "llm"; is_high_value: boolean };

function classifyQuery(q: string, tier: UserTier, ip: string): ClassifyResult {
  const s = normalize(q);
  if (isInvalid(s)) return { type: "blocked", reason: "invalid", text: MSG_INVALID };
  if (isGreeting(s)) return { type: "blocked", reason: "greeting", text: MSG_GREETING };

  const kb = matchKB(s);
  if (kb) {
    // Anti-repeat logic
    const tracker = repeatTracker.get(ip);
    if (tracker && tracker.id === kb.id) {
      tracker.count++;
      if (tracker.count >= 3) {
        repeatTracker.delete(ip);
        return {
          type: "blocked",
          reason: "repeat",
          text: "💡 [系统提示]：检测到重复提问。为了获取更深度的解答，请尝试结合两个层级指标提问（如：为什么 L1 走强但 L3 费率下降？），这将触发 AI 深度推演模式。",
        };
      }
    } else {
      repeatTracker.set(ip, { id: kb.id, count: 1 });
    }
    return { type: "kb", text: `💡 [系统百科]\n${kb.a}`, source_id: kb.id };
  }

  // FREE 永不调 LLM
  if (tier === "FREE") {
    return { type: "blocked", reason: "upgrade", text: manifest.pro_config.intercept_message, upgrade_hint: true };
  }
  // VIP/PRO 检查 pro_keywords 拦截
  if (matchProKeyword(s) && tier !== "PRO") {
    return { type: "blocked", reason: "pro_only", text: manifest.pro_config.intercept_message, upgrade_hint: true };
  }
  // 检查 LLM 触发条件
  if (!canUseLLM(s)) {
    return {
      type: "blocked",
      reason: "no_llm_match",
      text: "💡 [系统提示]：当前提问过于模糊。建议在提问中包含 ≥2 个层级指标（如 L1+L5），AI 将自动为您开启深度逻辑推演。",
      upgrade_hint: false,
    };
  }
  return { type: "llm", is_high_value: true };
}

const SYSTEM_PROMPT = `你是 QuantscopeX AI 助手，专注于加密市场宏观分析。
输出格式：
1. 一句结论（不含买卖指令）
2. 三条要点（每条必须引用具体字段名或层级，如 L3.RR25 / L3.funding / L2.etf.btc.us_netflow）
3. 末尾固定："\n\nAI 分析仅基于当前数据，不构成投资建议。"`;

function getIP(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "unknown";
}

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
    console.log(`[chat] path=kb tier=${tier} source_id=${result.source_id}`);
    return NextResponse.json({ type: "kb", text: result.text, source_id: result.source_id });
  }

  // LLM
  console.log(`[chat] path=llm tier=${tier} is_high_value=${result.is_high_value}`);
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

    // Transform stream to add prefix
    const reader = res.body.getReader();
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    let isFirst = true;

    const stream = new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            let chunk = decoder.decode(value, { stream: true });
            if (isFirst) {
              chunk = `data: ${JSON.stringify({ choices: [{ delta: { content: "🧠 [AI 深度推演]\n" } }] })}\n\n${chunk}`;
              isFirst = false;
            }
            controller.enqueue(encoder.encode(chunk));
          }
          controller.close();
        } catch (e) {
          controller.error(e);
        }
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" },
    });
  } catch {
    return NextResponse.json({ type: "blocked", text: "网络错误，请稍后重试" });
  }
}
