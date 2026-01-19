# 指标说明功能实现文档

## 功能概述

为所有关键指标/卡片添加了"点击解释"功能，用户点击 ⓘ 按钮后可查看详细说明。

## 实现内容

### 1. 本地说明字典文件

**文件位置**: `/app/lib/kb/indicator_help.json`

包含所有关键指标的说明，每个指标包含：
- `title`: 指标标题
- `one_liner`: 一句话说明
- `how_to_read`: 怎么读/如何理解
- `notes`: 注意事项（数组，最多4条）

**已添加的指标**:
- `market_weather`: 市场状态
- `risk_cap`: 建议仓位
- `gamma`: 波动状态
- `ai_analysis`: 机构分析师观点
- `bearish_signals`: 空方信号
- `bullish_signals`: 多方信号
- `cross_asset_rotation`: 跨资产轮动分析器
- `macro_summary`: 宏观结论
- `similarity_analysis`: 今日相似度
- `pro_strategy`: 今日策略指引
- `radar_chart`: 六维雷达
- `layer_L1` ~ `layer_L6`: 六个层级说明

### 2. HelpButton 组件升级

**文件位置**: `/app/(main)/toolbox/help-modal.tsx`

**主要改进**:
- 支持两种使用方式：
  1. 传入 `indicatorKey` 自动从字典加载内容
  2. 传入 `content` 自定义内容（向后兼容）
- PC 端：居中弹窗（`max-w-2xl`）
- 移动端：底部抽屉（`max-h-[85vh]`），带滑动动画
- 打开时锁定页面滚动
- 统一的 ⓘ 图标样式

**使用示例**:
```tsx
// 方式1：使用字典（推荐）
<HelpButton indicatorKey="risk_cap" />

// 方式2：自定义内容
<HelpButton content={<div>自定义说明</div>} />
```

### 3. 添加滑动动画

**文件位置**: `/app/globals.css`

添加了 `slide-up` 动画，用于移动端底部抽屉的滑入效果。

### 4. 已添加 ⓘ 按钮的页面

#### 今日概览页面 (`/app/(main)/today/page.tsx`)
- 市场状态
- 建议仓位
- 波动状态 (Gamma)
- 机构分析师观点
- 空方信号
- 多方信号

#### 工具箱页面 (`/app/(main)/toolbox/page.tsx`)
- 跨资产轮动分析器
- 宏观结论
- 今日相似度
- 今日策略指引

#### 数据中心页面 (`/app/(main)/radar/client.tsx`)
- 六维雷达
- L1~L6 各层级卡片

## 技术特点

1. **零依赖**: 使用现有 UI 组件体系，无需引入新依赖
2. **本地字典**: 所有说明存储在本地 JSON 文件，无网络请求
3. **响应式设计**: PC 和移动端有不同的展示方式
4. **性能优化**:
   - 使用 `useEffect` 管理滚动锁定
   - 点击遮罩层关闭弹窗
   - 移动端使用 CSS 动画提升体验
5. **向后兼容**: 保留了原有的 `content` 参数，不影响现有代码

## 移动端体验优化

- 底部抽屉设计，符合移动端操作习惯
- 顶部拖动条提示可关闭
- 最大高度 85vh，避免遮挡过多内容
- 滑入动画（0.3s ease-out）
- 点击遮罩或关闭按钮均可关闭
- 打开时锁定页面滚动，防止误操作

## 验收标准

✅ PC：点击任意指标标题旁 ⓘ，在原位弹出说明，不抖动不溢出
✅ 移动端：点击 ⓘ 出现底部抽屉，文字清晰、滚动顺畅
✅ 性能：页面加载不新增网络请求；交互无明显延迟
✅ 兼容性：保留原有 content 参数，不影响现有代码

## 后续扩展

如需添加新指标说明：
1. 在 `/app/lib/kb/indicator_help.json` 中添加新条目
2. 在对应页面添加 `<HelpButton indicatorKey="新指标key" />`

示例：
```json
{
  "new_indicator": {
    "title": "新指标名称",
    "one_liner": "一句话说明",
    "how_to_read": "如何理解这个指标",
    "notes": [
      "注意事项1",
      "注意事项2"
    ]
  }
}
```
