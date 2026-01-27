# Knowledge Base (KB) System Guide

## Overview

The Knowledge Base (KB) system is a centralized repository for storing and retrieving domain knowledge. It powers the chat API's ability to answer user queries by matching them against predefined entries.

**Key Features:**
- Centralized configuration via `manifest.json`
- Type-safe TypeScript interfaces
- Comprehensive validation and error handling
- Performance optimization through caching
- Support for multiple KB file formats

---

## Architecture

### File Structure

```
app/lib/kb/
├── kb-utils.ts              # Core utilities (loading, matching, validation)
├── manifest.json            # Central configuration
├── indicator_help.json      # UI help for indicators
├── alert_indicators.json    # Alert indicator definitions
├── constitution.json        # Constitutional/foundational KB entries
├── rules.json              # Rules and regulations
├── terms.json              # Terminology definitions
├── status.json             # Market/system status entries
├── templates.json          # Template entries
├── subscription.json       # Subscription-related entries
├── page_guides.json        # Page-specific guides
└── kb_p0_patch.json        # Patch entries (merged into target categories)
```

### Data Flow

```
User Query
    ↓
normalize() → isInvalid() → isGreeting() / isDecisionIntent()
    ↓
matchKB() / matchStatusKB() / canUseLLM()
    ↓
loadKB() → getCachedKB() → [Cache Hit] → Return cached data
                        ↓ [Cache Miss]
                    Load all KB files
                    Validate each file
                    Store in cache
                    Return data
    ↓
Return matching KB entry or null
```

---

## Adding New KB Entries

### Step 1: Choose the Right File

Determine which KB file your entry belongs to:

| File | Purpose | Example Entries |
|------|---------|-----------------|
| `constitution.json` | Foundational concepts | "What is L1?", "What is L2?" |
| `rules.json` | Rules and regulations | "Trading hours", "Position limits" |
| `terms.json` | Terminology | "APY", "TVL", "Slippage" |
| `status.json` | Market/system status | "Bull market", "System maintenance" |
| `templates.json` | Common response templates | "How to trade", "Risk management" |
| `subscription.json` | Subscription features | "Pro features", "VIP benefits" |
| `page_guides.json` | Page-specific help | "Dashboard guide", "Settings help" |
| `kb_p0_patch.json` | Patch/override entries | Entries that override others |

### Step 2: Create the Entry

Each KB entry must have this structure:

```json
{
  "id": "unique_identifier",
  "triggers": ["keyword1", "keyword2", "keyword3"],
  "a": "Answer text or structured answer object",
  "q": "Optional: Question text",
  "cat": "Optional: Category override",
  "tier": "Optional: Tier level (e.g., 'pro', 'vip')",
  "scope": ["Optional", "Array", "Of", "Scopes"],
  "related": ["Optional", "Related", "Entry", "IDs"]
}
```

**Field Descriptions:**

- **id** (required): Unique identifier for this entry. Use snake_case. Examples: `what_is_l1`, `trading_hours_rule`
- **triggers** (required): Array of keywords that trigger this entry. Include variations, synonyms, and common misspellings.
  - Example: `["l1", "layer 1", "一层", "第一层"]`
- **a** (required): The answer. Can be:
  - Simple string: `"L1 is Layer 1 of the blockchain"`
  - Structured object:
    ```json
    {
      "one_liner": "Brief answer",
      "what": "Detailed explanation",
      "how": ["Step 1", "Step 2", "Step 3"],
      "pitfall": ["Common mistake 1", "Common mistake 2"]
    }
    ```
- **q** (optional): The question this entry answers. Helps with documentation.
- **cat** (optional): Category override. Used in `kb_p0_patch.json` to specify target category.
- **tier** (optional): Access tier. Examples: `"pro"`, `"vip"`. Used for subscription-based filtering.
- **scope** (optional): Array of scopes where this entry applies. Examples: `["trading", "portfolio"]`
- **related** (optional): Array of related entry IDs for cross-referencing.

### Step 3: Add Triggers

Triggers are critical for matching. Include:

1. **Exact matches**: The exact term users might search for
   - Example: `"l1"`, `"layer 1"`

2. **Variations**: Different ways to express the same concept
   - Example: `"一层"` (Chinese), `"第一层"` (alternative Chinese)

3. **Synonyms**: Related terms
   - Example: `"ethereum layer 1"`, `"mainnet"`

4. **Common misspellings**: Typos users might make
   - Example: `"l1s"` (plural), `"L1"` (uppercase)

5. **Contextual phrases**: Phrases that include the concept
   - Example: `"why is l1 important"`, `"l1 vs l2"`

