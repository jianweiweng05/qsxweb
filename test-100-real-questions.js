const manifest = require("./app/lib/kb/manifest.json");

const KB_FILES = {};
for (const fname of manifest.kb_files) {
  const data = require(`./app/lib/kb/${fname}`);
  const entries = data.entries || data.constitution || data.rules || data.terms || data.status || data.templates || data.page_guides || data.subscription;
  const cat = fname.replace('.json', '');

  // kb_p0_patch: merge entries into their target categories
  if (cat === 'kb_p0_patch') {
    for (const item of entries) {
      const targetCat = item.cat?.toLowerCase() || 'constitution';
      if (!KB_FILES[targetCat]) KB_FILES[targetCat] = [];
      KB_FILES[targetCat].push(item);
    }
  } else {
    KB_FILES[cat] = entries || [];
  }
}

const GREETING_WORDS = ["你好", "在吗", "吃了吗", "hello", "hi", "嗨", "哈喽", "早", "晚上好", "下午好", "早上好"];
const LOGIC_WORDS = ["为什么", "背离", "关联", "导致", "影响", "原因", "逻辑", "意味", "暗示", "预示", "是否", "会不会", "如何", "怎么"];
const ANCHOR_WORDS = ["l1", "l2", "l3", "l4", "l5", "l6", "rr25", "gamma", "funding", "ls", "etf", "fgi", "hcri", "risk_cap", "coef", "macrocoef"];
const DECISION_WORDS = ["怎么办", "能不能", "要不要", "可以吗", "适合", "应该", "仓位", "风险", "短线", "波段", "观望", "昨天", "持续", "状态", "市场", "行情", "大跌", "加仓", "减仓", "满仓", "轻仓", "防守", "进攻", "趋势", "区间", "危险", "顺风", "逆风", "交易", "纪律", "预期", "依据", "代价", "改善", "忍耐", "行动"];
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
        if (s === t.toLowerCase()) return { id: item.id, cat };
      }
    }
  }
  for (const cat of manifest.match_policy.priority_order) {
    const items = KB_FILES[cat] || [];
    for (const item of items) {
      for (const t of item.triggers) {
        if (s.includes(t.toLowerCase())) return { id: item.id, cat };
      }
    }
  }
  return null;
}

