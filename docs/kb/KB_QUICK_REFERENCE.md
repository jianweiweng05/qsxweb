# KB System - Quick Reference

## Quick Start

### Load KB and Match Query

```typescript
import { loadKB, matchKB, normalize } from '@/app/lib/kb/kb-utils';

const kbFiles = loadKB();
const match = matchKB(normalize("为什么L1下跌"), kbFiles);
if (match) console.log(match.a);
```

## Common Tasks

### Add New Entry

1. Open the appropriate KB file (e.g., `constitution.json`)
2. Add entry to `entries` array:
```json
{
  "id": "unique_id",
  "triggers": ["keyword1", "keyword2"],
  "a": "Answer text"
}
```
3. Clear cache: `clearKBCache()`

### Update Triggers

Edit the `triggers` array in the entry:
```json
"triggers": ["old_keyword", "new_keyword", "synonym"]
```

### Add Structured Answer

Replace simple string with object:
```json
"a": {
  "one_liner": "Brief answer",
  "what": "Detailed explanation",
  "how": ["Step 1", "Step 2"],
  "pitfall": ["Common mistake"]
}
```

### Add Pro-Only Entry

1. Add keyword to `manifest.json`:
```json
"pro_config": {
  "pro_keywords": ["existing_keyword", "new_pro_feature"]
}
```

2. Create entry with that keyword in triggers:
```json
{
  "id": "pro_feature_entry",
  "triggers": ["new_pro_feature"],
  "a": "Pro feature answer"
}
```

### Create New KB File

1. Create `app/lib/kb/my_file.json`:
```json
{
  "version": "1.0.0",
  "entries": [
    { "id": "entry1", "triggers": ["t1"], "a": "answer1" }
  ]
}
```

2. Add to `manifest.json`:
```json
"kb_files": ["constitution.json", "my_file.json"]
```

3. Update priority if needed:
```json
"match_policy": {
  "priority_order": ["my_file", "constitution", ...]
}
```

## Function Reference

| Function | Purpose | Example |
|----------|---------|---------|
| `loadKB()` | Load all KB files (cached) | `const kb = loadKB()` |
| `matchKB(s, kb)` | Find matching entry | `matchKB("l1", kb)` |
| `matchStatusKB(s, kb)` | Match status entries | `matchStatusKB("bull", kb)` |
| `normalize(s)` | Normalize text | `normalize("你好！")` |
| `formatAnswer(a)` | Format answer for display | `formatAnswer(match.a)` |
| `isInvalid(s)` | Check if query is invalid | `if (isInvalid(q)) return` |
| `isGreeting(s)` | Detect greeting | `if (isGreeting(q)) ...` |
| `isDecisionIntent(s)` | Detect decision query | `if (isDecisionIntent(q)) ...` |
| `canUseLLM(s)` | Check LLM eligibility | `if (canUseLLM(q)) callLLM()` |
| `matchProKeyword(s)` | Check Pro keyword | `if (matchProKeyword(q)) ...` |
| `clearKBCache()` | Clear cache | `clearKBCache()` |

## Entry Structure

```json
{
  "id": "unique_identifier",
  "triggers": ["keyword1", "keyword2"],
  "a": "Simple answer or structured object",
  "q": "Optional question",
  "cat": "Optional category",
  "tier": "Optional tier (pro, vip)",
  "scope": ["Optional", "scopes"],
  "related": ["Optional", "related_ids"]
}
```

## Manifest Structure

```json
{
  "version": "1.0.0",
  "kb_files": ["file1.json", "file2.json"],
  "match_policy": {
    "priority_order": ["category1", "category2"]
  },
  "pro_config": {
    "pro_keywords": ["pro_feature"]
  },
  "llm_config": {
    "greeting_words": ["你好", "hi"],
    "logic_words": ["因为", "所以"],
    "decision_words": ["应该", "可以"],
    "judgement_words": ["好", "坏"],
    "confidence_words": ["肯定", "可能"],
    "anchor_words": ["首先", "其次"],
    "intent_words": ["查询", "帮助"]
  }
}
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Entry not matching | Check triggers, verify normalization, check priority |
| Cache not updating | Call `clearKBCache()` |
| JSON error | Validate JSON syntax, check quotes and commas |
| Missing field error | Add required fields: `id`, `triggers`, `a` |
| Type error | Ensure `triggers` is array, `a` is string or object |

## Performance

- **First load**: ~50-100ms (loads and validates all files)
- **Cached load**: ~1ms (returns cached data)
- **Cache invalidation**: Automatic when manifest version changes
- **Manual clear**: `clearKBCache()`

## Files

- `kb-utils.ts` - Core utilities
- `manifest.json` - Configuration
- `constitution.json` - Foundational entries
- `rules.json` - Rules and regulations
- `terms.json` - Terminology
- `status.json` - Market/system status
- `templates.json` - Response templates
- `subscription.json` - Subscription features
- `page_guides.json` - Page guides
- `kb_p0_patch.json` - Patch entries
- `KB_GUIDE.md` - Full documentation
- `KB_QUICK_REFERENCE.md` - This file
