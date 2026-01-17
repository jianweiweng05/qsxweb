"use client";

import Link from "next/link";
import { useMemo } from "react";

type BtnProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
};

function ButtonLink({ href, children, variant = "ghost", className = "" }: BtnProps) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold tracking-wide transition active:scale-[0.99]";
  const v =
    variant === "primary"
      ? "bg-cyan-500/90 text-black hover:bg-cyan-400 shadow-[0_0_0_1px_rgba(34,211,238,0.35),0_10px_30px_rgba(34,211,238,0.12)]"
      : "bg-white/6 text-white hover:bg-white/10 border border-white/12";
  return (
    <Link href={href} className={`${base} ${v} ${className}`}>
      {children}
    </Link>
  );
}

function SectionTitle({
  title,
  subtitle,
  align = "center",
}: {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}) {
  const a = align === "left" ? "text-left" : "text-center";
  return (
    <div className={`${a} mb-10`}>
      <h2 className="text-xl sm:text-2xl font-semibold text-white/92 tracking-wide">{title}</h2>
      {subtitle ? <div className="mt-3 text-sm text-white/55">{subtitle}</div> : null}
    </div>
  );
}

function GlassCard({
  title,
  desc,
  icon,
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/12 border border-cyan-400/20 text-cyan-300">
          {icon}
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-white/90">{title}</div>
          <div className="mt-2 text-sm text-white/55 leading-relaxed">{desc}</div>
        </div>
      </div>
    </div>
  );
}

function StepRow({ n, text }: { n: number; text: string }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md px-5 py-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/14 border border-cyan-400/20 text-cyan-300 font-semibold">
        {n}
      </div>
      <div className="text-sm text-white/75 leading-relaxed">{text}</div>
    </div>
  );
}

function CompareTable() {
  const rows = useMemo(
    () => [
      { left: "预测价格涨跌", right: "量化风险边界" },
      { left: "单一指标分析", right: "多维度数据融合" },
      { left: "滞后的历史数据", right: "实时市场结构监控" },
      { left: "需要自己解读", right: "AI 直接给出建议" },
    ],
    []
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
      <div className="grid grid-cols-2">
        <div className="px-6 py-4 text-sm font-semibold text-white/60 border-b border-white/10">
          传统分析工具
        </div>
        <div className="px-6 py-4 text-sm font-semibold text-cyan-300 border-b border-white/10">
          QSX
        </div>
      </div>

      <div className="divide-y divide-white/10">
        {rows.map((r, i) => (
          <div key={i} className="grid grid-cols-2">
            <div className="px-6 py-4 text-sm text-white/55">{r.left}</div>
            <div className="px-6 py-4 text-sm text-white/78">{r.right}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Background() {
  return (
    <div className="absolute inset-0 -z-10">
      <div className="absolute inset-0 bg-black" />
      <div className="absolute inset-0 bg-[radial-gradient(1200px_circle_at_50%_15%,rgba(34,211,238,0.14),transparent_55%),radial-gradient(900px_circle_at_10%_40%,rgba(56,189,248,0.10),transparent_55%),radial-gradient(900px_circle_at_90%_55%,rgba(99,102,241,0.10),transparent_55%)]" />
      <div className="absolute inset-0 opacity-[0.35] bg-[url('/stars.jpg')] bg-cover bg-center" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/55 to-black/85" />
    </div>
  );
}

function ContentShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative z-10 w-full max-w-[1200px] xl:max-w-[1320px] mx-auto px-5 sm:px-8">
      {children}
    </div>
  );
}

export default function LandingClient() {
  return (
    <div className="relative min-h-screen text-white">
      <Background />

      <ContentShell>
        <section className="pt-10 sm:pt-14">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-cyan-500/12 border border-cyan-400/20 flex items-center justify-center text-cyan-300 font-semibold">
                Q
              </div>
              <div className="text-sm font-semibold text-white/85 tracking-wide">QSX</div>
            </div>
            <div className="flex items-center gap-3">
              <ButtonLink href="/sign-in" variant="ghost" className="px-4 py-2 rounded-lg">
                Sign In
              </ButtonLink>
              <ButtonLink href="/sign-up" variant="primary" className="px-4 py-2 rounded-lg">
                Sign Up
              </ButtonLink>
            </div>
          </div>
        </section>

        <section className="min-h-[78vh] sm:min-h-[80vh] flex items-center">
          <div className="w-full">
            <div className="max-w-[860px]">
              <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white/92">
                QSX 全市场风险引擎
              </h1>

              <div className="mt-5 text-base sm:text-lg text-white/70 leading-relaxed">
                QSX —— 定义交易的风险边界。
              </div>
              <div className="mt-2 text-sm sm:text-base text-white/50">
                QSX - Quantifying the Edge of Market Risk.
              </div>

              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <ButtonLink href="/sign-up" variant="primary" className="w-full sm:w-auto">
                  免费注册
                </ButtonLink>
                <ButtonLink href="/sign-in" variant="ghost" className="w-full sm:w-auto">
                  继续登录
                </ButtonLink>
              </div>

              <div className="mt-4 text-xs text-white/35">Invite only</div>
            </div>
          </div>
        </section>

        <section className="pb-8">
          <SectionTitle title="为什么用 QSX" subtitle="不预测涨跌，专注给出风险边界与可执行的仓位约束。" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard
              title="量化风险边界"
              desc="不预判涨跌，只量化当前市场的风险暴露度与结构性拐点。"
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2v20M2 12h20"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              }
            />
            <GlassCard
              title="机构级数据引擎"
              desc="整合流动性、衍生品、链上资金流等多维数据，形成一致的风险视图。"
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 7h16M7 4v16M20 17H4"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              }
            />
            <GlassCard
              title="实时风险报警"
              desc="市场异常波动、杠杆堆积、流动性枯竭时第一时间推送预警。"
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 9v4m0 4h.01M10.3 3.2l-8 14A2 2 0 0 0 4 20h16a2 2 0 0 0 1.7-2.8l-8-14a2 2 0 0 0-3.4 0Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              }
            />
          </div>
        </section>

        <section className="mt-24 pb-8">
          <SectionTitle title="3 步开始使用" subtitle="先理解风险，再决定仓位，最后才谈策略。" />

          <div className="max-w-[760px] mx-auto space-y-5">
            <StepRow n={1} text="免费注册账号，无需信用卡" />
            <StepRow n={2} text="查看今日市场风险评分与仓位建议" />
            <StepRow n={3} text="升级 VIP/PRO 解锁完整数据与 AI 分析" />
          </div>

          <div className="mt-10 text-center">
            <ButtonLink href="/sign-up" variant="primary">
              免费注册
            </ButtonLink>
          </div>
        </section>

        <section className="mt-24 pb-20">
          <SectionTitle title="QSX 与传统工具的区别" subtitle="把复杂数据压缩成“能执行的风险边界”。" />
          <CompareTable />
        </section>
      </ContentShell>
    </div>
  );
}