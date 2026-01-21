"use client";

import { useMemo, useState } from "react";

const AUTH_ORIGIN = process.env.NEXT_PUBLIC_QSX_AUTH_ORIGIN || "";

type Lang = "zh" | "en";

export default function LandingClient() {
  const [lang, setLang] = useState<Lang>("zh");

  const copy = useMemo(() => {
    if (lang === "en") {
      return {
        brand: "QSX",
        title: "Quantscope X",
        tagline: "QSX Market Risk Engine - Define the Risk Boundary of Trading.",
        primary: "Sign Up",
        secondary: "Sign In",
        invite: "Invite only",
        whyTitle: "Why QSX",
        whySub: "Not price prediction. Risk boundary and actionable position constraints.",
        why: [
          {
            title: "Risk Boundary",
            desc: "Compress complex signals into a clear, executable risk boundary.",
          },
          {
            title: "Multi-Source Fusion",
            desc: "Liquidity, derivatives, and capital flows fused into one risk view.",
          },
          {
            title: "Risk Alerts",
            desc: "Real-time alerts when leverage piles up or liquidity deteriorates.",
          },
        ],
        howTitle: "How it Works",
        howSub: "Understand risk first, decide position next, talk strategy last.",
        steps: [
          "Create a free account. No credit card required.",
          "Get today’s market risk view and position guidance.",
          "Upgrade to unlock advanced data and AI analysis.",
        ],
        diffTitle: "QSX vs Traditional Tools",
        diffSub: "Turn raw data into an executable risk boundary.",
        diffLeft: "Traditional",
        diffRight: "QSX",
        diffRows: [
          ["Price prediction", "Risk boundary quantification"],
          ["Single-indicator analysis", "Multi-source fusion"],
          ["Lagging historical focus", "Real-time market structure"],
          ["You interpret everything", "Direct actionable guidance"],
        ],
        ctaTitle: "Start with the free plan",
        ctaSub: "Create an account to explore the core risk boundary output.",
        ctaBtn: "Get Started",
      };
    }

    return {
      brand: "QSX",
      title: "Quantscope X",
      tagline: "QSX全市场风险引擎 - 定义交易的风险边界。",
      primary: "免费注册",
      secondary: "继续登录",
      invite: "Invite only",
      whyTitle: "为什么用 QSX",
      whySub: "不预测涨跌，只输出风险边界与可执行的仓位约束。",
      why: [
        {
          title: "量化风险边界",
          desc: "把复杂信号压缩成“可执行的风险边界”，一眼判断该不该出手。",
        },
        {
          title: "多源数据融合",
          desc: "融合流动性、衍生品、资金流等维度，形成统一的风险视图。",
        },
        {
          title: "实时风险预警",
          desc: "杠杆堆积或流动性恶化时，第一时间推送风险提醒。",
        },
      ],
      howTitle: "怎么用",
      howSub: "先理解风险，再决定仓位，最后谈策略。",
      steps: [
        "免费注册账号，无需信用卡。",
        "查看今日市场风险概览与仓位建议。",
        "升级解锁高级数据与 AI 解读。",
      ],
      diffTitle: "QSX 与传统工具的区别",
      diffSub: "把复杂数据压缩成“能执行的风险边界”。",
      diffLeft: "传统分析工具",
      diffRight: "QSX",
      diffRows: [
        ["预测价格涨跌", "量化风险边界"],
        ["单一指标分析", "多维度融合"],
        ["滞后的历史数据", "实时结构监控"],
        ["需要自己解读", "直接给出建议"],
      ],
      ctaTitle: "先免费体验",
      ctaSub: "注册后可直接体验核心“风险边界”输出。",
      ctaBtn: "开始使用",
    };
  }, [lang]);

  const buildRedirect = () => {
    const currentOrigin = window.location.origin;
    return encodeURIComponent(currentOrigin + "/today");
  };

  const handleSignIn = () => {
    const redirectUrl = buildRedirect();
    window.location.href = `${AUTH_ORIGIN}/sign-in?redirect_url=${redirectUrl}`;
  };

  const handleSignUp = () => {
    const redirectUrl = buildRedirect();
    window.location.href = `${AUTH_ORIGIN}/sign-up?redirect_url=${redirectUrl}`;
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden text-white">
      <div className="absolute inset-0 bg-[url('/bg-stars.jpg')] bg-cover bg-center" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/55 to-black/85" />

      <div className="relative z-10">
        <header className="mx-auto w-full max-w-6xl px-6 pt-6">
          <div className="flex items-center justify-between">
            <div />

            <div className="flex items-center gap-3">
              <button
                onClick={() => setLang((v) => (v === "zh" ? "en" : "zh"))}
                className="h-10 px-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md text-sm font-semibold opacity-90 hover:opacity-100 transition"
              >
                {lang === "zh" ? "EN" : "中文"}
              </button>
            </div>
          </div>
        </header>

        <section className="mx-auto w-full max-w-6xl px-6">
          <div className="min-h-[78vh] flex items-center justify-center">
            <div className="w-full text-center">
              <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">
                {copy.title}
              </h1>
              <p className="mt-5 text-base md:text-lg text-white/70">
                {copy.tagline}
              </p>

              <div className="mt-12 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleSignUp}
                  className="h-12 px-6 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 font-semibold shadow-[0_12px_34px_rgba(59,130,246,0.28)] hover:brightness-110 transition"
                >
                  {copy.primary}
                </button>
                <button
                  onClick={handleSignIn}
                  className="h-12 px-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md font-semibold hover:bg-white/8 transition"
                >
                  {copy.secondary}
                </button>
              </div>

              <div className="mt-4 text-sm text-white/45 font-medium">{copy.invite}</div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-6 pb-24">
          <div className="rounded-3xl border border-white/10 bg-black/20 backdrop-blur-xl p-7 md:p-10">
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-semibold">{copy.whyTitle}</h2>
              <p className="mt-3 text-sm md:text-base text-white/65">{copy.whySub}</p>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
              {copy.why.map((x) => (
                <div
                  key={x.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6"
                >
                  <div className="text-cyan-200 font-semibold">{x.title}</div>
                  <div className="mt-3 text-sm text-white/65 leading-relaxed">{x.desc}</div>
                </div>
              ))}
            </div>

            <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div>
                <h3 className="text-xl font-semibold">{copy.howTitle}</h3>
                <p className="mt-2 text-sm text-white/65">{copy.howSub}</p>

                <div className="mt-6 space-y-3">
                  {copy.steps.map((s, idx) => (
                    <div
                      key={s}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4 flex items-center gap-4"
                    >
                      <div className="h-9 w-9 rounded-xl bg-cyan-300/90 text-black font-bold flex items-center justify-center">
                        {idx + 1}
                      </div>
                      <div className="text-sm text-white/80">{s}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold">{copy.diffTitle}</h3>
                <p className="mt-2 text-sm text-white/65">{copy.diffSub}</p>

                <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                  <div className="grid grid-cols-2">
                    <div className="px-5 py-4 text-sm font-semibold text-white/55">
                      {copy.diffLeft}
                    </div>
                    <div className="px-5 py-4 text-sm font-semibold text-cyan-200 border-l border-white/10">
                      {copy.diffRight}
                    </div>
                  </div>

                  {copy.diffRows.map((r, i) => (
                    <div key={r[0] + i} className="grid grid-cols-2 border-t border-white/10">
                      <div className="px-5 py-4 text-sm text-white/60">{r[0]}</div>
                      <div className="px-5 py-4 text-sm text-white/85 border-l border-white/10">
                        {r[1]}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 rounded-2xl border border-white/10 bg-black/25 p-6 flex items-center justify-between gap-4">
                  <div>
                    <div className="font-semibold">{copy.ctaTitle}</div>
                    <div className="mt-1 text-sm text-white/65">{copy.ctaSub}</div>
                  </div>
                  <button
                    onClick={handleSignUp}
                    className="h-11 px-6 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 font-semibold shadow-[0_12px_34px_rgba(59,130,246,0.28)] hover:brightness-110 transition"
                  >
                    {copy.ctaBtn}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-xs text-white/35">
            {lang === "zh"
              ? "注：本页仅展示产品价值，不暴露内部数据口径与模型细节。"
              : "Note: This page presents product value only and does not expose internal data definitions or model details."}
          </div>
        </section>
      </div>
    </div>
  );
}