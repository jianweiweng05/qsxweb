import { NextRequest, NextResponse } from "next/server";
import { getUserTier, UserTier } from "@/app/lib/entitlements";
import manifest from "@/app/lib/kb/manifest.json";

type KBItem = { id: string; triggers: string[]; a: string | object };
type KBFile = { entries?: KBItem[]; constitution?: KBItem[]; rules?: KBItem[]; terms?: KBItem[]; status?: KBItem[]; templates?: KBItem[]; page_guides?: KBItem[]; subscription?: KBItem[] };

function loadKB(): Record<string, KBItem[]> {
  const result: Record<string, KBItem[]> = {};
  for (const fname of manifest.kb_files) {
    try {
      const data: KBFile = require(`@/app/lib/kb/${fname}`);
      const entries = data.entries || data.constitution || data.rules || data.terms || data.status || data.templates || data.page_guides || data.subscription;
      if (!entries) throw new Error(`No valid entries in ${fname}`);
      const cat = fname.replace('.json', '');

      // kb_p0_patch: merge entries into their target categories
      if (cat === 'kb_p0_patch') {
        for (const item of entries) {
          const targetCat = (item as any).cat?.toLowerCase() || 'constitution';
          if (!result[targetCat]) result[targetCat] = [];
          result[targetCat].push(item);
        }
      } else {
        result[cat] = entries;
      }
    } catch (e) {
      throw new Error(`Failed to load ${fname}: ${e}`);
    }
  }
  return result;
}

const KB_FILES = loadKB();

const GREETING_WORDS = ["你好", "在吗", "吃了吗", "hello", "hi", "嗨", "哈喽", "早", "晚上好", "下午好", "早上好"];
const LOGIC_WORDS = ["为什么", "背离", "关联", "导致", "影响", "原因", "逻辑", "意味", "暗示", "预示", "是否", "会不会", "如何", "怎么"];
const ANCHOR_WORDS = ["l1", "l2", "l3", "l4", "l5", "l6", "rr25", "gamma", "funding", "ls", "etf", "fgi", "hcri", "risk_cap", "coef", "macrocoef"];
const DECISION_WORDS = ["怎么办", "能不能", "要不要", "可以吗", "适合", "应该", "仓位", "风险", "短线", "波段", "观望", "昨天", "持续", "状态", "市场", "行情", "大跌", "加仓", "减仓", "满仓", "轻仓", "防守", "进攻", "趋势", "区间", "危险", "顺风", "逆风", "交易", "纪律", "预期", "依据", "代价", "改善", "忍耐", "行动"];
const JUDGEMENT_WORDS = ["偏多", "偏空", "牛市", "熊市", "震荡", "反弹", "下跌", "筑底", "情绪", "基本面", "顺势", "逆势", "成功率", "靠谱", "安全", "确定", "错误", "注意", "信号", "历史", "机构", "策略", "现货", "警惕", "问题", "类似"];
const CONFIDENCE_WORDS = ["确定", "靠谱", "安全", "什么都不做", "不做"];

function normalize(s: string): string {
  return s.toLowerCase().replace(/\s+/g, "").replace(/[，。？！、：；""'']/g, "");
}

function formatAnswer(a: string | object): string {
  if (typeof a === 'string') return a;
  const obj = a as any;
  if (obj.one_liner) return obj.one_liner;
  if (obj.what) return obj.what;
  return JSON.stringify(a);
}

function isInvalid(s: string): boolean {
  if (s.length < 2 || s.length > 200) return true;
  // 纯数字/符号
  if (/^[0-9\s\p{P}\p{S}]+$/u.test(s)) return true;
  // 重复字符（如 aaa, 😀😀😀）
  const chars = [...s];
  const unique = new Set(chars).size;
  if (unique <= 2 && s.length >= 3) return true;
  return false;
}

function matchKB(s: string): { id: string; a: string | object } | null {
  // 优先精确匹配（完整词）
  for (const cat of manifest.match_policy.priority_order) {
    const items = KB_FILES[cat] || [];
    for (const item of items) {
      for (const t of item.triggers) {
        if (s === t.toLowerCase()) {
          return { id: item.id, a: item.a };
        }
      }
    }
  }
  // 再进行包含匹配
  for (const cat of manifest.match_policy.priority_order) {
    const items = KB_FILES[cat] || [];
    for (const item of items) {
      for (const t of item.triggers) {
        const trigger = t.toLowerCase();
        if (s.includes(trigger)) {
          return { id: item.id, a: item.a };
        }
      }
    }
  }
  return null;
}

function matchStatusKB(s: string): { id: string; a: string | object } | null {
  for (const item of KB_FILES.status || []) {
    for (const t of item.triggers) {
      if (s.includes(t.toLowerCase())) {
        return { id: item.id, a: item.a };
      }
    }
  }
  return null;
}

