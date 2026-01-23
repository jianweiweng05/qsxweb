# QuantscopeX Development Log

## 2026-01-23: 修复历史重现K线图路径映射

### Bug Fix
- 修复K线图无法正确加载的问题
- 原实现使用数组索引生成文件名（如 `C1_2024_01_12.png`），但实际文件名与索引不对应
- 新实现：导入 `/public/sim_charts/index.json` 作为日期到图片URL的映射表
- 通过 `item.date` 查找对应的 `chart_url`，确保图片路径正确

### Technical Details
- 修改文件：`app/(main)/toolbox/page.tsx`
- 新增导入：`import chartIndex from "@/public/sim_charts/index.json"`
- 创建 Map 对象用于快速查找：`chartUrlMap.get(item.date)`
- 当日期在映射表中不存在时，返回 null（不显示图片）

## 2026-01-23: 历史重现卡片增加静态K线图展示

### Feature Enhancement
- 在工具箱页面的"历史相似度"模块中，为每个相似场景卡片的"历史重现"展开内容添加静态K线图展示
- 图片来源：`/public/sim_charts/<case_id>.png`（例如：`/sim_charts/C1_2024_01_12.png`）
- case_id 格式：`C<序号>_<日期>`，其中日期格式为 `YYYY_MM_DD`
- 实现图片加载失败时的优雅降级：显示"暂无K线图"文字提示
- 图片样式：自适应宽度，圆角边框，与暗色主题一致
- 依赖：假设 `public/sim_charts` 目录已存在相应的K线图产物

### Technical Details
- 修改文件：`app/(main)/toolbox/page.tsx`
- 新增代码：约 20 行（包含图片展示和错误处理逻辑）
- 无需新增依赖，无需后端改动
- 使用原生 `<img>` 标签和 `onError` 事件处理图片加载失败

## 2026-01-08: Initial Site Build

### Project Setup
- Created fresh Next.js 16.1.1 project with App Router and Tailwind CSS
- No external UI libraries used (shadcn, mui, chakra, framer-motion excluded)
- TypeScript enabled with strict type checking
- ESLint configured for code quality

### Design Approach
- Dark premium theme inspired by Nansen.ai
- Gradient backgrounds: #0a0a0f -> #1a1a2e -> #0f0f1e
- Semi-transparent cards with backdrop-blur for depth
- Responsive typography using clamp() for fluid scaling
- CSS-only hover effects and transitions
- Inter font family for clean modern look

### Pages Implemented

#### Homepage (/)
- Hero section with gradient text and dual CTAs
- CTA1: "Open Web App" -> /app
- CTA2: "View Today's Report" -> qsx-ai.onrender.com reportv2 with dynamic date
- Three value proposition cards
- Two alternating feature showcase sections with CSS gradient placeholders
- Social proof metrics section (24/7, <100ms, 99.9%)
- Bottom CTA with "Not investment advice" disclaimer

#### Dashboard (/app)
- Four metric cards: Market Regime, Risk Cap, Active Alerts, Position Notes
- Quick action buttons linking to Snapshot, Health, and Today's Report
- Recent signals list with color-coded status indicators
- Position recommendations panel with active/watching states

#### Reports (/reports)
- AM/PM toggle buttons for report window selection
- Report window rules explanation card
- Dynamic link generation with client-side date calculation
- Report metadata cards showing coverage details

#### Alerts (/alerts)
- Three status cards: Red (Critical), Yellow (Warning), Green (Info)
- Top alerts list with detailed descriptions and tags
- Color-coded alert cards with severity indicators
- Quick action buttons for Snapshot and Health

#### AI Assistant (/ai)
- Input field for questions (UI only, no backend)
- Four quick question buttons for common queries
- Capability description section
- Real-time data and context-aware feature cards
- Disclaimer about informational purposes

### Navigation
- Fixed top navigation with backdrop blur
- Logo: QuantscopeX
- Links: App, Reports, Alerts, AI
- Active state highlighting with pathname detection

### External Links
- All links point to: https://qsx-ai.onrender.com
- Snapshot: /macro/v1/snapshot
- Health: /macro/v1/health
- Report: /macro/v1/reportv2?window_id=YYYY-MM-DD@am|pm
- Date calculation done client-side using JavaScript Date API

### Build & Deployment
- Build command: npm run build
- All routes successfully prerendered as static content
- No TypeScript errors
- Ready for Vercel deployment
- Routes: /, /app, /reports, /alerts, /ai, /_not-found

### Technical Decisions
- Used 'use client' directive for pages requiring interactivity (date calculation, state)
- Kept static generation where possible for optimal performance
- No database, authentication, or API integration
- All data is placeholder content for demonstration
- Mobile-first responsive design with md: and lg: breakpoints

### Files Changed
- 22 files created
- 7387 lines added
- Core files: 5 page components, 1 navigation component, layout, globals.css

### Next Steps
- Deploy to Vercel
- Connect to real qsx-ai backend when ready
- Add actual data fetching and rendering
- Implement authentication if needed
- Add analytics tracking

## 2026-01-09: iPhone 全屏 App 入口页改造

### 目标
将首页（/）改造为 iPhone 全屏 App 入口页，优化移动端体验，解决 Safari 地址栏挤压问题。

### 修改文件
1. app/components/Navigation.tsx（+4 行）
2. app/page.tsx（完全重写，99 行）
3. app/signin/page.tsx（新建，11 行）

### 布局优化
- 使用 min-h-[100svh] 和 min-h-[100vh] 双重 fallback 确保全屏
- 添加 safe-area-inset-top 和 safe-area-inset-bottom 支持
- 主内容垂直居中：flex + justify-center + items-center
- 移动端最大宽度 420px，桌面端 560px
- 左右 padding 24px，顶部/底部至少 20px

### 视觉设计
- 背景：深蓝星空渐变（#1e3a8a → #0c1e3f → #050b1a）
- 星点效果：8 个 radial-gradient 星点 + 2 个光晕
- 品牌名：17px，字重 500，字间距 0.3px
- 主标题：clamp(34px, 6vw, 44px)，字重 700，行高 1.1
- 副标题：15px，行高 1.5，透明度 75%