### Step 4: Example - Adding a New Entry

**File:** `constitution.json`

```json
{
  "version": "1.0.0",
  "entries": [
    {
      "id": "what_is_apy",
      "triggers": ["apy", "annual percentage yield", "年化收益率", "年化收益", "apy是什么"],
      "q": "What is APY?",
      "a": {
        "one_liner": "APY (Annual Percentage Yield) is the annual return on an investment, accounting for compound interest.",
        "what": "APY represents the total amount of interest earned on an investment over one year, including the effect of compounding. It's expressed as a percentage.",
        "how": [
          "1. Identify the interest rate and compounding frequency",
          "2. Use the formula: APY = (1 + r/n)^n - 1, where r is the annual rate and n is the compounding frequency",
          "3. Multiply by 100 to express as a percentage"
        ],
        "pitfall": [
          "Don't confuse APY with APR (Annual Percentage Rate) - APY includes compounding",
          "APY can vary based on market conditions and protocol changes"
        ]
      },
      "cat": "constitution",
      "related": ["what_is_apr", "compound_interest_explained"]
    }
  ]
}
```

---

## Modifying Configuration

### Updating manifest.json

The `manifest.json` file controls:

1. **KB Files to Load**
   ```json
   "kb_files": [
     "constitution.json",
     "rules.json",
     "terms.json",
     "status.json",
     "templates.json",
     "subscription.json",
     "kb_p0_patch.json"
   ]
   ```
   - Add new KB files here to include them in the system
   - Order doesn't matter for loading, but affects matching priority

2. **UI Help Files**
   ```json
   "ui_help_files": [
     "indicator_help.json",
     "alert_indicators.json"
   ]
   ```
   - These are loaded separately by UI components
   - Don't include in `kb_files`

3. **Matching Policy**
   ```json
   "match_policy": {
     "priority_order": ["constitution", "rules", "terms", "status", "templates", "subscription"]
   }
   ```
   - Defines the order in which KB categories are searched
   - Earlier categories have higher priority
   - If a match is found in a higher-priority category, lower-priority categories are skipped

4. **Pro Configuration**
   ```json
   "pro_config": {
     "pro_keywords": ["pro_feature_1", "pro_feature_2"]
   }
   ```
   - Keywords that require Pro subscription
   - Used by `matchProKeyword()` function

5. **LLM Configuration**
   ```json
   "llm_config": {
     "greeting_words": ["你好", "hi", "hello"],
     "logic_words": ["因为", "所以", "但是"],
     "decision_words": ["应该", "可以", "不能"],
     "judgement_words": ["好", "坏", "对", "错"],
     "confidence_words": ["肯定", "确定", "可能"],
     "anchor_words": ["首先", "其次", "最后"],
     "intent_words": ["查询", "帮助", "建议"]
   }
   ```
   - Word lists used for intent detection and LLM eligibility
   - Add new words to improve detection accuracy

### Adding a New KB File

1. **Create the file** in `app/lib/kb/` with proper structure:
   ```json
   {
     "version": "1.0.0",
     "entries": [
       { "id": "...", "triggers": [...], "a": "..." }
     ]
   }
   ```

2. **Add to manifest.json**:
   ```json
   "kb_files": [
     "constitution.json",
     "rules.json",
     "my_new_file.json"  // Add here
   ]
   ```

3. **Update priority order** if needed:
   ```json
   "match_policy": {
     "priority_order": ["constitution", "my_new_file", "rules", ...]
   }
   ```

4. **Clear cache** in development:
   ```typescript
   import { clearKBCache } from '@/app/lib/kb/kb-utils';
   clearKBCache();
   ```

---

## Using the KB System

### Basic Usage

```typescript
import { loadKB, matchKB, normalize, isInvalid } from '@/app/lib/kb/kb-utils';

// Load KB (cached after first call)
const kbFiles = loadKB();

// Normalize and validate user query
const userQuery = "为什么L1下跌";
if (isInvalid(userQuery)) {
  console.log("Invalid query");
  return;
}

const normalized = normalize(userQuery);

// Match against KB
const match = matchKB(normalized, kbFiles);
if (match) {
  console.log(`Found: ${match.id}`);
  console.log(`Answer: ${match.a}`);
} else {
  console.log("No match found");
}
```

### Advanced Usage

