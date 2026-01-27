import { NextRequest, NextResponse } from "next/server";
import { getUserTier, UserTier } from "@/app/lib/entitlements";
import manifest from "@/app/lib/kb/manifest.json";
import {
  loadKB,
  normalize,
  formatAnswer,
  isInvalid,
  matchKB,
  matchStatusKB,
  matchProKeyword,
  isDecisionIntent,
  canUseLLM,
  isGreeting,
} from "@/app/lib/kb/kb-utils";

const KB_FILES = loadKB();

const MSG_GREETING = "你好！我是 QuantscopeX AI 助手。我能回答：市场状态/仓位规则/指标定义/页面功能。试试问：'RR25 是什么？'或'仓位规则'";
const MSG_GREETING_EN = "Hello! I'm QuantscopeX AI assistant. I can answer: market status/position rules/indicator definitions/page features. Try asking: 'What is RR25?' or 'Position rules'";

function detectLanguage(text: string): "zh" | "en" {
  const chineseChars = text.match(/[\u4e00-\u9fa5]/g);
  return chineseChars && chineseChars.length > text.length * 0.3 ? "zh" : "en";
}

async function translateText(text: string, targetLang: "zh" | "en"): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const baseUrl = process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com";
  if (!apiKey || text.length > 600) return text;

  try {
    const prompt = targetLang === "zh"
      ? `Translate the following text to Chinese. Only output the translation, no explanations:\n\n${text}`
      : `Translate the following text to English. Only output the translation, no explanations:\n\n${text}`;

    const res = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      }),
    });

    if (!res.ok) return text;
    const data = await res.json();
    return data.choices?.[0]?.message?.content || text;
  } catch {
    return text;
  }
}
const MSG_INVALID = "请输入有效的市场问题（2-200字）。";
const MSG_INVALID_EN = "Please enter a valid market question (2-200 characters).";

type ClassifyResult =
  | { type: "blocked"; reason: string; text: string; upgrade_hint?: boolean }
  | { type: "kb"; text: string; source_id: string }
  | { type: "llm"; is_high_value: boolean };

function classifyQuery(q: string, tier: UserTier, lang: "zh" | "en"): ClassifyResult {
  const s = normalize(q);
  if (isInvalid(s)) return { type: "blocked", reason: "invalid", text: lang === "en" ? MSG_INVALID_EN : MSG_INVALID };
  if (isGreeting(s)) return { type: "blocked", reason: "greeting", text: lang === "en" ? MSG_GREETING_EN : MSG_GREETING };

  // 1. 裁决短路：裁决意图优先匹配 status KB
  if (isDecisionIntent(s)) {
    const statusKb = matchStatusKB(s, KB_FILES);
    if (statusKb) {
      return { type: "kb", text: formatAnswer(statusKb.a), source_id: statusKb.id };
    }
  }

  // 2. 通用 KB 匹配
  const kb = matchKB(s, KB_FILES);
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

【语言约束】
- 严格使用中文回答
- 忽略之前对话中的其他语言上下文

记住：少说一句，比多说一句更专业。`;

const SYSTEM_PROMPT_EN = `You are the AI interpretation engine for QSX (L1–L6 Macro Weather System). Goal: Use the fewest words to explain the most critical risk information.

【Core Principles】
1) Be concise, no lengthy explanations
2) If one sentence is enough, never use two
3) Prioritize structured output, no free-form elaboration
4) No teaching, no background, no storytelling
5) No price predictions, no specific levels, no trading orders

【Priority】
- Response length priority > eloquence > completeness
- Default response ≤120 words
- No more than 4 lines unless necessary
- Avoid filler phrases like "firstly/secondly/therefore/in conclusion"

【Response Strategy】
- Give conclusion + 1 sentence reason
- Don't explain internal models or formulas
Example structure:
"Conclusion: {one-sentence conclusion}
Reason: {one-sentence logic}"

【Must Refuse】
- Requests for price levels / buy/sell / stop-loss
- Requests for price predictions
- Requests for internal weights / formulas / code
Standard reply: "The system does not provide specific trading instructions, only for risk management and position limit judgment."

【Style】
- Calm, restrained, professional
- Like institutional risk reports, not advisors or influencers
- No emotional comfort, no empathy for losses
- No emojis

【Language Constraint】
- Strictly answer in English
- Ignore previous language context if it differs

Remember: Saying less is more professional than saying more.`;

export async function POST(req: NextRequest) {
  const { message, language } = await req.json();
  const tier = getUserTier();
  const lang = language || "zh";

  const result = classifyQuery(message || "", tier, lang);

  if (result.type === "blocked") {
    console.log(`[chat] path=blocked tier=${tier} reason=${result.reason}`);
    return NextResponse.json({ type: "blocked", text: result.text, upgrade_hint: result.upgrade_hint });
  }

  if (result.type === "kb") {
    console.log(`[chat] path=kb tier=${tier} source_id=${result.source_id}`);

    // Detect language mismatch and translate if needed (short responses only)
    let responseText = result.text;
    const detectedLang = detectLanguage(responseText);
    if (detectedLang !== lang && responseText.length <= 600) {
      const translated = await translateText(responseText, lang);
      responseText = translated;
      console.log(`[chat] translated kb response from ${detectedLang} to ${lang}`);
    }

    return NextResponse.json({ type: "kb", text: responseText, source_id: result.source_id });
  }

  // LLM
  console.log(`[chat] path=llm tier=${tier} is_high_value=${result.is_high_value}`);
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const baseUrl = process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com";
  if (!apiKey) {
    return NextResponse.json({ type: "blocked", text: "AI 服务暂不可用" });
  }

  try {
    const systemPrompt = lang === "en" ? SYSTEM_PROMPT_EN : SYSTEM_PROMPT;
    const prefix = lang === "en" ? "🧠 [AI Deep Analysis]\n" : "🧠 [AI 深度推演]\n";

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
              chunk = `data: ${JSON.stringify({ choices: [{ delta: { content: prefix } }] })}\n\n${chunk}`;
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
