const manifest = require('./app/lib/kb/manifest.json');

function loadKB() {
  const result = {};
  for (const fname of manifest.kb_files) {
    const data = require(`./app/lib/kb/${fname}`);
    const entries = data.entries || data.constitution || data.rules || data.terms || data.status || data.templates || data.page_guides || data.subscription;
    if (!entries) throw new Error(`No valid entries in ${fname}`);
    const cat = fname.replace('.json', '');
    result[cat] = entries;
  }
  return result;
}

const KB_FILES = loadKB();

const GREETING_WORDS = ["你好", "在吗", "吃了吗", "hello", "hi", "嗨", "哈喽", "早", "晚上好", "下午好", "早上好"];
const LOGIC_WORDS = ["为什么", "背离", "关联", "导致", "影响", "原因", "逻辑", "意味", "暗示", "预示", "是否", "会不会", "如何", "怎么"];
const ANCHOR_WORDS = ["l1", "l2", "l3", "l4", "l5", "l6", "rr25", "gamma", "funding", "ls", "etf", "fgi", "hcri", "risk_cap", "coef", "macrocoef"];
const DECISION_WORDS = ["怎么办", "能不能", "要不要", "可以吗", "适合", "应该", "仓位", "风险", "短线", "波段", "观望", "昨天", "持续", "状态", "市场", "行情", "大跌", "加仓", "减仓", "满仓", "轻仓", "防守", "进攻"];
const JUDGEMENT_WORDS = ["偏多", "偏空", "牛市", "熊市", "震荡", "反弹", "下跌", "筑底", "情绪", "基本面", "顺势", "逆势", "成功率", "靠谱", "安全", "确定", "错误", "注意", "信号", "历史", "机构", "策略", "现货", "警惕", "问题", "类似"];

function normalize(s) {
  return s.toLowerCase().replace(/\s+/g, "").replace(/[，。？！、：；""'']/g, "");
}

function isInvalid(s) {
  if (s.length < 2 || s.length > 200) return true;
  if (/^[0-9\s\p{P}\p{S}]+$/u.test(s)) return true;
  const chars = [...s];
  const unique = new Set(chars).size;
  if (unique <= 2 && s.length >= 3) return true;
  return false;
}

