// client.tsx
"use client";

const AUTH_ORIGIN = process.env.NEXT_PUBLIC_QSX_AUTH_ORIGIN || "";

function cx(...arr: Array<string | false | null | undefined>) {
  return arr.filter(Boolean).join(" ");
}

function IconDot() {
  return (
    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.6)]" />
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[12px] font-medium text-white/70 backdrop-blur">
      <IconDot />
      {children}
    </span>
  );
}

function GlassCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cx(
        "rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-xl",
        "shadow-[0_12px_40px_rgba(0,0,0,0.35)]",
        className
      )}
    >
      {children}
    </div>
  );
}

function PrimaryButton({
  onClick,
  children,
  className,
}: {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cx(
        "h-12 w-full rounded-xl px-5 text-[15px] font-semibold",
        "bg-gradient-to-br from-blue-500 to-blue-700 text-white",
        "shadow-[0_10px_30px_rgba(59,130,246,0.35)]",
        "transition-transform duration-150 hover:scale-[1.02] active:scale-[0.99]",
        className
      )}
    >
      {children}
    </button>
  );
}

function SecondaryButton({
  onClick,
  children,
  className,
}: {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cx(
        "h-12 w-full rounded-xl px-5 text-[15px] font-semibold text-white",
        "border border-white/10 bg-white/5 backdrop-blur",
        "transition-transform duration-150 hover:scale-[1.02] active:scale-[0.99]",
        className
      )}
    >
      {children}
    </button>
  );
}

