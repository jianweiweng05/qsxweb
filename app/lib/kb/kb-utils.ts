/**
 * KB (Knowledge Base) Utilities
 *
 * Centralized utilities for loading and matching knowledge base entries.
 * Used by chat API and test files to avoid duplication.
 *
 * Note: UI help files (indicator_help.json, alert_indicators.json) are managed
 * separately in manifest.json under "ui_help_files". They use different structures
 * and are loaded directly by UI components (e.g., help-modal.tsx).
 */

import manifest from "./manifest.json";

// ============================================================================
// Core KB Types
// ============================================================================

/**
 * Core KB item structure
 * All KB entries follow this base structure with optional additional fields
 */
export type KBItem = {
  // Required fields
  id: string;
  triggers: string[];
  a: string | KBAnswer;

  // Optional fields (present in some KB files)
  q?: string;
  cat?: string;
  tier?: string;
  scope?: string[];
  related?: string[];

  // Additional fields for specific KB types
  [key: string]: any;
};

/**
 * KB answer can be either a simple string or a structured object
 */
export type KBAnswer = {
  one_liner?: string;
  what?: string;
  how?: string[];
  pitfall?: string[];
  [key: string]: any;
};

/**
 * KB file structure - supports multiple entry key names
 */
export type KBFile = {
  version?: string;
  language?: string;
  system_name?: string;
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
// UI Help File Types
// ============================================================================

/**
 * Indicator help item (from indicator_help.json)
 */
export type IndicatorHelpItem = {
  id: string;
  title: string;
  one_liner: string;
  how_to_read: string;
  notes: string[];
};

/**
 * Indicator help file structure
 */
export type IndicatorHelpFile = {
  version: string;
  language: string;
  type: string;
  entries: IndicatorHelpItem[];
};

/**
 * Alert indicator item (from alert_indicators.json)
 */
export type AlertIndicatorItem = {
  id?: string;
  code?: string;
  title: string;
  short: string;
  what_it_means: string;
  what_can_happen: string[];
  recommended_actions: string[];
  caveats?: string[];
  tags: string[];
};

/**
 * Alert indicators file structure
 */
export type AlertIndicatorsFile = {
  version: string;
  language: string;
  updated_at: string;
  ui: {
    max_detail_chars: number;
    default_disclaimer: string;
  };
  threshold_indicators: AlertIndicatorItem[];
  composite_events: AlertIndicatorItem[];
};

// ============================================================================
// Manifest Types
// ============================================================================

/**
 * Manifest configuration structure
 */
export type ManifestConfig = {
  kb_files: string[];
  ui_help_files?: string[];
  match_policy: {
    priority_order: string[];
  };
  pro_config: {
    pro_keywords: string[];
  };
  vip_config?: {
    [key: string]: any;
  };
  llm_config?: {
    [key: string]: any;
  };
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
 *
 * @returns Map of category name to KB items
 * @throws Error if any KB file fails to load or has invalid structure
 *
 * @example
 * const kbFiles = loadKB();
 * const constitutionItems = kbFiles.constitution;
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
        throw new Error(`No valid entries found in ${fname}`);
      }

      if (!Array.isArray(entries)) {
        throw new Error(`Entries in ${fname} must be an array, got ${typeof entries}`);
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
      const errorMsg = e instanceof Error ? e.message : String(e);
      throw new Error(`Failed to load KB file ${fname}: ${errorMsg}`);
    }
  }

  return result;
}

// ============================================================================
// Text Processing
// ============================================================================

/**
 * Normalize text for matching
 *
 * Converts to lowercase, removes spaces and Chinese punctuation
 * to enable consistent trigger matching
 *
 * @param s Input string
 * @returns Normalized string
 *
 * @example
 * normalize("你好，世界！") // "你好世界"
 */
export function normalize(s: string): string {
  return s.toLowerCase().replace(/\s+/g, "").replace(/[，。？！、：；""'']/g, "");
}

/**
 * Format KB answer for display
 *
 * Handles both string and structured object answer formats
 *
 * @param a Answer (string or object)
 * @returns Formatted string
 */
export function formatAnswer(a: string | KBAnswer): string {
  if (typeof a === 'string') return a;
  const obj = a as any;
  if (obj.one_liner) return obj.one_liner;
  if (obj.what) return obj.what;
  return JSON.stringify(a);
}

/**
 * Validate input query
 *
 * Rejects queries that are:
 * - Too short (<2 chars) or too long (>200 chars)
 * - Pure numbers/symbols
 * - Repeated characters (e.g., "aaa", "😀😀😀")
 *
 * @param s Input string
 * @returns true if invalid, false if valid
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
 *
 * Uses two-pass matching strategy:
 * 1. Exact match: query equals trigger (case-insensitive)
 * 2. Contains match: trigger is substring of query
 *
 * Respects priority order from manifest.match_policy
 *
 * @param s Normalized query string
 * @param kbFiles Loaded KB files map
 * @returns Matching entry or null
 *
 * @example
 * const match = matchKB("为什么l1下跌", kbFiles);
 * if (match) console.log(match.id, match.a);
 */
export function matchKB(
  s: string,
  kbFiles: Record<string, KBItem[]>
): { id: string; a: string | KBAnswer } | null {
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
 *
 * Used for status-related queries (market conditions, system status, etc.)
 *
 * @param s Normalized query string
 * @param kbFiles Loaded KB files map
 * @returns Matching status entry or null
 */
export function matchStatusKB(
  s: string,
  kbFiles: Record<string, KBItem[]>
): { id: string; a: string | KBAnswer } | null {
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
 *
 * Detects common greeting phrases in Chinese and English
 *
 * @param s Normalized query string
 * @returns true if greeting detected
 */
export function isGreeting(s: string): boolean {
  return GREETING_WORDS.some(w => s.includes(w));
}

/**
 * Check if query has decision/judgement intent
 *
 * Detects queries asking for decisions or judgements about market conditions
 * Examples: "应该加仓吗", "现在是牛市吗", "怎么办"
 *
 * @param s Normalized query string
 * @returns true if decision/judgement intent detected
 */
export function isDecisionIntent(s: string): boolean {
  return DECISION_WORDS.some(w => s.includes(w)) ||
         JUDGEMENT_WORDS.some(w => s.includes(w));
}

/**
 * Check if query matches Pro-tier keywords
 *
 * Pro-tier keywords are restricted features only available to Pro subscribers
 *
 * @param s Normalized query string
 * @returns true if Pro keyword detected
 */
export function matchProKeyword(s: string): boolean {
  return manifest.pro_config.pro_keywords.some(k => s.includes(k.toLowerCase()));
}

/**
 * Check if query is eligible for LLM processing
 *
 * Uses two criteria:
 * 1. Decision-intent queries: ≥6 chars with decision/judgement words
 * 2. Technical queries: ≥12 chars with 2+ anchor words + 1+ logic word
 *
 * Rejects queries with 5+ anchors but no specific context (likely spam)
 *
 * @param s Normalized query string
 * @returns true if query should be sent to LLM
 *
 * @example
 * canUseLLM("为什么l1和l3背离") // true (logic + anchors + length)
 * canUseLLM("l1 l2 l3 l4 l5 l6") // false (too many anchors, no context)
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
