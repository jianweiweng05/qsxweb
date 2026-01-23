import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Lang = "zh" | "en";

const MAX_USER_CHARS = 6000;

function pickLang(req: Request, bodyLang?: any): Lang {
  const v = typeof bodyLang === "string" ? bodyLang.toLowerCase() : "";
  if (v === "zh" || v === "en") return v as Lang;

  const h = (req.headers.get("x-lang") || req.headers.get("accept-language") || "").toLowerCase();
  if (h.includes("zh")) return "zh";
  return "en";
}

function clampText(s: string, maxChars: number): string {
  if (!s) return "";
  const t = s.trim();
  if (t.length <= maxChars) return t;
  return t.slice(0, maxChars);
}

function buildSystemPrompt(lang: Lang): string {
  if (lang === "zh") {
    return [
      "你是 QuantScopeX 的 AI 分析助手。",
      "你必须全程使用中文输出，禁止夹杂英文（除非是代码/指标缩写/专有名词）。",
      "你只给结论与可执行要点，避免长篇解释。",
      "你不能提供具体的买卖点、杠杆倍数、具体下单指令；只能给风控/策略类型建议与条件。",
      "如果信息不足，先给保守结论与需要补充的关键字段清单。",
    ].join("\n");
  }

  return [
    "You are QuantScopeX AI analyst assistant.",
    "You MUST respond entirely in English. Do not mix languages (except code/tickers/indicator acronyms/proper nouns).",
    "Be concise and action-oriented. Avoid long explanations.",
    "Do NOT give specific buy/sell signals, leverage, or exact order instructions; only risk control and strategy-type guidance with conditions.",
    "If information is insufficient, give a conservative conclusion and list the key fields needed.",
  ].join("\n");
}

function toDeepSeekMessages(input: any, userText: string, systemPrompt: string) {
  const msgs: Array<{ role: "system" | "user" | "assistant"; content: string }> = [];
  msgs.push({ role: "system", content: systemPrompt });

  const history = Array.isArray(input?.messages) ? input.messages : [];
  for (const m of history) {
    const role = m?.role;
    const content = typeof m?.content === "string" ? m.content : "";
    if (!content) continue;
    if (role === "system") continue;
    if (role === "assistant" || role === "user") {
      msgs.push({ role, content: clampText(content, 2000) });
    }
  }

  if (userText) msgs.push({ role: "user", content: userText });
  return msgs;
}

export async function POST(req: Request) {
  let body: any = null;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }

  const lang = pickLang(req, body?.lang);

  const userTextRaw =
    (typeof body?.text === "string" && body.text) ||
    (typeof body?.prompt === "string" && body.prompt) ||
    "";

  const userText = clampText(userTextRaw, MAX_USER_CHARS);
  if (!userText) {
    return NextResponse.json({ error: "empty_prompt" }, { status: 400 });
  }

  const systemPrompt = buildSystemPrompt(lang);
  const messages = toDeepSeekMessages(body, userText, systemPrompt);

  const apiKey = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY || "";
  if (!apiKey) {
    return NextResponse.json({ error: "missing_api_key" }, { status: 500 });
  }

  const endpoint =
    process.env.DEEPSEEK_BASE_URL?.replace(/\/$/, "") ||
    "https://api.deepseek.com";

  const model = (typeof body?.model === "string" && body.model) || process.env.DEEPSEEK_MODEL || "deepseek-chat";

  const upstream = await fetch(`${endpoint}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.2,
      stream: true,
    }),
  });

  if (!upstream.ok || !upstream.body) {
    const text = await upstream.text().catch(() => "");
    return NextResponse.json(
      { error: "upstream_error", status: upstream.status, detail: text.slice(0, 500) },
      { status: 502 }
    );
  }

  return new NextResponse(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}