function matchStatusKB(s) {
  for (const item of KB_FILES.status || []) {
    for (const t of item.triggers) {
      if (s.includes(t.toLowerCase())) return { id: item.id, cat: 'status' };
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
  if (isDecisionIntent(s) && [...s].length >= 6) return true;
  const anchorCount = ANCHOR_WORDS.filter(w => s.includes(w)).length;
  const hasLogic = LOGIC_WORDS.some(w => s.includes(w));
  const charCount = [...s].length;
  if (anchorCount >= 5 && !s.match(/\d+|具体|当前|现在|如果/)) return false;
  return charCount >= 12 && anchorCount >= 2 && hasLogic;
}

function isGreeting(s) {
  return GREETING_WORDS.some(w => s.includes(w));
}

function classifyQuery(q, tier = "VIP") {
  const s = normalize(q);
  if (isInvalid(s)) return { type: "blocked", reason: "invalid" };
  if (isGreeting(s)) return { type: "blocked", reason: "greeting" };

  if (isDecisionIntent(s)) {
    const statusKb = matchStatusKB(s);
    if (statusKb) return { type: "kb", source: "status", id: statusKb.id };
  }

  const kb = matchKB(s);
  if (kb) return { type: "kb", source: kb.cat, id: kb.id };

  if (canUseLLM(s)) {
    if (tier === "FREE") return { type: "blocked", reason: "upgrade_vip" };
    if (matchProKeyword(s) && tier !== "PRO") return { type: "blocked", reason: "upgrade_pro" };
    return { type: "llm", tier };
  }

  return { type: "blocked", reason: "no_match" };
}

const questions = [
  // 1-15: 基础新手型
  "这个系统到底是干嘛的？",
  "能不能直接告诉我涨还是跌？",
  "你这个准不准？",
  "我是新手，用这个会不会更容易亏？",
  "我每天到底要看哪个页面？",
  "这么多指标，我只看一个行不行？",
  "为什么不直接告诉我买卖？",
  "这个跟普通技术指标有什么区别？",
  "看了半天还是不懂，是不是我太菜了？",
  "我不懂宏观，也能用吗？",
  "是不是每天都要盯着看？",
  "不看会不会错过机会？",
  "这个东西适合短线还是长线？",
  "你们是不是故意说得很复杂？",
  "我只想赚钱，这个到底有没有用？",

  // 16-35: 今天怎么办型
  "今天市场怎么样？",
  "现在风险高不高？",
  "今天适不适合进场？",
  "还能不能做多？",
  "现在是不是该减仓？",
  "要不要空仓观望？",
  "现在是机会还是风险？",
  "现在适合激进一点吗？",
  "可以做短线吗？",
  "适合做波段吗？",
  "现在是牛市还是熊市？",
  "是反弹还是反转？",
  "会不会突然大跌？",
  "有没有系统性风险？",
  "我是不是应该什么都不做？",
  "如果现在进场，风险大吗？",
  "现在更适合防守还是进攻？",
  "这种行情专业资金一般怎么做？",
  "现在最大的坑是什么？",
  "我最容易犯的错误是什么？",

  // 36-50: 仓位/Risk Cap
  "Risk Cap 是什么意思？",
  "Risk Cap 20% 是不是让我开 20%？",
  "Risk Cap 准不准？",
  "Risk Cap 会不会突然变？",
  "仓位应该怎么跟着它调？",
  "Risk Cap 高是不是就安全？",
  "Risk Cap 低是不是一定会跌？",
  "我个人风险偏好要怎么配合？",
  "满仓是不是一定不对？",
  "什么时候可以加仓？",
  "减仓是不是就等于看空？",
  "仓位调得太频繁会不会更亏？",
  "Risk Cap 和多空信号冲突怎么办？",
  "Risk Cap 跟市场状态哪个更重要？",
  "如果我不按 Risk Cap，会怎样？",

  // 51-65: 多空信号/AI解读
  "多空信号怎么看？",
  "多方信号多是不是就该做多？",
  "空方信号多是不是要做空？",
  "多空信号打架怎么办？",
  "为什么有时候信号很少？",
  "信号是不是滞后的？",
  "AI 解读到底靠不靠谱？",
  "AI 解读为什么这么保守？",
  "AI 解读和我看到的行情不一样？",
  "是不是 AI 不敢给结论？",
  "我能不能完全听 AI 的？",
  "AI 解读是不是每天都一样？",
  "AI 解读和 Risk Cap 冲突听谁的？",
  "为什么 AI 回答这么短？",
  "AI 能不能给更明确一点？",

  // 66-80: 报警/Pro功能
  "红色报警是什么意思？",
  "有报警是不是一定要减仓？",
  "报警是不是交易信号？",
  "报警多了是不是要清仓？",
  "为什么有报警但行情还在涨？",
  "报警消失了是不是安全了？",
  "历史报警有什么用？",
  "Gamma 状态到底怎么看？",
  "波动压制和波动释放有什么区别？",
  "Gamma 翻转是不是要出事了？",
  "工具箱是用来干嘛的？",
  "A/B/C 工具怎么选？",
  "工具箱是不是用来赚钱的？",
  "相似度 80% 是不是会复刻历史？",
  "你们这个 Pro 值不值？",

  // 81-90: 订阅/权限/投诉
  "Free / VIP / Pro 有什么区别？",
  "我该买 VIP 还是 Pro？",
  "为什么有些功能是灰的？",
  "我明明付费了怎么看不到？",
  "升级后多久生效？",
  "到期后会怎样？",
  "能不能退款？",
  "我觉得你们说得太保守了",
  "这东西是不是只适合大资金？",
  "我用了感觉没赚到钱，是不是没用？",

  // 91-100: 刁钻/专业/挑刺
  "你们的模型权重是怎么定的？",
  "能不能给我看看公式？",
  "为什么不公开参数？",
  "你们和某某机构的模型有什么区别？",
  "历史相似性有没有统计显著性？",
  "如果历史环境不同结果怎么办？",
  "系统失效的时候有什么特征？",
  "有没有回测证明？",
  "你们会不会为了卖订阅故意吓人？",
  "如果系统判断错了，责任谁承担？"
];

console.log("=== 100 题测试结果 ===\n");

const stats = {
  kb: 0,
  llm: 0,
  blocked_invalid: 0,
  blocked_greeting: 0,
  blocked_upgrade_vip: 0,
  blocked_upgrade_pro: 0,
  blocked_no_match: 0
};

const results = [];

questions.forEach((q, i) => {
  const result = classifyQuery(q, "VIP");
  stats[result.type === "blocked" ? `blocked_${result.reason}` : result.type]++;
  results.push({
    id: i + 1,
    q,
    type: result.type,
    reason: result.reason || result.source || result.tier,
    source_id: result.id
  });
});

console.log("【统计概览】");
console.log(`KB 命中: ${stats.kb} (${(stats.kb/100*100).toFixed(1)}%)`);
console.log(`LLM 触发: ${stats.llm} (${(stats.llm/100*100).toFixed(1)}%)`);
console.log(`拦截-无效: ${stats.blocked_invalid}`);
console.log(`拦截-问候: ${stats.blocked_greeting}`);
console.log(`拦截-需VIP: ${stats.blocked_upgrade_vip}`);
console.log(`拦截-需Pro: ${stats.blocked_upgrade_pro}`);
console.log(`拦截-无匹配: ${stats.blocked_no_match}`);
console.log(`\nKB 覆盖率: ${(stats.kb/100*100).toFixed(1)}%`);
console.log(`AI 使用率: ${(stats.llm/100*100).toFixed(1)}%`);
console.log(`有效拦截率: ${((stats.blocked_upgrade_vip + stats.blocked_upgrade_pro)/100*100).toFixed(1)}%`);
console.log(`无效拦截率: ${((stats.blocked_invalid + stats.blocked_greeting + stats.blocked_no_match)/100*100).toFixed(1)}%\n`);

console.log("【详细结果】");
results.forEach(r => {
  const tag = r.type === "kb" ? `[KB:${r.reason}]` :
              r.type === "llm" ? `[LLM:${r.reason}]` :
              `[拦截:${r.reason}]`;
  console.log(`${r.id}. ${tag} ${r.q}`);
  if (r.source_id) console.log(`   → ${r.source_id}`);
});

console.log("\n【问题分类】");
const kbQuestions = results.filter(r => r.type === "kb");
const llmQuestions = results.filter(r => r.type === "llm");
const blockedQuestions = results.filter(r => r.type === "blocked");

console.log(`\nKB 命中 (${kbQuestions.length}):`);
kbQuestions.forEach(r => console.log(`  ${r.id}. ${r.q}`));

console.log(`\nLLM 触发 (${llmQuestions.length}):`);
llmQuestions.forEach(r => console.log(`  ${r.id}. ${r.q}`));

console.log(`\n拦截 (${blockedQuestions.length}):`);
blockedQuestions.forEach(r => console.log(`  ${r.id}. [${r.reason}] ${r.q}`));