```typescript
import {
  loadKB,
  matchKB,
  matchStatusKB,
  isGreeting,
  isDecisionIntent,
  canUseLLM,
  matchProKeyword,
  normalize,
  formatAnswer,
  clearKBCache
} from '@/app/lib/kb/kb-utils';

const userQuery = "应该现在加仓吗";
const normalized = normalize(userQuery);

// Check intent
if (isGreeting(normalized)) {
  return "Hello! How can I help?";
}

if (isDecisionIntent(normalized)) {
  // Handle decision-making queries
  const kbFiles = loadKB();
  const match = matchKB(normalized, kbFiles);

  if (match) {
    return formatAnswer(match.a);
  }

  // If no KB match and query is eligible for LLM
  if (canUseLLM(normalized)) {
    return await callLLM(userQuery);
  }
}

// Check Pro keywords
if (matchProKeyword(normalized)) {
  if (!userIsPro) {
    return "This feature requires Pro subscription";
  }
}

// Clear cache when KB files are updated
clearKBCache();
```

---

## Validation and Error Handling

### Automatic Validation

All KB files are automatically validated when loaded:

```typescript
export function validateKBItem(item: any, fileName: string): asserts item is KBItem
export function validateKBFile(data: any, fileName: string): asserts data is KBFile
```

**Validation checks:**
- Required fields present: `id`, `triggers`, `a`
- Correct types: `id` is string, `triggers` is array, `a` is string or object
- Non-empty values: `id` is not empty, `triggers` array is not empty
- Valid structure: Each entry in `triggers` is a string

### Error Handling

If validation fails, a descriptive error is thrown:

```
Failed to load KB file constitution.json: Invalid KB item in constitution.json (id: what_is_l1): 'triggers' must be an array
```

**Common errors and fixes:**

| Error | Cause | Fix |
|-------|-------|-----|
| `'id' field` missing | Entry has no `id` | Add unique `id` to each entry |
| `'triggers' must be an array` | `triggers` is not an array | Change `"triggers": "l1"` to `"triggers": ["l1"]` |
| `'a' field` missing | Entry has no answer | Add `"a": "..."` to entry |
| `No valid entries found` | File has no `entries` key | Rename `"data"` to `"entries"` |
| `not an object` | File is not valid JSON | Check JSON syntax with a validator |

---

## Performance Optimization

### Caching Strategy

The KB system uses automatic caching to improve performance:

```typescript
// First call: Loads all KB files, validates, and caches
const kbFiles = loadKB();  // ~50-100ms

// Subsequent calls: Returns cached data instantly
const kbFiles = loadKB();  // ~1ms
```

**Cache invalidation:**
- Cache is automatically invalidated when `manifest.version` changes
- Manually clear cache with `clearKBCache()` during development

### Performance Tips

1. **Minimize KB file size**: Remove unused entries
2. **Use specific triggers**: More specific triggers match faster
3. **Organize by priority**: Put frequently-matched categories first in `match_policy.priority_order`
4. **Batch operations**: Load KB once and reuse the result
5. **Monitor cache hits**: In development, verify cache is working

---

## Maintenance and Updates

### Regular Maintenance Tasks

1. **Review unused entries** (monthly)
   - Identify entries that are never matched
   - Remove or consolidate them

2. **Update triggers** (as needed)
   - Add new keywords users are searching for
   - Remove outdated triggers

3. **Verify answers** (quarterly)
   - Ensure answers are still accurate
   - Update for policy/product changes

4. **Check for duplicates** (monthly)
   - Identify entries with overlapping triggers
   - Consolidate or clarify triggers

5. **Monitor errors** (weekly)
   - Check logs for validation errors
   - Fix malformed entries

### Version Management

Update `manifest.json` version when making changes:

```json
{
  "version": "1.0.1",  // Increment when KB changes
  "kb_files": [...]
}
```

**Versioning scheme:**
- `1.0.0` → `1.0.1`: Bug fixes, minor updates
- `1.0.0` → `1.1.0`: New features, new KB files
- `1.0.0` → `2.0.0`: Major restructuring, breaking changes

### Deployment Checklist

Before deploying KB changes:

- [ ] All entries have valid `id`, `triggers`, and `a` fields
- [ ] No duplicate `id` values across all KB files
- [ ] Triggers are specific and non-overlapping where possible
- [ ] Answers are accurate and up-to-date
- [ ] `manifest.json` version is incremented
- [ ] Cache is cleared in development environment
- [ ] TypeScript compilation passes without errors
- [ ] All tests pass

---

## Troubleshooting

### KB Entry Not Matching

**Problem:** User query doesn't match expected KB entry

**Diagnosis:**
1. Check if entry exists: Search for `id` in KB files
2. Verify triggers: Are they in the entry?
3. Test normalization: Does `normalize(userQuery)` match a trigger?
4. Check priority: Is the entry's category high enough in `match_policy.priority_order`?

