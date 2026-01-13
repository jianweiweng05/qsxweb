# QuantscopeX Development Log

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
