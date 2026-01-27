/**
 * KB (Knowledge Base) Utilities
 *
 * Centralized utilities for loading and matching knowledge base entries.
 * Used by chat API and test files to avoid duplication.
 */

import manifest from "./manifest.json";

// ============================================================================
// Types
// ============================================================================

export type KBItem = {
  id: string;
  triggers: string[];
  a: string | object;
  [key: string]: any; // Allow additional properties
};

export type KBFile = {
  entries?: KBItem[];
  constitution?: KBItem[];
  rules?: KBItem[];
  terms?: KBItem[];
  status?: KBItem[];
  templates?: KBItem[];
  page_guides?: KBItem[];
  subscription?: KBItem[];
};

// ============================================================================
// Keyword Lists
// ============================================================================

export const GREETING_WORDS = [
  "你好", "在吗", "吃了吗", "hello", "hi", "嗨", "哈喽",
  "早", "晚上好", "下午好", "早上好"
];

export const LOGIC_WORDS = [
  "为什么", "背离", "关联", "导致", "影响", "原因", "逻辑",
  "意味", "暗示", "预示", "是否", "会不会", "如何", "怎么"
];

export const ANCHOR_WORDS = [
  "l1", "l2", "l3", "l4", "l5", "l6", "rr25", "gamma", "funding",
  "ls", "etf", "fgi", "hcri", "risk_cap", "coef", "macrocoef"
];

export const DECISION_WORDS = [
  "怎么办", "能不能", "要不要", "可以吗", "适合", "应该", "仓位",
  "风险", "短线", "波段", "观望", "昨天", "持续", "状态", "市场",
  "行情", "大跌", "加仓", "减仓", "满仓", "轻仓", "防守", "进攻",
  "趋势", "区间", "危险", "顺风", "逆风", "交易", "纪律", "预期",
  "依据", "代价", "改善", "忍耐", "行动"
];

export const JUDGEMENT_WORDS = [
  "偏多", "偏空", "牛市", "熊市", "震荡", "反弹", "下跌", "筑底",
  "情绪", "基本面", "顺势", "逆势", "成功率", "靠谱", "安全", "确定",
  "错误", "注意", "信号", "历史", "机构", "策略", "现货", "警惕",
  "问题", "类似"
];

export const CONFIDENCE_WORDS = [
  "确定", "靠谱", "安全", "什么都不做", "不做"
];

// ============================================================================
// KB Loading
// ============================================================================

/**
 * Load all KB files specified in manifest.json
 * Returns a map of category name to KB items
 */
export function loadKB(): Record<string, KBItem[]> {
  const result: Record<string, KBItem[]> = {};

  for (const fname of manifest.kb_files) {
    try {
      const data: KBFile = require(`@/app/lib/kb/${fname}`);
      const entries =
        data.entries ||
        data.constitution ||
        data.rules ||
        data.terms ||
        data.status ||
        data.templates ||
        data.page_guides ||
        data.subscription;

      if (!entries) {
        throw new Error(`No valid entries in ${fname}`);
      }

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

// ============================================================================
// Text Processing
// ============================================================================

/**
 * Normalize text for matching: lowercase, remove spaces and punctuation
 */
export function normalize(s: string): string {
  return s.toLowerCase().replace(/\s+/g, "").replace(/[，。？！、：；""'']/g, "");
}

/**
 * Format KB answer (handle both string and object formats)
 */
export function formatAnswer(a: string | object): string {
  if (typeof a === 'string') return a;
  const obj = a as any;
  if (obj.one_liner) return obj.one_liner;
  if (obj.what) return obj.what;
  return JSON.stringify(a);
}

/**
 * Check if input is invalid (too short, too long, or nonsense)
 */
export function isInvalid(s: string): boolean {
  if (s.length < 2 || s.length > 200) return true;

  // Pure numbers/symbols
  if (/^[0-9\s\p{P}\p{S}]+$/u.test(s)) return true;

  // Repeated characters (e.g., aaa, 😀😀😀)
  const chars = [...s];
  const unique = new Set(chars).size;
  if (unique <= 2 && s.length >= 3) return true;

  return false;
}

// ============================================================================
// KB Matching
// ============================================================================

/**
 * Match query against KB entries
 * Returns the first matching entry or null
 */
export function matchKB(
  s: string,
  kbFiles: Record<string, KBItem[]>
): { id: string; a: string | object } | null {
  // First: exact match (complete word)
  for (const cat of manifest.match_policy.priority_order) {
    const items = kbFiles[cat] || [];
    for (const item of items) {
      for (const t of item.triggers) {
        if (s === t.toLowerCase()) {
          return { id: item.id, a: item.a };
        }
      }
    }
  }

  // Then: contains match
  for (const cat of manifest.match_policy.priority_order) {
    const items = kbFiles[cat] || [];
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

/**
 * Match query against status KB specifically
 */
export function matchStatusKB(
  s: string,
  kbFiles: Record<string, KBItem[]>
): { id: string; a: string | object } | null {
  for (const item of kbFiles.status || []) {
    for (const t of item.triggers) {
      if (s.includes(t.toLowerCase())) {
        return { id: item.id, a: item.a };
      }
    }
  }
  return null;
}

// ============================================================================
// Intent Detection
// ============================================================================

/**
 * Check if query is a greeting
 */
export function isGreeting(s: string): boolean {
  return GREETING_WORDS.some(w => s.includes(w));
}

/**
 * Check if query has decision/judgement intent
 */
export function isDecisionIntent(s: string): boolean {
  return DECISION_WORDS.some(w => s.includes(w)) ||
         JUDGEMENT_WORDS.some(w => s.includes(w));
}

/**
 * Check if query matches Pro-tier keywords
 */
export function matchProKeyword(s: string): boolean {
  return manifest.pro_config.pro_keywords.some(k => s.includes(k.toLowerCase()));
}

/**
 * Check if query is eligible for LLM processing
 */
export function canUseLLM(s: string): boolean {
  // Decision-intent queries: relaxed threshold (≥6 chars)
  if (isDecisionIntent(s) && [...s].length >= 6) {
    return true;
  }

  // Non-decision queries: strict threshold (2+ anchors + 1+ logic + 12+ chars)
  const anchorCount = ANCHOR_WORDS.filter(w => s.includes(w)).length;
  const hasLogic = LOGIC_WORDS.some(w => s.includes(w));
  const charCount = [...s].length;

  // Reject if too many anchors without context
  if (anchorCount >= 5 && !s.match(/\d+|具体|当前|现在|如果/)) {
    return false;
  }

  return charCount >= 12 && anchorCount >= 2 && hasLogic;
}
