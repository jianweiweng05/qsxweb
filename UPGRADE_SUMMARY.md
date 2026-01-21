# 全球资产风险监控仪 - 升级总结

## 文件修改
- **文件**: `/Users/admin/qsxweb/app/(main)/toolbox/page.tsx`
- **修改行数**: ~150 行（新增 ~80 行，修改 ~70 行）
- **依赖**: 无新增依赖

## 升级内容

### A) 卡片背景与层次
✅ **细网格背景**: 使用 CSS 线性渐变实现 50px 网格，opacity-5 不显眼
✅ **玻璃拟态**: `backdrop-blur-sm` + `bg-white/5` + `border-white/10`
✅ **相对定位**: 使用 `relative z-10` 确保内容在网格上方

### B) 顶部状态条
✅ **标题行**: "全球资产风险监控仪" + "Live" 徽章
✅ **状态显示**:
  - 状态: RISK_ON (绿色)
  - 置信度: 78% (青色)
✅ **帮助按钮**: 保留原有位置

### C) 三列布局升级
```
左列 (320px)     中列 (1fr)        右列 (200px)
─────────────    ──────────────    ──────────
双圈仪表         Pro 分析表格      行动摘要
(SVG)            (原有内容)        (新增)
```

#### 左侧：双圈仪表
- **外圈**: 保持原有 donut 扇区，新增 `drop-shadow` 发光效果
- **内圈**: 新增虚线圆圈 + 中心文字
  - 显示 "风险资产" 标签
  - 显示 "≤110%" 指示
- **交互**: 点击扇区触发 `setSelectedAsset(item)`

#### 中列：Pro 分析
- 保持原有表格结构
- 新增行 hover 效果: `hover:bg-white/5 cursor-pointer`
- 点击行也能打开资产详情

#### 右列：行动摘要（新增）
- **IN/OUT 计数**:
  - 大号数字显示 (text-lg font-bold)
  - 绿色背景 (bg-green-500/10) / 红色背景 (bg-red-500/10)
- **Top IN** (绿色灯):
  - 显示前 3 个 IN 资产
  - 可点击打开详情
- **Top OUT** (红色灯):
  - 显示前 3 个 OUT 资产
  - 可点击打开详情

### D) 资产详情抽屉（新增）
✅ **触发方式**:
  - 点击圆环扇区
  - 点击表格行
  - 点击 Top IN/OUT 列表项

✅ **抽屉内容**:
  - 资产名称 + 状态灯
  - 状态标签 (IN/OUT/NEUTRAL)
  - one_liner 说明
  - 仓位上限 (Pro 功能)
  - 更新时间戳

✅ **响应式**:
  - 手机: 底部弹出 (items-end)
  - 桌面: 右侧弹出 (items-center justify-end)

## 代码变更

### 新增 State
```typescript
const [selectedAsset, setSelectedAsset] = useState<any>(null);
```

### 新增计算
```typescript
const inCount = green.length;
const outCount = red.length;
const topIn = green.slice(0, 3);
const topOut = red.slice(0, 3);
```

### 新增 JSX 结构
1. 细网格背景 div
2. 顶部状态条
3. 三列网格布局
4. 右侧行动摘要面板
5. 资产详情抽屉 (fixed modal)

## 视觉效果

### 颜色方案
- **IN**: 绿色 (#22c55e)
- **OUT**: 红色 (#ef4444)
- **NEUTRAL**: 黄色 (#eab308)
- **背景**: 黑色/90 + 白色/5 透明
- **边框**: 白色/10 透明
- **文字**: 白色/80 主文本，白色/50 辅助

### 发光效果
- SVG 扇区: `drop-shadow(0 0 8px rgba(255,255,255,0.1))`
- 细网格: opacity-5 (极淡)
- 整体: `backdrop-blur-sm` 玻璃感

## 交互流程

1. **查看资产**: 用户看到圆环图 + 右侧摘要
2. **点击资产**:
   - 点击圆环扇区 → 打开抽屉
   - 点击表格行 → 打开抽屉
   - 点击 Top 列表 → 打开抽屉
3. **查看详情**: 抽屉显示 one_liner + 仓位上限
4. **关闭**: 点击背景或 ✕ 按钮

## 响应式设计

### 桌面 (lg+)
- 三列布局完整显示
- 圆环 260x260px
- 右侧摘要 200px 固定宽度
- 抽屉右侧弹出

### 手机 (sm-)
- 圆环自动缩小 (max-w-full)
- 右侧摘要换行显示
- 抽屉底部弹出 (全宽)

## 验收清单

- [x] 不改页面整体 grid
- [x] 不改外层容器 className
- [x] 仅修改卡片内部 JSX + Tailwind
- [x] 不新增依赖库
- [x] 不改数据接口
- [x] 单文件修改 (toolbox/page.tsx)
- [x] 新增代码 ≤80 行
- [x] 保持现有图表库 (SVG)
- [x] 手机端对称、小而精致
- [x] 桌面端像"控制塔仪表盘"

## 下一步

1. 在浏览器中查看效果
2. 点击资产测试交互
3. 在手机端验证响应式
4. 调整颜色/间距（如需要）