function matchProKeyword(s: string): boolean {
  return manifest.pro_config.pro_keywords.some(k => s.includes(k.toLowerCase()));
}

function isDecisionIntent(s: string): boolean {
  return DECISION_WORDS.some(w => s.includes(w)) || JUDGEMENT_WORDS.some(w => s.includes(w));
}

function canUseLLM(s: string): boolean {
  // 裁决类问题放宽门槛：只需长度 ≥ 6
  if (isDecisionIntent(s) && [...s].length >= 6) {
    return true;
  }
  // 非裁决类：严格门槛 2+ anchor + 1+ logic + 12+ chars
  const anchorCount = ANCHOR_WORDS.filter(w => s.includes(w)).length;
  const hasLogic = LOGIC_WORDS.some(w => s.includes(w));
  const charCount = [...s].length;

  if (anchorCount >= 5 && !s.match(/\d+|具体|当前|现在|如果/)) {
    return false;
  }

  return charCount >= 12 && anchorCount >= 2 && hasLogic;
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

function classifyQuery(q: string, tier: UserTier): ClassifyResult {
  const s = normalize(q);
  if (isInvalid(s)) return { type: "blocked", reason: "invalid", text: MSG_INVALID };
  if (isGreeting(s)) return { type: "blocked", reason: "greeting", text: MSG_GREETING };

  // 1. 裁决短路：裁决意图优先匹配 status KB
  if (isDecisionIntent(s)) {
    const statusKb = matchStatusKB(s);
    if (statusKb) {
      return { type: "kb", text: formatAnswer(statusKb.a), source_id: statusKb.id };
    }
  }

  // 2. 通用 KB 匹配
  const kb = matchKB(s);
  if (kb) {
    return { type: "kb", text: `💡 [系统百科]\n${formatAnswer(kb.a)}`, source_id: kb.id };
  }

  // 3. 裁决意图但 status KB 未命中 → LLM 放行（门槛已放宽）
  if (canUseLLM(s)) {
    if (tier === "FREE") {
      return { type: "blocked", reason: "upgrade", text: manifest.pro_config.intercept_message, upgrade_hint: true };
    }
    if (matchProKeyword(s) && tier !== "PRO") {
      return { type: "blocked", reason: "pro_only", text: manifest.pro_config.intercept_message, upgrade_hint: true };
    }
    return { type: "llm", is_high_value: true };
  }

  // 4. 兜底 - 友好引导
  return {
    type: "blocked",
    reason: "no_match",
    text: "抱歉，我没有理解您的问题。\n\n您可以问我：\n• 指标定义：RR25 是什么？Funding 是什么？\n• 系统介绍：系统有什么优势？\n• 会员订阅：怎么开通会员？\n• 深度分析（VIP+）：为什么 L1 走强但 L3 费率下降？",
  };
}

const SYSTEM_PROMPT = `你是 QSX（L1–L6 Macro Weather System）的 AI 解读引擎。目标：用最少的字，说清楚最关键的风险信息。

【总原则】
1) 言简意赅，禁止长篇大论
2) 能用一句话说清的，绝不用两句
3) 优先结构化输出，禁止自由发挥
4) 不教学、不铺垫、不写背景、不讲故事
5) 不预测价格、不给点位、不下交易指令

【省钱与体验优先级】
- 回答长度优先级 > 文采 > 解释完整度
- 默认回答 ≤120 中文字
- 非必要不超过 4 行
- 不使用"首先/其次/因此/总结来说"等扩写句式

【回答策略】
- 给结论 + 1 句原因即可
- 不解释内部模型、不拆公式
示例结构：
"结论：{一句话结论}
原因：{一句话逻辑}"

【必须拒绝的情况】
- 要点位 / 买卖 / 止盈止损
- 要预测涨跌
- 要内部权重 / 公式 / 代码
统一回复："系统不提供具体交易指令，仅用于风险管理与仓位上限判断。"

【风格要求】
- 冷静、克制、专业
- 像机构风控报告，不像投顾或 KOL
- 不安抚情绪，不共情亏损
- 不使用 emoji

记住：少说一句，比多说一句更专业。`;

export async function POST(req: NextRequest) {
  const { message, language } = await req.json();
  const tier = getUserTier();
  const lang = language || "zh";

  const result = classifyQuery(message || "", tier);

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
    const systemPrompt = lang === "en"
      ? SYSTEM_PROMPT.replace("你是 QSX 全市场风险引擎的 AI 助手", "You are the AI assistant for QSX Market Risk Engine")
        .replace("不构成投资建议", "does not constitute investment advice")
        .replace("AI 分析仅基于当前数据，不构成投资建议。", "AI analysis is based on current data only and does not constitute investment advice.")
      : SYSTEM_PROMPT;

    const res = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "deepseek-chat",
        stream: true,
        messages: [
          { role: "system", content: systemPrompt },
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