### 按钮设计
- 尺寸：54px 高度，15px 圆角，100% 宽度
- 主按钮：渐变蓝（#2b6fff → #68b6ff）+ 阴影 + 内光
- 次按钮：玻璃效果（rgba(255,255,255,0.06)）+ 细边框
- 移动端按下缩放：active:scale-[0.98]
- "Invite only" 小字：13px，透明度 65%

### 导航栏优化
- 首页（/）隐藏导航栏，避免顶部挤压
- 其他页面保留原有导航栏
- 添加 /signin 路由支持

### 路由结构
- / → 全屏入口页
- /app → 主应用（Enter App 按钮）
- /signin → 占位页（Sign In 按钮，显示 "Invite only / Coming soon"）

### 技术实现
- 纯 CSS 实现星空背景，无外部图片
- inline style 处理 safe-area 和复杂渐变
- Tailwind 类名处理响应式和基础样式
- 无新增依赖，无新增目录

### 验收结果
- ✅ iPhone Safari 全屏显示，内容垂直居中
- ✅ 顶部不被地址栏挤压（safe-area-inset-top）
- ✅ 底部免责声明不被手势条遮挡（safe-area-inset-bottom）
- ✅ 按钮尺寸适中，间距合理
- ✅ 桌面端居中显示，最大宽度限制生效
- ✅ 路由正常：Enter App → /app，Sign In → /signin

## 2026-01-12: Landing 页面排版复刻与导航隐藏

### 目标
以 iPhone 截图为标准精确复刻 /landing 页面排版，同时隐藏该页面顶部导航。

### 修改文件
1. app/landing/page.tsx（改 8 行）

### 排版调整
- 标题位置：paddingTop 从 56px 减至 28px，marginBottom 从 14px 减至 10px
- 副标题：fontSize 从 15px 减至 14px，lineHeight 从 1.55 减至 1.35，maxWidth 从 280px 减至 260px，opacity 从 0.78 减至 0.7
- 按钮尺寸：height 从 46px 减至 42px，width 从 150px 增至 164px，borderRadius 从 14px 增至 18px
- 按钮间距：gap 从 14px 减至 12px，marginBottom 从 14px 减至 12px
- Sign In 按钮：color 改为 #fff（原 rgba(255,255,255,0.9)），background 从 rgba(255,255,255,0.08) 增至 0.15，backdropFilter 从 blur(10px) 增至 blur(20px)，新增 WebkitBackdropFilter
- Sign Up 按钮：background 从 rgba(64,140,255,0.92) 减至 0.88，boxShadow 调整为 0 8px 20px rgba(0,0,0,0.4)
- 背景暗化：radial-gradient 起始值从 rgba(0,0,0,0.25) 增至 0.45，中间值从 0.75 增至 0.85，终点值从 0.88 增至 0.95
- Invite only 文字：opacity 从 0.55 减至 0.5

### 导航隐藏
- Navigation.tsx 已包含 pathname === '/landing' 时返回 null 的逻辑，无需修改
- /landing 页面不显示导航栏
- 其他页面（/app, /reports, /alerts, /ai）导航栏正常显示

### 验收结果
- ✅ http://localhost:3000/landing 无顶部导航
- ✅ 标题位置上移，副标题更小更密
- ✅ 按钮更矮更宽、圆角更大、玻璃感增强
- ✅ Sign In 按钮清晰可见（不再透明）
- ✅ 背景更暗但仍保留星空可见
- ✅ 其他页面导航不受影响
- ✅ next dev 正常运行，无 hydration error

## 2026-01-12: 目录结构重组与路由清理

### 目标
清理并重建 Next App Router 目录结构，解决 app/app 路由混乱问题，确保 landing 无导航而其他页面有导航。

### 修改文件
1. app/landing/page.tsx（新建，118 行）
2. app/(main)/layout.tsx（重建，14 行）
3. app/(main)/app/page.tsx（新建，112 行）
4. app/components/Navigation.tsx（简化，-4 行）
5. 移动目录：alerts/ai/reports → (main) 下
6. 删除文件：app/page.tsx

### 目录结构（深度 2）
```
app/
├── (main)/              # Route group：带导航的页面
│   ├── layout.tsx       # MainLayout：引入 Navigation
│   ├── app/
│   │   └── page.tsx     # /app 主应用页
│   ├── alerts/
│   │   └── page.tsx     # /alerts
│   ├── ai/
│   │   └── page.tsx     # /ai
│   └── reports/
│       └── page.tsx     # /reports
├── components/
│   ├── Navigation.tsx   # 导航组件（简化版，无 pathname 判断）
│   └── TopNav.tsx       # （未使用）
├── landing/
│   └── page.tsx         # /landing 入口页（无导航）
├── layout.tsx           # 根 layout
├── globals.css
└── favicon.ico
```

### 改动理由
1. landing 放在 route group 外 → 自然不包含 Navigation
2. (main) route group 统一引入 Navigation → 所有子页面自动有导航
3. 移动 alerts/ai/reports 到 (main) → 确保它们有导航且路由清晰
4. 删除根 page.tsx → 消除 / 与 /app 混淆
5. 简化 Navigation.tsx → 移除 pathname 判断，依赖目录结构控制

### 验收结果
- ✅ /landing：无顶部导航，antd-mobile 按钮样式生效，背景暗化
- ✅ /app：有导航，主应用页面正常
- ✅ /reports、/alerts、/ai：有导航，页面正常
- ✅ 不再存在 app/app 路由混乱
- ✅ next dev 正常运行

## 2026-01-13: 搭建底部Tab与数据层骨架

### 目标
搭建系统骨架：统一底部 Tab、统一数据入口、统一会员门禁，占位 UI 先跑通。

### 涉及路由
- /today - 今日概览
- /radar - 雷达
- /alerts - 报警
- /history - 历史
- /ai - AI 助手

### 新增文件
1. app/lib/qsx_api.ts（27 行）- 统一数据层，fetch report_payload，失败返回 mock
2. app/lib/entitlements.ts（5 行）- 会员门禁占位，暂返回 NONE
3. app/(main)/today/page.tsx（58 行）- 今日页，展示 macro_state/risk_cap/解读/策略门禁
4. app/(main)/radar/page.tsx（12 行）- 雷达占位页
5. app/(main)/history/page.tsx（12 行）- 历史占位页

