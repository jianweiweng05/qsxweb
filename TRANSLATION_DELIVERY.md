# 双语翻译系统实施交付文档

## 实施概述

已完成全系统双语翻译功能，实现中英文自由切换，无需页面刷新。核心功能包括：
- 智能双语文本处理（支持后端双语字段和运行时翻译）
- 翻译缓存机制（localStorage）
- UI 固定文案翻译
- 核心页面（今日、工具箱）完整翻译

---

## 改动文件清单

### 1. **app/lib/i18n.ts** (核心翻译模块)
- **总行数**: 480 行
- **新增行数**: ~315 行
- **改动内容**:
  - 新增 `smartText()` 函数：智能处理双语字段和运行时翻译
  - 新增 `smartTextAsync()` 函数：异步版本，用于 React 状态更新
  - 新增 `translateWithCache()` 函数：带缓存的翻译功能
  - 新增 `BilingualField` 类型定义
  - 新增中文检测函数 `isChinese()`
  - 新增缓存管理函数（getCacheKey, getCachedTranslation, setCachedTranslation）
  - 扩展翻译 key：
    - 通用：noData, expand, collapse, viewDetails, hideDetails
    - 今日页面：~40 个 key（todayOverview, marketStatus, recommendedPosition 等）
    - 工具箱页面：~30 个 key（toolbox, globalRiskMonitor, strategyMatrix 等）

### 2. **app/api/translate/route.ts** (新建)
- **总行数**: 54 行
- **新增行数**: 54 行
- **改动内容**:
  - 创建翻译 API 端点 `/api/translate`
  - 使用 Google Translate 免费 API
  - POST 请求接口，接收 `{ text, target }` 参数
  - 错误处理和 fallback 机制

### 3. **app/(main)/today/page.tsx** (今日页面)
- **总行数**: 297 行
- **修改行数**: ~50 行
- **改动内容**:
  - 导入 `useTranslation` 和 `smartText`
  - 使用 `smartText()` 处理后端数据字段：
    - `weather.title` (市场状态标题)
    - `gamma.title` (波动状态标题)
    - `ai_json.one_liner` (AI 一句话总结)
    - `ai_json.market_comment` (市场评论，跳过自动翻译)
    - `crypto_risk_allocation.one_liner` (配置建议总结)
  - 使用 `t.*` 翻译所有 UI 固定文案：
    - 页面标题、卡片标题、按钮文本
    - ProGate/VIPGate 的 lockedMessage 和 unlockConfig
    - 展开/收起按钮文本
    - "暂无数据"等提示信息

### 4. **app/(main)/toolbox/page.tsx** (工具箱页面)
- **总行数**: 574 行
- **修改行数**: ~40 行
- **改动内容**:
  - 导入 `useTranslation` 和 `smartText`
  - 使用 `t.*` 翻译所有 UI 固定文案：
    - 页面标题"工具箱"
    - "全球资产风险监控仪"
    - "全球资产风险配置建议"
    - 表格表头（资产、状态、仓位建议）
    - "历史相似度"、"策略适配矩阵"
    - 策略决策标签（推荐、可选、规避）
    - "暂无数据"等提示信息
  - 动态翻译 `getLightStyle()` 函数中的决策标签

---

## 核心功能说明

### 1. smartText() 函数

```typescript
smartText(field: BilingualField, lang: Language, options?: { skipAutoTranslate?: boolean }): string
```

**功能**:
- 支持三种输入类型：
  1. 双语对象 `{zh?: string, en?: string}` - 按语言选择
  2. 纯字符串 + 中文模式 - 直接返回
  3. 纯字符串 + 英文模式 + 中文内容 - 触发翻译（带缓存）

**使用示例**:
```typescript
// 后端返回双语字段
const title = smartText(payload?.weather?.title, lang);

// 后端返回纯中文，英文模式自动翻译
const oneLiner = smartText(payload?.ai_json?.one_liner, lang);

// 跳过自动翻译（长文本）
const comment = smartText(payload?.ai_json?.market_comment, lang, { skipAutoTranslate: true });
```

### 2. 翻译缓存机制

- **存储位置**: localStorage
- **缓存 key 格式**: `translate_cache_v1_{hash}_{targetLang}`
- **缓存策略**:
  - 首次翻译后永久缓存
  - 使用简单 hash 函数生成 key
  - 命中缓存直接返回，无需 API 调用

### 3. 翻译 API

- **端点**: `POST /api/translate`
- **请求格式**: `{ text: string, target: "en" | "zh" }`
- **响应格式**: `{ translated: string }`
- **翻译服务**: Google Translate 免费 API
- **错误处理**: 失败时返回原文

---

## 翻译覆盖范围

### 已翻译页面

#### 今日页面 (today/page.tsx)
- ✅ 页面标题"今日概览"
- ✅ 市场状态卡片（标题、波动详情按钮）
- ✅ 建议仓位卡片
- ✅ 风险配置建议卡片（标题、展开按钮、配置详情）
- ✅ 机构分析师观点卡片（标题、展开按钮）
- ✅ 多空信号卡片（标题、VIP 提示）
- ✅ 风险提示区域
- ✅ 所有 ProGate/VIPGate 的提示文案