**Solution:**
```typescript
import { normalize } from '@/app/lib/kb/kb-utils';

const userQuery = "为什么L1下跌";
const normalized = normalize(userQuery);
console.log("Normalized:", normalized);  // Debug output

// Add more specific triggers to the entry
// Or adjust match_policy priority
```

### Cache Not Updating

**Problem:** Changes to KB files don't take effect

**Solution:**
```typescript
import { clearKBCache } from '@/app/lib/kb/kb-utils';

// Clear cache after updating KB files
clearKBCache();

// Next loadKB() call will reload from files
const kbFiles = loadKB();
```

### Validation Errors

**Problem:** Error when loading KB files

**Solution:**
1. Check JSON syntax: Use a JSON validator
2. Verify required fields: `id`, `triggers`, `a`
3. Check field types: `triggers` must be array, `a` must be string or object
4. Look at error message: It includes the file name and entry index

---

## API Reference

### Core Functions

#### `loadKB(): Record<string, KBItem[]>`
Load all KB files from manifest. Uses caching for performance.

#### `matchKB(s: string, kbFiles: Record<string, KBItem[]>): Match | null`
Match normalized query against KB entries using two-pass strategy (exact match, then contains match).

#### `matchStatusKB(s: string, kbFiles: Record<string, KBItem[]>): Match | null`
Match query specifically against status KB entries.

#### `normalize(s: string): string`
Normalize text for matching: lowercase, remove spaces and punctuation.

#### `formatAnswer(a: string | KBAnswer): string`
Format KB answer for display, handling both string and structured object formats.

#### `isInvalid(s: string): boolean`
Validate input query. Returns true if query is too short/long, pure numbers/symbols, or repeated characters.

#### `isGreeting(s: string): boolean`
Detect if query is a greeting.

#### `isDecisionIntent(s: string): boolean`
Detect if query is asking for a decision or judgment.

#### `canUseLLM(s: string): boolean`
Determine if query is eligible for LLM processing based on length, keywords, and structure.

#### `matchProKeyword(s: string): boolean`
Check if query matches Pro-tier restricted keywords.

#### `getCachedKB(): Record<string, KBItem[]> | null`
Get cached KB data if available and valid.

#### `clearKBCache(): void`
Clear KB cache. Use when KB files are updated.

### Types

#### `KBItem`
```typescript
type KBItem = {
  id: string;
  triggers: string[];
  a: string | KBAnswer;
  q?: string;
  cat?: string;
  tier?: string;
  scope?: string[];
  related?: string[];
  [key: string]: any;
};
```

#### `KBAnswer`
```typescript
type KBAnswer = {
  one_liner?: string;
  what?: string;
  how?: string[];
  pitfall?: string[];
  [key: string]: any;
};
```

#### `ManifestConfig`
```typescript
type ManifestConfig = {
  kb_files: string[];
  ui_help_files?: string[];
  match_policy: {
    priority_order: string[];
  };
  pro_config: {
    pro_keywords: string[];
  };
  llm_config?: {
    greeting_words: string[];
    logic_words: string[];
    decision_words: string[];
    judgement_words: string[];
    confidence_words: string[];
    anchor_words: string[];
    intent_words: string[];
  };
};
```

---

## Best Practices

1. **Use descriptive IDs**: `what_is_apy` is better than `entry_123`
2. **Include variations**: Add Chinese, English, and common misspellings
3. **Keep answers concise**: One-liners for quick answers, structured objects for detailed explanations
4. **Test before deploying**: Verify new entries match expected queries
5. **Document changes**: Update this guide when adding new features
6. **Monitor performance**: Check cache hit rates and matching speed
7. **Version your changes**: Increment manifest version with each update
8. **Backup KB files**: Keep version control history of all changes

---

## FAQ

**Q: How do I add a new KB file?**
A: Create a new JSON file in `app/lib/kb/`, add it to `manifest.json` under `kb_files`, and optionally update `match_policy.priority_order`.

**Q: Can I have duplicate triggers across different entries?**
A: Yes, but the first match (based on priority order) will be returned. Use `related` field to link related entries.

**Q: How do I update KB without restarting the server?**
A: Call `clearKBCache()` to invalidate the cache, then the next `loadKB()` call will reload from files.

**Q: What's the maximum KB size?**
A: No hard limit, but performance degrades with very large KB. Consider splitting into multiple files.

**Q: How do I test KB changes locally?**
A: Modify KB files, call `clearKBCache()`, and test with `loadKB()` and `matchKB()`.

---

## Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review error messages - they include file names and entry indices
3. Verify JSON syntax with a validator
4. Check manifest.json configuration
5. Review this guide for best practices