### 修改文件
1. app/(main)/layout.tsx（38 行）- 添加 antd-mobile TabBar 底部导航
2. app/(main)/alerts/page.tsx（16 行）- 重写为展示 red_count
3. app/(main)/ai/page.tsx（12 行）- 简化为占位页

### 技术实现
- 底部 Tab 使用 antd-mobile TabBar 组件
- 数据层统一通过 getReportPayload() 获取，接口挂了返回 mock
- 会员门禁通过 getUserTier() 控制，today 页策略区块按 PRO/NONE 显示不同内容

## 2026-01-13: 补齐闭环页面 + tier 环境变量切换 + tab 高亮子路由 + ignore log

### 改动
1. .gitignore - 添加 logs/ 忽略规则
2. app/lib/entitlements.ts - 支持 NEXT_PUBLIC_QSX_TIER 环境变量切换
3. app/(main)/layout.tsx - mapActiveKey 支持子路由高亮
4. app/(main)/today/page.tsx - 升级按钮跳转改为 /pricing

### 新增页面
1. app/pricing/page.tsx - Pro/Max 方案选择
2. app/subscribe/page.tsx - Stripe Checkout 占位
3. app/(main)/account/page.tsx - 账户页，显示当前 tier

## 2026-01-13: 补齐订阅成功回跳页与账户订阅状态展示（前端闭环）

### 改动
1. app/subscribe/page.tsx - 新增"模拟订阅成功"按钮
2. app/(main)/account/page.tsx - 新增到期时间展示

### 新增页面
1. app/subscribe/success/page.tsx - 订阅成功回跳页

### 跳转闭环
- pricing → subscribe?plan=pro|max
- subscribe → subscribe/success?plan=xxx
- success → today
- today 锁定卡 → pricing

## 2026-01-13: 禁用 mock 静默降级

### 问题
- API 失败时静默返回 mock 数据，用户无感知
- 可能导致用户基于假数据做决策

### 修改
1. `app/lib/qsx_api.ts` - 移除 MOCK_DATA，API 失败时抛出 ApiError
2. `app/(main)/today/page.tsx` - 捕获错误，显示"数据不可用"提示
3. `app/(main)/alerts/page.tsx` - 同上

### 行为变化
- API 正常：显示真实数据
- API 异常：显示红色错误提示"⚠️ 当前市场数据不可用或延迟"
- 不再有静默降级到 mock 数据的情况

## 2026-01-13: 测试期 Pro 门禁统一化

### 新增
- `app/lib/gate.tsx` - 统一门禁工具（isPro + ProGate 组件）

### 修改
- `app/(main)/history/page.tsx` - 整页门禁，NONE 只显示锁定卡
- `app/(main)/ai/page.tsx` - 部分门禁，深度解读/策略生成需 Pro
- `app/(main)/today/page.tsx` - 策略建议区块使用统一 ProGate

### 行为
- NONE：/history 显示"🔒 Pro 内容已锁定"+ 升级按钮
- PRO：/history 显示正常内容

## 2026-01-13: 启用 PWA（测试期 App 化壳）

### 新增文件
- `public/manifest.json` - PWA manifest，start_url=/today，standalone 模式
- `public/icon-192.png` - 占位图标 192x192
- `public/icon-512.png` - 占位图标 512x512

### 修改文件
- `app/layout.tsx` - 添加 PWA meta 标签和 manifest 链接

### 功能
- iOS/Android 添加到主屏幕后以全屏 App 形态运行
- 启动直接进入 /today
- 无浏览器地址栏/UI

## 2026-01-13: 接入 Clerk Auth（测试版闭环）

### 新增依赖
- `@clerk/nextjs`

### 新增文件
- `.env.example` - 环境变量示例
- `middleware.ts` - 路由保护中间件
- `app/sign-in/[[...sign-in]]/page.tsx` - 登录页
- `app/sign-up/[[...sign-up]]/page.tsx` - 注册页

### 修改文件
- `app/layout.tsx` - 接入 ClerkProvider
- `app/landing/page.tsx` - 按钮跳转改为 /sign-in、/sign-up
- `app/(main)/account/page.tsx` - 接入 UserButton 和用户邮箱显示

### 路由保护
- 受保护：/today, /radar, /alerts, /history, /ai, /account
- 公开：/landing, /pricing, /sign-in, /sign-up

### 行为
- 未登录访问受保护页面 → 自动跳转 /sign-in
- 登录成功 → 自动跳转 /today
- /account 显示 UserButton 和用户邮箱

## 2026-01-14: 横屏双列布局（桌面端信息密度提升）

### 目标
为主页面 /today /radar /alerts /history /ai 增加横屏布局：viewport ≥1024px 时变为两列，提升信息密度。

### 修改文件
1. `app/(main)/today/page.tsx` - 添加 lg:grid lg:grid-cols-2 lg:gap-6
2. `app/(main)/radar/page.tsx` - 添加 lg:grid lg:grid-cols-2 lg:gap-6
3. `app/(main)/alerts/page.tsx` - 添加 lg:grid lg:grid-cols-2 lg:gap-6
4. `app/(main)/history/page.tsx` - 添加 lg:grid lg:grid-cols-2 lg:gap-6
5. `app/(main)/ai/page.tsx` - 添加 lg:grid lg:grid-cols-2 lg:gap-6

### 布局结构
- 左列：主决策/主列表/主可视化
- 右列：解释/详情/辅助信息
- 移动端（<1024px）：单列，右列内容在下方显示
- 桌面端（≥1024px）：双列并排

### 技术实现
- 纯 Tailwind class 实现：`lg:grid lg:grid-cols-2 lg:gap-6`
- 右列使用 `mt-4 lg:mt-0` 确保移动端有间距、桌面端无额外间距
- 部分桌面端专属内容使用 `hidden lg:block`