function matchKB(s) {
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

function matchStatusKB(s) {
  for (const item of KB_FILES.status || []) {
    for (const t of item.triggers) {
      if (s.includes(t.toLowerCase())) {
        return { id: item.id, a: item.a };
      }
    }
  }
  return null;
}

function matchProKeyword(s) {
  return manifest.pro_config.pro_keywords.some(k => s.includes(k.toLowerCase()));
}

function isDecisionIntent(s) {
  return DECISION_WORDS.some(w => s.includes(w)) || JUDGEMENT_WORDS.some(w => s.includes(w));
}

function canUseLLM(s) {
  if (isDecisionIntent(s) && [...s].length >= 6) {
    return true;
  }
  const anchorCount = ANCHOR_WORDS.filter(w => s.includes(w)).length;
  const hasLogic = LOGIC_WORDS.some(w => s.includes(w));
  const charCount = [...s].length;
  if (anchorCount >= 5 && !s.match(/\d+|具体|当前|现在|如果/)) {
    return false;
  }
  return charCount >= 12 && anchorCount >= 2 && hasLogic;
}

function isGreeting(s) {
  return GREETING_WORDS.some(w => s.includes(w));
}

const MSG_GREETING = "你好！我是 QuantscopeX AI 助手。我能回答：市场状态/仓位规则/指标定义/页面功能。试试问：'RR25 是什么？'或'仓位规则'";
const MSG_INVALID = "请输入有效的市场问题（2-200字）。";

function classifyQuery(q, tier = "VIP") {
  const s = normalize(q);
  if (isInvalid(s)) return { type: "blocked", reason: "invalid", text: MSG_INVALID };
  if (isGreeting(s)) return { type: "blocked", reason: "greeting", text: MSG_GREETING };

  if (isDecisionIntent(s)) {
    const statusKb = matchStatusKB(s);
    if (statusKb) {
      return { type: "kb", text: statusKb.a, source_id: statusKb.id };
    }
  }

  const kb = matchKB(s);
  if (kb) {
    return { type: "kb", text: `💡 [系统百科]\n${kb.a}`, source_id: kb.id };
  }

  if (canUseLLM(s)) {
    if (tier === "FREE") {
      return { type: "blocked", reason: "upgrade", text: manifest.pro_config.intercept_message, upgrade_hint: true };
    }
    if (matchProKeyword(s) && tier !== "PRO") {
      return { type: "blocked", reason: "pro_only", text: manifest.pro_config.intercept_message, upgrade_hint: true };
    }
    return { type: "llm", is_high_value: true };
  }

  return {
    type: "blocked",
    reason: "no_match",
    text: "抱歉，我没有理解您的问题。\n\n您可以问我：\n• 指标定义：RR25 是什么？Funding 是什么？\n• 系统介绍：系统有什么优势？\n• 会员订阅：怎么开通会员？\n• 深度分析（VIP+）：为什么 L1 走强但 L3 费率下降？",
  };
}

const questions = [
  // 一、市场状态类（10 条）
  "现在市场状态是什么？",
  "今天整体风险大不大？",
  "现在还能不能参与市场？",
  "当前是偏多还是偏空？",
  "市场是在反弹还是在下跌中继？",
  "现在属于牛市、熊市还是震荡？",
  "和昨天相比，风险是在上升还是下降？",
  "当前适合观望还是入场？",
  "市场是在筑底还是继续走弱？",
  "现在是情绪驱动还是基本面驱动？",
  // 二、仓位控制类（10 条）
  "目前仓位应该怎么控制？",
  "建议总仓位控制在多少比较合适？",
  "现在适合满仓吗？",
  "所谓轻仓大概是多少？",
  "现在可以适当加仓吗？",
  "已经持有仓位的话要不要减仓？",
  "是做现货好，还是干脆空仓等待？",
  "如果仓位太高会不会有风险？",
  "已经有仓位了应该如何调整？",
  "目前更适合防守还是进攻？",
  // 三、风险感知类（10 条）
  "当前最大的风险是什么？",
  "现在最怕什么情况发生？",
  "有没有系统性风险在积累？",
  "短期内会不会突然大跌？",
  "有没有类似之前暴跌的风险信号？",
  "现在是不是一轮假反弹？",
  "这种行情最容易亏钱的地方在哪里？",
  "现在的风险主要来自哪个层面？",
  "有没有需要特别警惕的方向？",
  "如果出问题，最可能从哪里开始？",
  // 四、交易方式类（10 条）
  "现在适合做短线吗？",
  "是做波段好还是干脆不做？",
  "现在高风险策略还能用吗？",
  "现在更适合低频交易还是高频交易？",
  "顺势交易现在成功率高吗？",
  "逆势抄底现在靠谱吗？",
  "是等信号比较好还是主动试错？",
  "适合做突破策略吗？",
  "现在做交易最容易犯的错误是什么？",
  "如果一定要做，有哪些注意点？",
  // 五、追问验证类（10 条）
  "和昨天相比有变化吗？",
  "这种状态一般会持续多久？",
  "过去类似情况后面是怎么走的？",
  "现在的风险是短期还是中期？",
  "如果风险下降，通常会先出现什么变化？",
  "你现在的判断有多确定？",
  "如果我什么都不做，是不是更安全？",
  "现在更像历史上哪一类阶段？",
  "这种情况下，机构资金一般怎么操作？",
  "现在最合理的策略选择是什么？",
];

console.log("=" .repeat(80));
console.log("50 问题测试报告");
console.log("=" .repeat(80));

let results = [];
questions.forEach((q, i) => {
  const result = classifyQuery(q);
  results.push({ idx: i + 1, q, result });
});

// 输出详细结果
results.forEach(({ idx, q, result }) => {
  console.log(`\n【${idx}】${q}`);
  console.log(`路径: ${result.type}${result.source_id ? ` (${result.source_id})` : result.reason ? ` (${result.reason})` : ''}`);
  if (result.type === "kb") {
    console.log(`回答:\n${result.text}`);
  } else if (result.type === "llm") {
    console.log(`回答: [LLM 深度推演]`);
  } else {
    console.log(`回答: ${result.text.substring(0, 60)}...`);
  }
});

// 统计
console.log("\n" + "=" .repeat(80));
console.log("统计汇总");
console.log("=" .repeat(80));

const kbHits = results.filter(r => r.result.type === "kb");
const llmHits = results.filter(r => r.result.type === "llm");
const blocked = results.filter(r => r.result.type === "blocked");

console.log(`\nKB 命中: ${kbHits.length} 条`);
console.log(`LLM 放行: ${llmHits.length} 条`);
console.log(`被拦截: ${blocked.length} 条`);

if (blocked.length > 0) {
  console.log("\n被拦截的问题:");
  blocked.forEach(({ idx, q, result }) => {
    console.log(`  ${idx}. ${q} → ${result.reason}`);
  });
}

console.log("\n按 source_id 分布:");
const bySource = {};
kbHits.forEach(r => {
  const id = r.result.source_id;
  bySource[id] = (bySource[id] || 0) + 1;
});
Object.entries(bySource).sort((a, b) => b[1] - a[1]).forEach(([id, count]) => {
  console.log(`  ${id}: ${count} 条`);
});
