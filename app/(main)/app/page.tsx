"use client";

import Link from "next/link";

export default function AppPage() {
  return (
    <main
      className="relative min-h-[100svh] min-h-[100vh] w-full overflow-hidden"
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, #1e3a8a 0%, #0c1e3f 42%, #050b1a 100%)",
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 18% 28%, rgba(59,130,246,0.18) 0%, transparent 52%),
            radial-gradient(circle at 82% 72%, rgba(96,165,250,0.14) 0%, transparent 54%),
            radial-gradient(circle at 50% 90%, rgba(37,99,235,0.10) 0%, transparent 58%),
            radial-gradient(1px 1px at 14% 22%, rgba(147,197,253,0.85) 0%, transparent 1px),
            radial-gradient(1px 1px at 86% 26%, rgba(147,197,253,0.70) 0%, transparent 1px),
            radial-gradient(1px 1px at 22% 64%, rgba(147,197,253,0.80) 0%, transparent 1px),
            radial-gradient(1px 1px at 74% 82%, rgba(147,197,253,0.65) 0%, transparent 1px),
            radial-gradient(1px 1px at 52% 46%, rgba(147,197,253,0.85) 0%, transparent 1px),
            radial-gradient(1px 1px at 92% 56%, rgba(147,197,253,0.60) 0%, transparent 1px)
          `,
          opacity: 0.55,
        }}
      />

      <div
        className="relative z-10 flex min-h-[100svh] min-h-[100vh] w-full flex-col"
        style={{
          paddingTop: "max(env(safe-area-inset-top), 16px)",
          paddingBottom: "max(env(safe-area-inset-bottom), 16px)",
          paddingLeft: "24px",
          paddingRight: "24px",
        }}
      >
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-[420px] text-center md:max-w-[560px]">
            <div className="mb-3 text-[17px] font-medium tracking-[0.3px] text-white/90">
              QuantscopeX
            </div>

            <h1
              className="mb-3 leading-[1.1] tracking-tight text-white"
              style={{
                fontSize: "clamp(34px, 6vw, 44px)",
                fontWeight: 720,
              }}
            >
              See Market Risk
              <br />
              Before Price Moves
            </h1>

            <p className="mx-auto mb-7 max-w-[360px] text-[15px] leading-[1.55] text-white/75">
              AI-powered regime & risk intelligence for crypto markets.
            </p>

            <div className="mx-auto flex w-full max-w-[420px] flex-col gap-3">
              <Link
                href="/landing"
                className="flex h-[56px] w-full items-center justify-center rounded-[16px] text-[17px] font-semibold text-white transition-all active:scale-[0.98]"
                style={{
                  background:
                    "linear-gradient(135deg, #2b6fff 0%, #68b6ff 100%)",
                  boxShadow:
                    "0 10px 26px rgba(43,111,255,0.28), 0 0 0 1px rgba(255,255,255,0.10) inset",
                }}
              >
                Back to Landing
              </Link>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <Link
                  href="/reports"
                  className="flex h-[48px] items-center justify-center rounded-[12px] text-[15px] font-medium text-white/90"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                >
                  Reports
                </Link>
                <Link
                  href="/alerts"
                  className="flex h-[48px] items-center justify-center rounded-[12px] text-[15px] font-medium text-white/90"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                >
                  Alerts
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