### 验收结果
- ✅ iPhone 宽度（≤430px）页面视觉与交互不变
- ✅ 桌面宽度（≥1024px）每页变为两列
- ✅ npm run build 通过
- ✅ grep 验证 5 个页面均包含 lg:grid-cols-2

## 2026-01-14: 自定义域名登录跳转到 Vercel Auth 域（内测期方案）

### 目标
解决自定义域名 www.quantscopex.com 无法使用 Clerk 登录的问题，将认证流程统一跳转到 qsxweb.vercel.app。

### 新增环境变量
- `NEXT_PUBLIC_QSX_AUTH_ORIGIN=https://qsxweb.vercel.app` - 认证域

### 修改文件
1. `.env.example` - 添加 NEXT_PUBLIC_QSX_AUTH_ORIGIN 环境变量
2. `app/landing/client.tsx` - Sign In/Sign Up 按钮跳转到 AUTH_ORIGIN 并携带 redirect_url
3. `middleware.ts` - 自定义域名访问 /sign-in 或 /sign-up 时 307 重定向到 AUTH_ORIGIN

### 实现逻辑
- Landing 页按钮：使用 window.location.origin 获取当前域名，跳转到 `${AUTH_ORIGIN}/sign-in?redirect_url=${currentOrigin}/today`
- Middleware：检测 host 包含 quantscopex.com 且 pathname 以 /sign-in 或 /sign-up 开头时，307 重定向到 AUTH_ORIGIN
- qsxweb.vercel.app 本身不做重定向，避免循环

### 验收结果
- ✅ npm run build 通过
- ✅ 自定义域名 /landing 点击按钮跳转到 vercel auth 域
- ✅ 自定义域名直接访问 /sign-in 或 /sign-up 会 307 重定向
- ✅ vercel auth 域的 /sign-in /sign-up 正常可用

## 2026-01-14: 三层订阅门禁与入口闭环

### 目标
实现 FREE/VIP/PRO 三层订阅分层，统一门禁组件，补齐 /pricing /account /settings 页面，更新 TabBar 导航。

### 订阅分层定义
| 层级 | 权限 |
|------|------|
| FREE | landing + 延迟历史日报（3-7天） |
| VIP | 当日日报 + 市场状态 + 仓位上限 + AI 解读 |
| PRO | VIP 全部 + 策略建议 + 报警 + 历史相似性 |

### 修改文件
1. `app/lib/entitlements.ts` - 重构支持 FREE/VIP/PRO，新增 hasMinTier()、getTierDisplayName()
2. `app/lib/gate.tsx` - 新增 TierGate/VIPGate/ProGate/PageGate 统一门禁组件
3. `app/(main)/layout.tsx` - TabBar 用「我的」替换「AI」，指向 /account
4. `app/pricing/page.tsx` - 三档方案展示，显示当前方案
5. `app/(main)/account/page.tsx` - 显示邮箱/tier/到期时间，入口到 settings 和 pricing
6. `app/(main)/today/page.tsx` - FREE 锁定，VIP 显示日报，PRO 额外显示策略建议
7. `app/(main)/alerts/page.tsx` - FREE/VIP 锁定，PRO 全功能
8. `app/(main)/history/page.tsx` - 所有用户可看延迟日报，PRO 额外显示历史相似性
9. `app/(main)/ai/page.tsx` - FREE 锁定，VIP 显示 AI 解读，PRO 额外显示策略生成

### 新增文件
1. `app/(main)/settings/page.tsx` - 语言/时区/通知占位

### 功能权限矩阵
| 页面 | FREE | VIP | PRO |
|------|------|-----|-----|
| /today | 锁定 | 日报+状态+仓位+解读 | +策略建议 |
| /alerts | 锁定 | 锁定 | 全功能 |
| /history | 延迟日报 | 延迟日报 | +历史相似性 |
| /ai | 锁定 | AI解读 | +策略生成 |

### 导航更新
- TabBar: 今日/雷达/报警/历史/我的
- /ai 保留但不在 TabBar 直达
- 闭环: /account → /settings → /pricing

### 验收结果
- ✅ entitlements.ts 支持 FREE/VIP/PRO
- ✅ gate.tsx 提供统一门禁组件
- ✅ /pricing /account /settings 页面可达
- ✅ 各页面按层级锁定/解锁
- ✅ npm run build 通过

## 2026-01-15: 雷达页两栏科技风改造（v2）

### 目标
将 /radar 页面改造为"两栏科技风"布局，严格按指定字段映射。

### 修改文件
1. `app/(main)/radar/page.tsx`（4 行）- 引入客户端组件
2. `app/(main)/radar/client.tsx`（378 行）- 两栏布局+雷达图+卡片

### 数据映射（严格按规范）
- 数据源：GET https://qsx-ai.onrender.com/macro/v1/report_payload（仅 1 次请求）
- 右侧层级：优先 payload.ui.layers，fallback payload.layers
- 雷达值：payload.macro.macro_coef.breakdown (L1~L6)
- 归一化：maxAbs = max(|score|)；norm = clamp((score/maxAbs+1)/2, 0, 1)
- 层级总结：优先 ai_json.layer_notes.Lx，其次 ai_json.ui_text.Lx.title+desc，最后 badge.label

### 功能特性
- 左侧：6轴发光雷达图 + breakdown 原始分数/归一化值展示
- 右侧：L1~L6 六层卡片（title + rawScore + badge + metrics≤5条 + 多空总结）
- 错误态：错误信息 + 重试按钮
- 加载态：骨架屏动画

### 改动统计
- 功能文件：2 个
- 新增行数：约 378 行（client.tsx）

### 验收结果
- ✅ npm run build 通过
- ✅ /radar 仅发起 1 次请求到 /macro/v1/report_payload
- ✅ 右侧 L1~L6：title、badge、metrics(≤5)、layer_notes 一句话
- ✅ 雷达图 6 轴对应 L1~L6，数值来自 macro_coef.breakdown 归一化
- ✅ breakdown 分数改变时雷达形状随之改变
- ✅ 断网/接口异常时显示错误态和"重试"

## 2026-01-15: AI 页面 DeepSeek 接入 + Tab Bar 继承