export default function LandingClient() {
  const handleSignIn = () => {
    const currentOrigin = window.location.origin;
    const redirectUrl = encodeURIComponent(currentOrigin + "/today");
    window.location.href = `${AUTH_ORIGIN}/sign-in?redirect_url=${redirectUrl}`;
  };

  const handleSignUp = () => {
    const currentOrigin = window.location.origin;
    const redirectUrl = encodeURIComponent(currentOrigin + "/today");
    window.location.href = `${AUTH_ORIGIN}/sign-up?redirect_url=${redirectUrl}`;
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/bg-stars.jpg)" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.12),transparent_55%),linear-gradient(to_bottom,rgba(0,0,0,0.45),rgba(0,0,0,0.75),rgba(0,0,0,0.9))]" />
      <div className="absolute inset-0 opacity-[0.22] [background-image:linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:64px_64px]" />

      <header className="relative z-10">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5 shadow-[0_10px_25px_rgba(0,0,0,0.35)] backdrop-blur">
              <span className="text-[14px] font-extrabold tracking-wide text-cyan-300">
                Q
              </span>
            </div>
            <div className="text-[14px] font-semibold tracking-wide text-white/85">
              QSX
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSignIn}
              className="h-10 rounded-xl border border-white/10 bg-white/5 px-4 text-[13px] font-semibold text-white/85 backdrop-blur transition hover:bg-white/10"
            >
              Sign In
            </button>
            <button
              onClick={handleSignUp}
              className="h-10 rounded-xl bg-cyan-500/90 px-4 text-[13px] font-semibold text-black transition hover:bg-cyan-400"
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        <section className="mx-auto w-full max-w-7xl px-6 pb-14 pt-10 lg:pb-20 lg:pt-12">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              <div className="flex flex-wrap items-center gap-2">
                <Pill>全市场风险引擎</Pill>
                <Pill>机构级数据融合</Pill>
                <Pill>实时风险报警</Pill>
              </div>

              <h1 className="mt-6 text-[40px] font-extrabold leading-[1.05] tracking-[-0.02em] lg:text-[52px]">
                QSX 全市场风险引擎
              </h1>

              <p className="mt-5 max-w-2xl text-[16px] leading-7 text-white/70 lg:text-[17px]">
                QSX —— 定义交易的风险边界。
              </p>
              <p className="mt-2 max-w-2xl text-[13px] leading-6 text-white/45">
                QSX - Quantifying the Edge of Market Risk.
              </p>

              <div className="mt-8 grid w-full max-w-md grid-cols-2 gap-3">
                <PrimaryButton onClick={handleSignUp}>免费注册</PrimaryButton>
                <SecondaryButton onClick={handleSignIn}>继续登录</SecondaryButton>
              </div>

              <div className="mt-3 text-[12px] font-medium text-white/40">
                Invite only
              </div>

              <div className="mt-10 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
                <GlassCard className="p-4">
                  <div className="text-[13px] font-semibold text-cyan-300">
                    不预测涨跌
                  </div>
                  <div className="mt-2 text-[13px] leading-6 text-white/65">
                    只输出可执行的风险边界与仓位约束。
                  </div>
                </GlassCard>

                <GlassCard className="p-4">
                  <div className="text-[13px] font-semibold text-cyan-300">
                    多维度融合
                  </div>
                  <div className="mt-2 text-[13px] leading-6 text-white/65">
                    流动性 / 衍生品 / 链上资金流统一视图。
                  </div>
                </GlassCard>

                <GlassCard className="p-4">
                  <div className="text-[13px] font-semibold text-cyan-300">
                    实时预警
                  </div>
                  <div className="mt-2 text-[13px] leading-6 text-white/65">
                    异常波动与杠杆堆积，优先提示风险。
                  </div>
                </GlassCard>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="sticky top-6">
                <GlassCard className="p-6">
                  <div className="text-[14px] font-semibold text-white/85">
                    3 步开始使用
                  </div>
                  <div className="mt-1 text-[13px] text-white/55">
                    先理解风险，再决定仓位，最后谈策略。
                  </div>

                  <div className="mt-5 space-y-3">
                    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                      <div className="grid h-8 w-8 place-items-center rounded-full bg-cyan-400 text-[13px] font-extrabold text-black">
                        1
                      </div>
                      <div className="text-[13px] text-white/75">
                        免费注册账号，无需信用卡
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                      <div className="grid h-8 w-8 place-items-center rounded-full bg-cyan-400 text-[13px] font-extrabold text-black">
                        2
                      </div>
                      <div className="text-[13px] text-white/75">
                        查看今日市场风险评分与仓位建议
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                      <div className="grid h-8 w-8 place-items-center rounded-full bg-cyan-400 text-[13px] font-extrabold text-black">
                        3
                      </div>
                      <div className="text-[13px] text-white/75">
                        升级 VIP/PRO 解锁完整数据与 AI 分析
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <PrimaryButton onClick={handleSignUp}>立即免费注册</PrimaryButton>
                  </div>
                </GlassCard>

                <div className="mt-6">
                  <GlassCard className="p-6">
                    <div className="text-[14px] font-semibold text-white/85">
                      QSX 与传统工具的区别
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-3">
                      <div className="grid grid-cols-2 overflow-hidden rounded-xl border border-white/10">
                        <div className="bg-white/5 px-4 py-3 text-[12px] font-semibold text-white/55">
                          传统分析工具
                        </div>
                        <div className="bg-white/5 px-4 py-3 text-[12px] font-semibold text-cyan-300">
                          QSX
                        </div>

                        <div className="border-t border-white/10 px-4 py-3 text-[12px] text-white/55">
                          预测价格涨跌
                        </div>
                        <div className="border-t border-white/10 px-4 py-3 text-[12px] text-white/80">
                          量化风险边界
                        </div>

                        <div className="border-t border-white/10 px-4 py-3 text-[12px] text-white/55">
                          单一指标分析
                        </div>
                        <div className="border-t border-white/10 px-4 py-3 text-[12px] text-white/80">
                          多维度数据融合
                        </div>

                        <div className="border-t border-white/10 px-4 py-3 text-[12px] text-white/55">
                          滞后的历史数据
                        </div>
                        <div className="border-t border-white/10 px-4 py-3 text-[12px] text-white/80">
                          实时市场结构监控
                        </div>

                        <div className="border-t border-white/10 px-4 py-3 text-[12px] text-white/55">
                          需要自己解读
                        </div>
                        <div className="border-t border-white/10 px-4 py-3 text-[12px] text-white/80">
                          直接给出建议
                        </div>
                      </div>

                      <div className="text-[12px] text-white/45">
                        注：本页仅展示“产品价值”，不暴露内部数据口径与模型细节。
                      </div>
                    </div>
                  </GlassCard>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-6 pb-20">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <GlassCard className="p-6">
              <div className="text-[14px] font-semibold text-white/85">
                量化风险边界
              </div>
              <div className="mt-2 text-[13px] leading-6 text-white/65">
                把复杂数据压缩成“可执行的风险边界”，让仓位管理变简单。
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="text-[14px] font-semibold text-white/85">
                结构性拐点提示
              </div>
              <div className="mt-2 text-[13px] leading-6 text-white/65">
                关注杠杆、流动性与结构变化，而不是追逐短周期噪声。
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="text-[14px] font-semibold text-white/85">
                风险报警分层
              </div>
              <div className="mt-2 text-[13px] leading-6 text-white/65">
                让“风险”从概念变成可见的等级与动作建议。
              </div>
            </GlassCard>
          </div>

          <div className="mt-10 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div>
              <div className="text-[14px] font-semibold text-white/85">
                先注册，再看今日风险与仓位建议
              </div>
              <div className="mt-1 text-[13px] text-white/55">
                免费会员即可体验核心“风险边界”输出。
              </div>
            </div>
            <div className="hidden w-56 lg:block">
              <PrimaryButton onClick={handleSignUp}>开始使用</PrimaryButton>
            </div>
            <div className="w-full lg:hidden">
              <div className="mt-4">
                <PrimaryButton onClick={handleSignUp}>开始使用</PrimaryButton>
              </div>
            </div>
          </div>
        </section>

        <footer className="mx-auto w-full max-w-7xl px-6 pb-10">
          <div className="flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
            <div className="text-[12px] text-white/40">
              © {new Date().getFullYear()} QSX. All rights reserved.
            </div>
            <div className="text-[12px] text-white/40">
              QSX —— 定义交易的风险边界。
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}