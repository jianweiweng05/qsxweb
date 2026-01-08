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