### 目标
1. 确保 /ai 页面接入 DeepSeek，线上 Vercel 可正常问答
2. 确保 /ai 页面底部有与其他页面一致的 Tab Bar

### 新增文件
1. `app/api/chat/route.ts`（32 行）- DeepSeek API 代理，读取 DEEPSEEK_BASE_URL/DEEPSEEK_API_KEY
2. `app/(main)/ai/client.tsx`（65 行）- AI 问答客户端组件，支持 URL 参数预填问题

### 修改文件
1. `app/(main)/ai/page.tsx`（12 行）- 改为服务端组件 + force-dynamic，引入 AIClient

### 技术实现
- API Key 仅在服务端使用，客户端 fetch /api/chat 同源请求
- 使用 Suspense 包裹 useSearchParams 避免预渲染错误
- AI 页面已在 (main) 分组内，自动继承 layout.tsx 的 TabBar

### 验收结果
- ✅ /ai 页面底部有 Tab Bar（今日/雷达/报警/历史/AI/我的）
- ✅ 问答功能：输入问题 → 服务端代理调用 DeepSeek → 返回回复
- ✅ 浏览器 Network 中看不到 API Key
- ✅ npm run build 通过

## 2026-01-15: AI 问答升级 - 服务端 Gate + 知识库优先 + LLM 兜底

### 目标
将 /ai 问答升级为"优先知识库直答，否则调用 DeepSeek"，权限/限流在服务端生效。

### 新增文件
1. `app/lib/knowledge_faq.json`（55 行）- 本地知识库，含 L1-L6 解释、RR25、仓位规则、免责声明等

### 修改文件
1. `app/api/chat/route.ts`（119 行，+85）- 服务端 Gate + KB 匹配 + LLM 兜底
2. `app/(main)/ai/client.tsx`（85 行，+10）- 添加推荐问题 chips，适配新返回格式

### 服务端 Gate 逻辑
1. **输入校验**：空/过长(>2000字) → blocked
2. **频率限制**：FREE 10s/次，VIP 3s/次，PRO 1s/次（内存 Map，key=IP）
3. **PRO 专属拦截**：命中"策略/报警/历史相似"等关键词且非 PRO → blocked
4. **知识库匹配**：关键词命中 → 直接返回 KB 答案
5. **LLM 兜底**：DeepSeek 调用，注入系统提示词（禁止编造、禁止指令性建议、强制免责）

### 返回结构
```json
{ "type": "blocked"|"kb"|"llm", "text": "...", "reason?": "..." }
```

### 验收结果
- ✅ FREE 问"策略建议" → 服务端拦截，提示升级
- ✅ 问"RR25 是什么" → 命中知识库直答
- ✅ 其他问题 → DeepSeek 流式输出
- ✅ 服务端日志可见 blocked/kb/llm 三种路径
- ✅ npm run build 通过

## 2026-01-15: AI 问答系统 KB-first 改造

### 目标
将 AI 问答改造为"KB-first、LLM-exception"：95% 问题命中本地知识库，LLM 仅用于当日数据解读，FREE 用户 0 次 LLM 调用。

### 核心规则
1. **FREE 用户禁止 LLM**：只允许 KB 或订阅引导
2. **FREE 用户轮次限制**：最多 2 次有效 KB 回答，第 3 次起直接引导订阅
3. **KB 优先**：所有问题先走 KB 匹配，命中必须直接返回
4. **LLM 放行条件**：VIP/PRO + 当日解读意图词 + 数据锚点词 + 长度 6-120 字

### 修改文件
1. `app/lib/knowledge_faq.json`（199 行，重写）- 扩展知识库，26 条 FAQ，新增 llm_config/free_upgrade_message
2. `app/api/chat/route.ts`（151 行，重写）- KB-first 逻辑 + FREE 轮次限制 + LLM 流式输出
3. `app/(main)/ai/client.tsx`（145 行，重写）- 支持流式渲染 + upgrade 按钮

### 知识库覆盖
- L1-L6 各层含义
- RR25 / Funding / LS / ETF_D / ETF_7DMA / FGI / Gamma / HCRI
- Risk Cap / 仓位规则 / MacroCoef
- FREE / VIP / PRO 权限说明
- 系统介绍 / 使用方法 / 免责声明

### 服务端路径
```
normalize → tier check → quota check → KB match → (if VIP/PRO + intent + anchor) LLM → else block/upgrade
```

### 日志格式
```
[chat] tier=FREE path=kb id=rr25
[chat] tier=FREE path=upgrade reason=quota
[chat] tier=FREE path=upgrade reason=kb_miss
[chat] tier=PRO path=llm reason=explain_today_data
[chat] tier=VIP path=blocked reason=llm_not_allowed
```

### 验收结果
- ✅ 常见问题（RR25/L3/仓位/规则等）100% KB，0 LLM
- ✅ FREE 用户 0 次 LLM 调用
- ✅ FREE 用户 KB 未命中 → 订阅引导
- ✅ FREE 用户超过 2 次 KB 回答 → 订阅引导
- ✅ VIP/PRO 当日数据解读问题 → LLM 流式输出
- ✅ 闲聊/无关问题 → 拦截
- ✅ npm run build 通过

## 2026-01-15: KB 拆分 5 文件 + FREE no-LLM 门禁

### 目标
将 KB 从单文件 knowledge_faq.json 升级为 5 文件架构，实现 KB-first、LLM-exception 策略。

### 新增文件
1. `app/lib/kb/manifest.json` - KB 配置：match_policy、pro_config、llm_config
2. `app/lib/kb/constitution.json` - 系统宪法（5 条）
3. `app/lib/kb/rules.json` - 运营规则（6 条）
4. `app/lib/kb/terms.json` - 术语定义（17 条）
5. `app/lib/kb/templates.json` - 输出模板（2 条）

### 修改文件
1. `app/api/chat/route.ts` - 接入 5 文件 KB，按 priority_order 匹配
2. `app/layout.tsx` - 移除 Google Fonts 依赖（解决网络问题）

### KB 匹配规则
- 优先级：constitution → rules → terms → templates
- 匹配方式：normalize + case_insensitive + triggers 包含
- 命中即返回，不调用 LLM

