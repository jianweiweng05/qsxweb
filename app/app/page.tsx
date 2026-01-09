import Link from "next/link";

export default function HomePage() {
  return (
    <main
      className="relative flex min-h-[100svh] w-full flex-col overflow-hidden"
      style={{
        paddingTop: "max(env(safe-area-inset-top), 18px)",
        paddingBottom: "max(env(safe-area-inset-bottom), 18px)",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 25%, rgba(59,130,246,0.28) 0%, rgba(8,16,38,0.92) 46%, #050816 100%)",
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 18% 22%, rgba(96,165,250,0.14) 0%, transparent 45%),
            radial-gradient(circle at 82% 72%, rgba(59,130,246,0.10) 0%, transparent 48%),
            radial-gradient(1.2px 1.2px at 12% 18%, rgba(219,234,254,0.65) 0%, transparent 1px),
            radial-gradient(1.2px 1.2px at 86% 20%, rgba(219,234,254,0.55) 0%, transparent 1px),
            radial-gradient(1.2px 1.2px at 22% 58%, rgba(219,234,254,0.60) 0%, transparent 1px),
            radial-gradient(1.2px 1.2px at 68% 42%, rgba(219,234,254,0.50) 0%, transparent 1px),
            radial-gradient(1.2px 1.2px at 78% 82%, rgba(219,234,254,0.55) 0%, transparent 1px),
            radial-gradient(1.2px 1.2px at 44% 34%, rgba(219,234,254,0.60) 0%, transparent 1px),
            radial-gradient(1.2px 1.2px at 92% 54%, rgba(219,234,254,0.45) 0%, transparent 1px)
          `,
          backgroundRepeat: "no-repeat",
          opacity: 0.9,
        }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[380px] flex-1 flex-col px-6">
        <div className="pt-16" />

        <div className="mt-10 text-center">
          <div className="mx-auto mb-16 inline-flex items-center justify-center">
            <div
              className="text-[40px] font-medium tracking-[0.6px] text-white/85"
              style={{ letterSpacing: "0.8px" }}
            >
              QuantscopeX
            </div>
          </div>

          <div className="mx-auto max-w-[320px] text-[18px] leading-[1.55] text-white/45">
            AI market risk intelligence,
            <br />
            built for daily decisions.
          </div>
        </div>

        <div className="flex-1" />

        <div className="pb-6">
          <div
            className="w-full rounded-[22px] p-[14px]"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.10)",
              boxShadow:
                "0 18px 40px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.06) inset",
              backdropFilter: "blur(14px)",
            }}
          >
            <div className="grid grid-cols-2 gap-12">
              <Link
                href="/signin"
                className="flex h-[54px] items-center justify-center rounded-[16px] text-[17px] font-semibold text-white/85 transition active:scale-[0.99]"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              >
                Sign In
              </Link>

              <Link
                href="/app"
                className="flex h-[54px] items-center justify-center rounded-[16px] text-[17px] font-semibold text-white transition active:scale-[0.99]"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(43,111,255,0.92) 0%, rgba(104,182,255,0.92) 100%)",
                  boxShadow:
                    "0 10px 24px rgba(43,111,255,0.28), 0 0 0 1px rgba(255,255,255,0.10) inset",
                }}
              >
                Enter App
              </Link>
            </div>

            <div className="mt-12 text-center text-[14px] text-white/45">
              Invite only
            </div>
          </div>

          <div className="mt-12 text-center text-[12px] text-white/30">
            Not investment advice. For informational purposes only.
          </div>
        </div>
      </div>
    </main>
  );
}
