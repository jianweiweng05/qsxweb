/**
 * 最终压力测试：20个极高复杂度案例（修复后版本）
 */

import manifest from "./app/lib/kb/manifest.json";
import constitution from "./app/lib/kb/constitution.json";
import rules from "./app/lib/kb/rules.json";
import terms from "./app/lib/kb/terms.json";
import templates from "./app/lib/kb/templates.json";

type KBItem = { id: string; triggers: string[]; a: string };
const KB_FILES: Record<string, KBItem[]> = {
  constitution: constitution.constitution,
  rules: rules.rules,
  terms: terms.terms,
  templates: templates.templates,
};

const GREETING_WORDS = ["你好", "在吗", "吃了吗", "hello", "hi", "嗨", "哈喽", "早", "晚上好", "下午好", "早上好"];
const LOGIC_WORDS = ["为什么", "背离", "关联", "导致", "影响", "原因", "逻辑", "意味", "暗示", "预示", "是否", "会不会", "如何", "怎么"];
const ANCHOR_WORDS = ["l1", "l2", "l3", "l4", "l5", "l6", "rr25", "gamma", "funding", "ls", "etf", "fgi", "hcri", "risk_cap", "coef", "macrocoef"];

function normalize(s: string): string {
  return s.toLowerCase().replace(/\s+/g, "").replace(/[，。？！、：；""'']/g, "");
}

function isInvalid(s: string): boolean {
  if (s.length < 2 || s.length > 200) return true;
  if (/^[0-9\s\p{P}\p{S}]+$/u.test(s)) return true;
  const chars = [...s];
  const unique = new Set(chars).size;
  if (unique <= 2 && s.length >= 3) return true;
  return false;
}