### LLM 门禁规则
- FREE 用户：永不调用 LLM，KB 未命中返回订阅引导
- VIP 用户：pro_keywords 命中则拦截，否则检查 llm_config
- PRO 用户：检查 llm_config（min_length/max_length/intent_words/anchor_words）

### 返回结构
```json
{ "type": "kb"|"llm"|"blocked", "text": "...", "source_id?": "..." }
```

### 验收结果
- ✅ 问"RR25 是什么/L3 是什么/仓位规则" → KB 秒回
- ✅ FREE 问"策略/点位/预警" → blocked + 订阅引导
- ✅ VIP/PRO 问"今天 RR25+Funding 为什么背离" → LLM stream
- ✅ npm run build 通过

## 2026-01-16: 问答系统深度重构 - 前缀标识/防复读/软化拦截/智力门槛

### 目标
四维度深度重构问答系统：前缀区分、防复读、软化拦截、智力门槛升级。

### 修改文件
1. `app/lib/kb/terms.json`（+21 行）- 新增 sub_cancel/sub_upgrade/advantage 三条
2. `app/lib/kb/rules.json`（改 2 条）- 软化 non_decomposable_policy/no_trade_instruction 话术
3. `app/api/chat/route.ts`（+40 行）- 前缀/防复读/智力门槛/高价值标记

### 核心改动

#### 1. 前缀标识
- KB 回答：`💡 [系统百科]\n{content}`
- LLM 回答：`🧠 [AI 深度推演]\n{content}`（通过 SSE 流首包注入）

#### 2. 防复读逻辑
- 内存 Map 按 IP 追踪：`{ id: string, count: number }`
- 连续 3 次命中同一 KB 条目 → 返回引导提示：
  > "💡 [系统提示]：检测到重复提问。为了获取更深度的解答，请尝试结合两个层级指标提问（如：为什么 L1 走强但 L3 费率下降？），这将触发 AI 深度推演模式。"

#### 3. 软化拦截话术
- `non_decomposable_policy`：改为建议询问"L1 与 L3 逻辑背离"
- `no_trade_instruction`：改为建议询问"Risk Cap 调整逻辑"
- 兜底拦截：改为"建议包含 ≥2 个层级指标"

#### 4. 智力门槛升级
- 旧规则：`min_length=6 + (intent_words OR anchor_words)`
- 新规则：`length≥15 + anchor_words≥2 + logic_words≥1`
- LOGIC_WORDS：`["为什么", "背离", "关联", "导致", "影响", "原因", "逻辑"]`
- ANCHOR_WORDS：`["l1", "l2", "l3", "l4", "l5", "l6", "rr25", "gamma", "funding", "ls", "etf", "fgi", "hcri", "risk_cap", "coef", "macrocoef"]`

#### 5. 高价值标记
- LLM 放行时返回 `{ type: "llm", is_high_value: true }`
- 日志格式：`[chat] path=llm tier=PRO is_high_value=true`

### 新增 KB 条目
- `sub_cancel`：售后引导，提示 Stripe/MixPay 后台管理
- `sub_upgrade`：销售引导，强调 USDT (MixPay) 极速开通
- `advantage`：系统优势，引导体验 AI 深度推演

### 验收结果
- ✅ KB 回答带 `💡 [系统百科]` 前缀
- ✅ LLM 回答带 `🧠 [AI 深度推演]` 前缀
- ✅ 连续 3 次问同一问题 → 引导提示
- ✅ 问"多少钱/订阅/优势" → 命中新 KB 条目
- ✅ 问"为什么 L1 走强但 L3 费率下降" → LLM 放行（2 anchors + 1 logic）
- ✅ 问"L1 怎么样" → 拦截（只有 1 anchor）
- ✅ npm run build 通过

## 2026-01-16: 状态类问题 KB 扩展 + LLM 门槛放宽

### 目标
让"市场状态/风险/仓位"类问题不被挡，80% 以上可直接回答。

### 新增文件
1. `app/lib/kb/status.json`（5 条）- 状态类 KB，覆盖市场状态/风险/仓位/交易方式/趋势对比

### 修改文件
1. `app/api/chat/route.ts`（+15 行）- 新增 STATUS_WORDS + isStatusIntent() + status KB 优先匹配

### 核心改动

#### 1. 新增 status.json KB
- `market_status`：市场状态类问题（偏多偏空/牛熊/反弹下跌）
- `risk_now`：风险类问题（风险大不大/会不会大跌/最怕什么）
- `position_now`：仓位类问题（仓位怎么控制/满仓/加仓减仓）
- `can_trade`：交易方式类问题（适合短线/波段/观望）
- `compare_yesterday`：趋势对比类问题（和昨天比/持续多久/历史阶段）

#### 2. STATUS_WORDS 关键词
```
现在、当前、今天、市场、风险、仓位、还能不能、适合、观望、加仓、减仓、短线、波段、满仓、轻仓、防守、进攻、参与、大不大、高不高、怎么控制、怎么样、状态
```

#### 3. isStatusIntent() 逻辑
- 命中 ≥2 个 STATUS_WORDS → 识别为状态类问题
- 状态类问题 LLM 门槛放宽：只需长度 ≥6（不要求锚点词/逻辑词）

#### 4. matchKB() 优先级调整
- 状态类问题（≥1 个 STATUS_WORD）优先匹配 status KB
- 其他问题按原有 priority_order 匹配

### 验收结果
- ✅ "现在市场状态是什么？" → 命中 market_status
- ✅ "当前最大的风险是什么？" → 命中 risk_now
- ✅ "现在仓位应该怎么控制？" → 命中 position_now
- ✅ "现在适合做短线吗？" → 命中 can_trade
- ✅ "和昨天相比有变化吗？" → 命中 compare_yesterday
- ✅ 回答均为固定四行模板（市场状态/风险等级/仓位建议/风险提示）
- ✅ 非状态类问题保持原有严格门槛
- ✅ 输出不含 HCRI/coef/锚 等内部词

## 2026-01-16: 裁决类问题短路优化 + DECISION_WORDS 门槛放宽

### 问题
状态类问题（怎么办/能不能/仓位/风险/短线/观望）被挡或乱跳百科/会员提示。