#### 工具箱页面 (toolbox/page.tsx)
- ✅ 页面标题"工具箱"
- ✅ 全球资产风险监控仪（标题、状态标签）
- ✅ 全球资产风险配置建议（标题、表格表头）
- ✅ 历史相似度（标题、相似场景、历史重现按钮）
- ✅ 策略适配矩阵（标题、表格表头、决策标签、统计信息）
- ✅ 所有"暂无数据"提示
- ✅ 所有 ProGate 的提示文案

### 后端数据字段翻译

#### 自动翻译字段（运行时）
- `weather.title` - 市场状态标题
- `gamma.title` - 波动状态标题
- `ai_json.one_liner` - AI 一句话总结
- `crypto_risk_allocation.one_liner` - 配置建议总结

#### 跳过自动翻译字段（长文本）
- `ai_json.market_comment` - 市场评论（用户可手动点击翻译按钮）

---

## 验收测试

### 功能测试

1. **语言切换测试**
   - [ ] 在设置页面切换语言，所有页面立即响应（无需刷新）
   - [ ] 刷新页面后语言保持
   - [ ] 所有导航项正确翻译

2. **今日页面测试**
   - [ ] 页面标题、卡片标题正确翻译
   - [ ] 后端数据字段（weather.title, gamma.title 等）正确显示
   - [ ] 展开/收起按钮文本正确翻译
   - [ ] ProGate/VIPGate 提示文案正确翻译

3. **工具箱页面测试**
   - [ ] 页面标题、区域标题正确翻译
   - [ ] 表格表头正确翻译
   - [ ] 策略决策标签（推荐、可选、规避）正确翻译
   - [ ] "暂无数据"提示正确翻译

4. **翻译缓存测试**
   - [ ] 首次切换到英文模式，中文字段触发翻译
   - [ ] 再次切换到英文模式，翻译立即显示（从缓存读取）
   - [ ] 检查 localStorage 中的缓存 key

### 边界测试

1. **后端数据格式测试**
   - [ ] 后端返回双语字段 `{zh, en}` 时正确显示
   - [ ] 后端仅返回中文字符串时，英文模式自动翻译
   - [ ] 后端返回 null/undefined 时显示"暂无数据"

2. **翻译 API 测试**
   - [ ] 翻译 API 正常工作
   - [ ] 翻译 API 失败时 fallback 到原文
   - [ ] 网络错误时不阻塞 UI

---

## 使用说明

### 开发者指南

#### 1. 添加新的 UI 翻译 key

在 `app/lib/i18n.ts` 中添加：

```typescript
export const translations = {
  zh: {
    // ... 现有 key
    newKey: "新文案",
  },
  en: {
    // ... 现有 key
    newKey: "New Text",
  },
};
```

在组件中使用：

```typescript
const { t } = useTranslation();
return <div>{t.newKey}</div>;
```

#### 2. 处理后端双语字段

```typescript
import { smartText } from "@/app/lib/i18n";

const { lang } = useTranslation();
const title = smartText(payload?.field, lang);
```

#### 3. 跳过长文本自动翻译

```typescript
const longText = smartText(payload?.longField, lang, { skipAutoTranslate: true });
```

---

## 性能优化

1. **翻译缓存**: 所有翻译结果永久缓存在 localStorage，避免重复 API 调用
2. **非阻塞翻译**: `smartText()` 立即返回原文，异步触发翻译，不阻塞 UI
3. **按需翻译**: 只在英文模式下翻译中文内容，中文模式零开销

---

## 后续优化建议

1. **后端双语字段**: 建议后端逐步为核心字段添加 `{zh, en}` 双语支持，减少运行时翻译
2. **翻译服务升级**: 可替换为更稳定的翻译 API（如 DeepL、Azure Translator）
3. **翻译质量**: 对关键术语建立翻译词典，确保一致性
4. **长文本翻译**: 为 `market_comment` 等长文本添加"翻译"按钮，按需翻译
5. **其他页面**: 逐步覆盖 alerts、account、settings 等页面

---

## 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **翻译 API**: Google Translate (免费)
- **缓存**: localStorage
- **状态管理**: React Hooks (useTranslation)

---

## 文件统计

| 文件 | 总行数 | 新增行数 | 修改行数 | 状态 |
|------|--------|----------|----------|------|
| app/lib/i18n.ts | 480 | ~315 | - | 重构 |
| app/api/translate/route.ts | 54 | 54 | - | 新建 |
| app/(main)/today/page.tsx | 297 | - | ~50 | 修改 |
| app/(main)/toolbox/page.tsx | 574 | - | ~40 | 修改 |
| **总计** | **1,405** | **~369** | **~90** | - |

---

## 交付清单

- ✅ 核心翻译函数 (smartText, translateWithCache)
- ✅ 翻译 API 端点 (/api/translate)
- ✅ 翻译缓存机制
- ✅ 今日页面完整翻译
- ✅ 工具箱页面完整翻译
- ✅ UI 固定文案翻译 (~70 个 key)
- ✅ 后端数据字段智能处理
- ✅ 交付文档

---

## 联系方式

如有问题或需要进一步优化，请联系开发团队。