function matchKB(s: string): { id: string; a: string } | null {
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

function matchProKeyword(s: string): boolean {
  return manifest.pro_config.pro_keywords.some(k => s.includes(k.toLowerCase()));
}

function canUseLLM(s: string): boolean {
  const anchorCount = ANCHOR_WORDS.filter(w => s.includes(w)).length;
  const hasLogic = LOGIC_WORDS.some(w => s.includes(w));
  const charCount = [...s].length;

  // Quality check: reject queries with 5+ indicators but no specific context
  if (anchorCount >= 5 && !s.match(/\d+|具体|当前|现在|如果/)) {
    return false;
  }

  return charCount >= 12 && anchorCount >= 2 && hasLogic;
}

function isGreeting(s: string): boolean {
  return GREETING_WORDS.some(w => s.includes(w));
}

type ClassifyResult =
  | { type: "blocked"; reason: string }
  | { type: "kb"; source_id: string }
  | { type: "llm"; is_high_value: boolean };

function classifyQuery(q: string, tier: "FREE" | "VIP" | "PRO"): ClassifyResult {
  const s = normalize(q);
  if (isInvalid(s)) return { type: "blocked", reason: "invalid" };
  if (isGreeting(s)) return { type: "blocked", reason: "greeting" };

  const meetsLLMCriteria = canUseLLM(s);
  
  if (meetsLLMCriteria) {
    if (tier === "FREE") {
      return { type: "blocked", reason: "upgrade" };
    }
    if (matchProKeyword(s) && tier !== "PRO") {
      return { type: "blocked", reason: "pro_only" };
    }
    return { type: "llm", is_high_value: true };
  }

  const kb = matchKB(s);
  if (kb) {
    return { type: "kb", source_id: kb.id };
  }

  if (tier === "FREE") {
    return { type: "blocked", reason: "upgrade" };
  }
  if (matchProKeyword(s) && tier !== "PRO") {
    return { type: "blocked", reason: "pro_only" };
  }
  return { type: "blocked", reason: "no_llm_match" };
}

type TestCase = {
  id: number;
  group: string;
  query: string;
  tier: "FREE" | "VIP" | "PRO";
  expected: "blocked" | "kb" | "llm";
  reason?: string;
};

const testCases: TestCase[] = [
  // A组：语义陷阱与黑话
  { id: 1, group: "A-语义陷阱", query: "现在盘面看起来要 V 反了，你们怎么看？", tier: "VIP", expected: "blocked", reason: "无指标锚点词" },
  { id: 2, group: "A-语义陷阱", query: "DXY 走势太强，对大饼（BTC）压力大吗？", tier: "VIP", expected: "blocked", reason: "有L1指标但无逻辑词" },
  { id: 3, group: "A-语义陷阱", query: "我已经亏了 50% 了，能不能给我个准话，底部在哪？", tier: "VIP", expected: "kb", reason: "应命中emotional_hedge" },
  { id: 4, group: "A-语义陷阱", query: "我不问点位，我就想知道你们内部权重是怎么给 L3 排序的。", tier: "VIP", expected: "kb", reason: "应命中non_decomposable_policy" },
  { id: 5, group: "A-语义陷阱", query: "你们的指标和 Glassnode 或者 Coinglass 比有什么优势？", tier: "VIP", expected: "kb", reason: "应命中advantage销售引导" },

  // B组：跨层级复杂逻辑
  { id: 6, group: "B-跨层级逻辑", query: "为什么 L1 的美元在跌，但 L2 的稳定币市值也在缩水？这矛盾吗？", tier: "VIP", expected: "llm", reason: "2指标+逻辑词+长度" },
  { id: 7, group: "B-跨层级逻辑", query: "如果 L3 的费率持续保持在 0.03% 以上，Risk Cap 应该调低到多少？", tier: "VIP", expected: "llm", reason: "L3+风控核心指标" },
  { id: 8, group: "B-跨层级逻辑", query: "你们 L2 显示 ETF 在买，但 asof 还是昨天的，现在的参考价值多大？", tier: "VIP", expected: "kb", reason: "应命中data_delay_asof" },
  { id: 9, group: "B-跨层级逻辑", query: "RR25 快速掉头向下，同时 Gamma 释放，这是否意味着多头挤兑风险？", tier: "VIP", expected: "llm", reason: "典型高手问题" },
  { id: 10, group: "B-跨层级逻辑", query: "CPI 数据利空时，L4 的筹码分布是否会下移到 60k 附近？", tier: "VIP", expected: "llm", reason: "L1宏观+L4链上" },

  // C组：恶意攻击与边界测试
  { id: 11, group: "C-边界测试", query: "L1 和 L3 为什么背离？？？！！！！！！！！！", tier: "VIP", expected: "llm", reason: "符号多但核心词在" },
  { id: 12, group: "C-边界测试", query: "L1, L3 为什么？", tier: "VIP", expected: "blocked", reason: "长度不满足12字" },
  { id: 13, group: "C-边界测试", query: "🚀🚀🚀📈📈📈🌕🌕🌕", tier: "VIP", expected: "blocked", reason: "纯表情包" },
  { id: 14, group: "C-边界测试", query: "我想知道由于什么原因导致了 L1 L2 L3 L4 L5 L6 的数据变化。", tier: "VIP", expected: "blocked", reason: "指标多但问题空洞" },
  { id: 15, group: "C-边界测试", query: "DROP TABLE users; 你们的 L1 L2 逻辑是什么？", tier: "VIP", expected: "llm", reason: "SQL注入但满足LLM条件" },

  // D组：转换与商业逻辑
  { id: 16, group: "D-商业逻辑", query: "不给我分析我就退款，告诉我怎么取消订阅！", tier: "VIP", expected: "kb", reason: "应识别sub_cancel" },
  { id: 17, group: "D-商业逻辑", query: "PRO 版本能看到比 VIP 更细的 L3 数据吗？", tier: "VIP", expected: "kb", reason: "应命中sub_upgrade" },
  { id: 18, group: "D-商业逻辑", query: "HCRI 显示现在的相似度是 90%，跟 21 年 5 月对比，那时候的 L3 状态如何？", tier: "PRO", expected: "llm", reason: "历史相似性对比" },
  { id: 19, group: "D-商业逻辑", query: "为什么L1和L3背离了啊", tier: "VIP", expected: "llm", reason: "临界点12字测试" },
  { id: 20, group: "D-商业逻辑", query: "MixPay 支付安全吗？会不会收了钱不给开通？", tier: "VIP", expected: "kb", reason: "支付安全FAQ" },
];

console.log("=".repeat(80));
console.log("🔥 最终压力测试：20个极高复杂度案例（修复后）");
console.log("=".repeat(80));
console.log();

let passCount = 0;
let failCount = 0;
const failures: { case: TestCase; actual: ClassifyResult }[] = [];

testCases.forEach(tc => {
  const result = classifyQuery(tc.query, tc.tier);
  const pass = result.type === tc.expected;
  
  if (pass) {
    passCount++;
    console.log(`✅ [${tc.id}] ${tc.group}`);
  } else {
    failCount++;
    console.log(`❌ [${tc.id}] ${tc.group}`);
    failures.push({ case: tc, actual: result });
  }
  
  console.log(`   Query: "${tc.query}"`);
  console.log(`   Expected: ${tc.expected} | Actual: ${result.type}`);
  if (tc.reason) console.log(`   Reason: ${tc.reason}`);
  console.log();
});

console.log("=".repeat(80));
console.log("📊 最终稳定性报告");
console.log("=".repeat(80));
console.log();

const totalTests = testCases.length;
const passRate = ((passCount / totalTests) * 100).toFixed(1);

console.log(`总测试数: ${totalTests}`);
console.log(`通过数: ${passCount}`);
console.log(`失败数: ${failCount}`);
console.log(`通过率: ${passRate}%`);
console.log();

const groupStats = testCases.reduce((acc, tc) => {
  if (!acc[tc.group]) acc[tc.group] = { total: 0, pass: 0 };
  acc[tc.group].total++;
  const result = classifyQuery(tc.query, tc.tier);
  if (result.type === tc.expected) acc[tc.group].pass++;
  return acc;
}, {} as Record<string, { total: number; pass: number }>);

console.log("分组统计:");
Object.entries(groupStats).forEach(([group, stats]) => {
  const rate = ((stats.pass / stats.total) * 100).toFixed(1);
  console.log(`  ${group}: ${stats.pass}/${stats.total} (${rate}%)`);
});
console.log();

if (failures.length > 0) {
  console.log("❌ 失败案例详情:");
  console.log("-".repeat(80));
  failures.forEach(({ case: tc, actual }) => {
    console.log(`[${tc.id}] ${tc.query}`);
    console.log(`  预期: ${tc.expected} | 实际: ${actual.type}`);
    if (actual.type === "blocked") console.log(`  拦截原因: ${actual.reason}`);
    if (actual.type === "kb") console.log(`  KB ID: ${actual.source_id}`);
    console.log();
  });
}

console.log("=".repeat(80));
console.log("🎯 关键指标");
console.log("=".repeat(80));

const llmCases = testCases.filter(tc => tc.expected === "llm");
const llmPass = llmCases.filter(tc => classifyQuery(tc.query, tc.tier).type === "llm").length;
const llmRate = ((llmPass / llmCases.length) * 100).toFixed(1);

const kbCases = testCases.filter(tc => tc.expected === "kb");
const kbPass = kbCases.filter(tc => classifyQuery(tc.query, tc.tier).type === "kb").length;
const kbRate = ((kbPass / kbCases.length) * 100).toFixed(1);

const blockedCases = testCases.filter(tc => tc.expected === "blocked");
const blockedPass = blockedCases.filter(tc => classifyQuery(tc.query, tc.tier).type === "blocked").length;
const blockedRate = ((blockedPass / blockedCases.length) * 100).toFixed(1);

console.log(`放行率 (LLM Pass Rate): ${llmPass}/${llmCases.length} (${llmRate}%) - 真正高级问题的命中率`);
console.log(`KB命中率 (KB Hit Rate): ${kbPass}/${kbCases.length} (${kbRate}%) - 知识库精准拦截率`);
console.log(`防御率 (Defense Rate): ${blockedPass}/${blockedCases.length} (${blockedRate}%) - 成功挡住垃圾/简单问题`);
console.log();

const falseNegatives = failures.filter(f => f.case.expected === "llm" && f.actual.type !== "llm");
const falsePositives = failures.filter(f => f.case.expected === "blocked" && f.actual.type === "llm");

console.log(`误杀率 (False Negative): ${falseNegatives.length}/${llmCases.length} - 应该走AI却被拦截`);
console.log(`误放率 (False Positive): ${falsePositives.length}/${blockedCases.length} - 应该拦截却放行AI`);
console.log();

console.log("=".repeat(80));
console.log(passRate === "100.0" ? "🎉 完美通过！系统逻辑已固化！" : "⚠️  存在失败案例，需要调整逻辑");
console.log("=".repeat(80));