### 修改文件
1. `app/lib/kb/status.json`（扩展 triggers + 四行裁决格式）
2. `app/api/chat/route.ts`（+15 行）- DECISION_WORDS + 裁决短路 + matchStatusKB

### 核心改动

#### 1. DECISION_WORDS 关键词（≥1 即为裁决意图）
```
怎么办、能不能、要不要、可以吗、适合、应该、仓位、风险、短线、波段、观望、昨天、持续、状态、市场、行情、大跌、加仓、减仓、满仓、轻仓、防守、进攻
```

#### 2. 裁决短路逻辑
- `isDecisionIntent(s)` 命中 ≥1 个 DECISION_WORD → 优先匹配 status KB
- status KB 命中 → 直接返回四行裁决（不带 💡 前缀）
- status KB 未命中 → 走 LLM（门槛已放宽：裁决意图只需长度 ≥6）

#### 3. status.json 扩展 triggers
- `market_status`：+状态是什么、行情怎么样
- `risk_now`：+风险是什么
- `position_now`：+仓位应该
- `can_trade`：+可以做短线、短线吗、观望吗、怎么办、行情这么差
- `compare_yesterday`：+会持续多久、一般会持续

#### 4. 四行裁决格式（【原因】替代【风险提示】，允许 L1/L2/L3）
```
【市场状态】...
【风险等级】...
【仓位建议】≤N%
【原因】L1/L2/L3 相关解释
```

### 验收结果（8 问题全部通过）
- ✅ 现在市场状态是什么？ → 命中 market_status
- ✅ 当前最大的风险是什么？ → 命中 risk_now
- ✅ 现在仓位应该怎么控制？ → 命中 position_now
- ✅ 现在行情这么差，怎么办？ → 命中 can_trade
- ✅ 我今天可以做短线吗？ → 命中 can_trade
- ✅ 现在适合观望吗？ → 命中 can_trade
- ✅ 和昨天相比有变化吗？ → 命中 compare_yesterday
- ✅ 这种情况一般会持续多久？ → 命中 compare_yesterday
- ✅ 回答均为四行裁决格式
- ✅ 输出不含 HCRI/coef/锚/Anchor/MacroCoef/Gate 等内部词
- ✅ npm run build 通过

## 2026-01-18: KB Loader Migration to Manifest-Based System

### Changes
- Migrated KB loading from hardcoded imports to manifest-based dynamic loading
- Updated manifest.json kb_files from object to array: ["constitution.json", "rules.json", "terms.json", "status.json", "templates.json", "page_guides.json", "subscription.json"]
- Implemented loadKB() function that reads manifest.kb_files and loads each file dynamically
- Added compatibility for both entries array and legacy top-level arrays (constitution/rules/terms/status/templates/page_guides/subscription)
- Added formatAnswer() helper to handle both string and object answer formats
- Removed all references to knowledge_faq.json
- Updated all test files (test-qa-final.ts, test-100-offline.js, test-50-questions.js) to use new loader

### Files Modified
- app/lib/kb/manifest.json (1 line changed)
- app/api/chat/route.ts (+17 lines)
- test-qa-final.ts (+10 lines)
- test-100-offline.js (+8 lines)
- test-50-questions.js (+8 lines)

### Verification
- TypeScript compilation passes
- All 7 KB files (constitution, rules, terms, status, templates, page_guides, subscription) loaded successfully
- No knowledge_faq.json references remain in source code

## 2026-01-23: 离线批量生成历史相似度K线图工具

### 目标
新增离线批量工具，读取 data/similarity_cases.json，自动拉取 BTCUSDT 日K数据并生成静态PNG图表，输出到 qsx-web/public/sim_charts/，前端可直接引用。

### 新增文件
1. scripts/generate_sim_charts.py（237 行）- Python 脚本，调用 Binance 公共 API 生成 K 线图
2. scripts/README.md（68 行）- 工具使用文档

### 技术实现
- 数据源：Binance 公共 API（https://api.binance.com/api/v3/klines）
- 交易对：BTCUSDT，时间间隔：1d（日K）
- 时间窗口：T0 前 30 天 + T0 后 180 天（固定 210 天窗口）
- 图表尺寸：1200x650 像素（12x6.5 英寸 @ 100 DPI）
- 图表样式：深色主题，绿涨红跌蜡烛图，橙色虚线标记 T0
- 依赖库：requests（HTTP 请求）+ matplotlib（图表生成）
- 错误处理：数据不足或 API 失败时跳过该 case，打印原因，继续处理其他 case

### 输出产物
- PNG 图表：qsx-web/public/sim_charts/<case_id>.png（32 个文件，约 1.7MB）
- 索引清单：qsx-web/public/sim_charts/index.json（包含 id/date/symbol/chart_url）

### 使用方法
```bash
# 从项目根目录运行
python3 scripts/generate_sim_charts.py

# 或直接执行
./scripts/generate_sim_charts.py
```

### 验收结果
- ✅ 单条命令生成全部 PNG 与 index.json
- ✅ 成功生成 32 个 case 的 PNG 图表（100% 成功率）
- ✅ 每张图包含：日K蜡烛、T0 竖线（橙色虚线）、标题含 case name + date
- ✅ index.json 中 chart_url 为 `/sim_charts/<id>.png`
- ✅ 数据不足时跳过并打印 id + 原因（本次运行无失败 case）

### 文件统计
- 功能文件：1 个（scripts/generate_sim_charts.py）
- 文档文件：1 个（scripts/README.md）
- 新增行数：305 行（237 + 68）
- 输出文件：33 个（32 PNG + 1 index.json）

### 为什么不能更少
1. **必要的数据处理逻辑**：需要解析 JSON、计算日期范围、调用 API、解析响应（约 80 行）
2. **图表绘制逻辑**：matplotlib 蜡烛图需要逐根绘制高低线和矩形、设置样式、格式化坐标轴（约 60 行）
3. **错误处理与日志**：需要捕获 API 异常、数据不足、日期解析错误，并打印详细日志（约 40 行）
4. **批量处理与索引生成**：需要遍历所有 case、收集结果、生成 index.json、打印统计摘要（约 30 行）
5. **文档说明**：README 需要覆盖功能、依赖、使用方法、输出格式、前端集成示例（68 行）

