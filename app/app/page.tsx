import Link from "next/link";

export default function HomePage() {
  return (
    <main
      className="relative flex min-h-[100svh] w-full flex-col overflow-hidden"
      style={{
        paddingTop: "max(env(safe-area-inset-top), 16px)",
        paddingBottom: "max(env(safe-area-inset-bottom), 16px)",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 28%, rgba(59,130,246,0.32) 0%, rgba(8,16,38,0.92) 46%, #050816 100%)",
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 18% 22%, rgba(96,165,250,0.14) 0%, transparent 46%),
            radial-gradient(circle at 84% 74%, rgba(59,130,246,0.10) 0%, transparent 50%),
            radial-gradient(1.2px 1.2px at 12% 18%, rgba(219,234,254,0.62) 0%, transparent 1px),
            radial-gradient(1.2px 1.2px at 86% 20%, rgba(219,234,254,0.52) 0%, transparent 1px),
            radial-gradient(1.2px 1.2px at 22% 58%, rgba(219,234,254,0.58) 0%, transparent 1px),
            radial-gradient(1.2px 1.2px at 68% 42%, rgba(219,234,254,0.48) 0%, transparent 1px),
            radial-gradient(1.2px 1.2px at 78% 82%, rgba(219,234,254,0.52) 0%, transparent 1px),
            radial-gradient(1.2px 1.2px at 44% 34%, rgba(219,234,254,0.58) 0%, transparent 1px),
            radial-gradient(1.2px 1.2px at 92% 54%, rgba(219,234,254,0.42) 0%, transparent 1px)
          `,
          backgroundRepeat: "no-repeat",
          opacity: 0.9,
        }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[380px] flex-1 flex-col px-6">
        <div className="pt-20" />

        <div className="mt-12 text-center">
          <div
            className="mx-auto text-[44px] font-medium text-white/85"
            style={{ letterSpacing: "0.8px" }}
          >
            QuantscopeX
          </div>

          <div className="mt-6 mx-auto max-w-[320px] text-[18px] leading-[1.55] text-white/40">
            AI market risk intelligence,
            <br />
            built for daily decisions.
          </div>
        </div>

        <div className="flex-1" />

        <div className="pb-10">
          <div
            className="w-full rounded-[22px] p-[14px]"
            style={{
              background: "rgba(255,255,255,0.045)",
              border: "1px solid rgba(255,255,255,0.10)",
              boxShadow:
                "0 18px 44px rgba(0,0,0,0.48), 0 0 0 1px rgba(255,255,255,0.06) inset",
              backdropFilter: "blur(14px)",
            }}
          >
            <div className="grid grid-cols-2 gap-3">
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
                    "0 10px 24px rgba(43,111,255,0.26), 0 0 0 1px rgba(255,255,255,0.10) inset",
                }}
              >
                Enter App
              </Link>
            </div>

            <div className="mt-3 text-center text-[14px] text-white/45">
              Invite only
            </div>
          </div>

          <div className="mt-6 text-center text-[12px] text-white/30">
            Not investment advice. For informational purposes only.
          </div>
        </div>
      </div>
    </main>
  );
}
