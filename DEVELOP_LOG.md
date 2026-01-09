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