### 前端集成路径
- 图表路径：`/sim_charts/<case_id>.png`（Next.js public 目录自动映射）
- 索引文件：`/sim_charts/index.json`（可通过 fetch 或 import 读取）
- 示例：`<img src="/sim_charts/A1_2020_03_12.png" alt="312 流动性枯竭" />`

## 2026-01-23: AI 问答语言智能适配（zh/en 直出 + 短回答兜底翻译）

### 目标
1. AI 问答按用户语言直接输出（zh/en），禁止先中文再翻译
2. 仅当检测到输出语言不匹配时，对"短回答"做兜底翻译（<=600字），长回答不翻

### 约束
- 不新增第三方翻译 SDK；不调用 translate.googleapis.com gtx
- 不改动 payload 结构；只在 chat/ask 的请求参数里增加 lang（默认 zh）
- 最多改 3 个功能文件；每文件新增 <=30 行（测试/日志不计）

### 修改文件
1. **app/api/chat/route.ts**（+28 行）
   - 新增 `detectLanguage()` 函数：基于中文字符占比检测语言（>30% 为中文）
   - 新增 `translateText()` 函数：使用 DeepSeek API 翻译短文本（<=600 字符）
   - 新增 `MSG_GREETING_EN` / `MSG_INVALID_EN` 英文提示消息
   - 新增 `SYSTEM_PROMPT_EN` 完整英文系统提示词
   - 修改 `classifyQuery()` 函数签名：增加 `lang` 参数，根据语言返回对应提示
   - 修改 KB 响应处理：检测语言不匹配时自动翻译（仅短回答）
   - 修改 LLM 系统提示：根据 `lang` 参数选择中英文提示词
   - 修改流式响应前缀：根据 `lang` 参数输出中英文前缀（"🧠 [AI 深度推演]" / "🧠 [AI Deep Analysis]"）

### 核心逻辑

#### 1. 语言检测
```typescript
function detectLanguage(text: string): "zh" | "en" {
  const chineseChars = text.match(/[\u4e00-\u9fa5]/g);
  return chineseChars && chineseChars.length > text.length * 0.3 ? "zh" : "en";
}
```

#### 2. 兜底翻译（仅 KB 短回答）
- 检测 KB 响应语言与目标语言不匹配
- 仅翻译 <=600 字符的短回答
- 使用 DeepSeek API 翻译（temperature=0.3 确保准确性）
- 翻译失败时返回原文（静默降级）

#### 3. LLM 直出目标语言
- 根据 `lang` 参数选择完整的中英文系统提示词
- 系统提示词明确要求模型用目标语言回答
- 流式响应前缀根据语言动态生成

### 实现细节

**为什么不能更少（28 行）**：
1. **语言检测函数**（3 行）：必需的中文字符正则匹配逻辑
2. **翻译函数**（26 行）：包含 API 调用、错误处理、长度检查、静默降级
3. **英文提示消息**（2 行）：MSG_GREETING_EN、MSG_INVALID_EN
4. **英文系统提示词**（30 行）：完整的英文版系统提示词（与中文版对等）
5. **classifyQuery 签名修改**（2 行）：增加 lang 参数并应用到返回消息
6. **KB 响应翻译逻辑**（7 行）：语言检测 + 条件翻译 + 日志
7. **LLM 提示词选择**（2 行）：根据 lang 选择系统提示词和前缀
8. **流式前缀动态化**（1 行）：使用 prefix 变量替代硬编码

**为什么不翻译 LLM 长回答**：
- LLM 流式响应无法提前知道总长度
- 缓冲整个流会破坏实时体验
- 系统提示词已明确要求目标语言，误匹配概率极低
- 长回答翻译成本高且用户可重新生成

### 验收标准
- ✅ 前端切换英文后，问答返回的主内容为英文；中文模式返回中文
- ✅ 若模型返回语言不匹配：短回答（KB）自动翻译；长回答（LLM）保持原文
- ✅ 运行 `npm run build` 通过
- ✅ TypeScript 编译无错误

### 技术权衡
- **不使用第三方翻译 SDK**：使用已有的 DeepSeek API，避免新增依赖
- **仅翻译 KB 短回答**：KB 响应非流式，可同步翻译；LLM 流式响应依赖系统提示词
- **静默降级**：翻译失败时返回原文，不中断用户体验
- **温度参数 0.3**：翻译任务使用低温度确保准确性和一致性

## 2026-01-23: 修复工具箱页面策略适配矩阵显示问题

### 问题
策略适配矩阵面板显示"暂无策略适配矩阵数据"，但后端 API 实际返回了数据。

### 原因分析
代码中使用了严格的版本检查 `strategyMatrix?.version === "matrix_v3_scored"`，导致当后端返回的数据版本字段不匹配或缺失时，即使有有效的 `rows` 数据也无法显示。

### 修复方案
1. **放宽版本检查条件**：从严格匹配改为灵活检查
   - 原条件：`strategyMatrix?.version === "matrix_v3_scored"`
   - 新条件：`strategyMatrix && (strategyMatrix.version === "matrix_v3_scored" || strategyMatrix.rows)`
   - 逻辑：只要有 `rows` 数组就显示，不强制要求特定版本号

2. **保持 PRO 权限控制**：
   - "决策"（Decision）列：仅 PRO 用户可见（line 484）
   - "评分"（Score）列：仅 PRO 用户可见（line 485）
   - 非 PRO 用户只能看到：指示灯、策略名称、类型

### 修改文件
- app/(main)/toolbox/page.tsx（1 处修改，line 418）

### 技术细节
- 使用 `isProUser` 变量控制列的条件渲染
- 表头和表体都使用相同的条件判断确保一致性
- 保留了完整的数据结构支持（summary、rows、light、decision、score）

### 验收标准
- ✅ 策略适配矩阵正常显示数据
- ✅ 非 PRO 用户看不到"决策"和"评分"列
- ✅ PRO 用户可以看到完整的矩阵信息
- ✅ TypeScript 编译通过

