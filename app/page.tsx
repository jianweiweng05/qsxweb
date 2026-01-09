import Link from 'next/link';

export default function HomePage() {
  return (
    <main
      className="relative flex min-h-[100svh] min-h-[100vh] flex-col items-center justify-center overflow-hidden"
      style={{
        paddingTop: 'max(env(safe-area-inset-top), 20px)',
        paddingBottom: 'max(env(safe-area-inset-bottom), 20px)',
        paddingLeft: '24px',
        paddingRight: '24px',
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, #1e3a8a 0%, #0c1e3f 40%, #050b1a 100%)',
        }}
      />

      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(96, 165, 250, 0.12) 0%, transparent 50%),
            radial-gradient(1px 1px at 15% 20%, rgba(147, 197, 253, 0.8) 0%, transparent 1px),
            radial-gradient(1px 1px at 85% 25%, rgba(147, 197, 253, 0.6) 0%, transparent 1px),
            radial-gradient(1px 1px at 25% 60%, rgba(147, 197, 253, 0.7) 0%, transparent 1px),
            radial-gradient(1px 1px at 70% 80%, rgba(147, 197, 253, 0.6) 0%, transparent 1px),
            radial-gradient(1px 1px at 50% 45%, rgba(147, 197, 253, 0.8) 0%, transparent 1px),
            radial-gradient(1px 1px at 90% 55%, rgba(147, 197, 253, 0.5) 0%, transparent 1px)
          `,
          backgroundSize: '100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%',
          backgroundRepeat: 'no-repeat',
        }}
      />

      <div className="relative z-10 flex w-full max-w-[420px] flex-col items-center text-center md:max-w-[560px]">
        <div className="mb-3 text-[17px] font-medium tracking-[0.3px] text-white/90">
          QuantscopeX
        </div>

        <h1
          className="mb-3 font-bold leading-[1.1] tracking-tight text-white"
          style={{
            fontSize: 'clamp(34px, 6vw, 44px)',
            fontWeight: 700,
          }}
        >
          See Market Risk<br />Before Price Moves
        </h1>

        <p
          className="mb-6 max-w-[340px] text-[15px] leading-[1.5] text-white/75"
        >
          AI-powered regime & risk intelligence for crypto markets.
        </p>

        <div className="flex w-full flex-col gap-3">
          <Link
            href="/app"
            className="flex h-[54px] w-full items-center justify-center rounded-[15px] text-[17px] font-semibold text-white shadow-lg transition-all active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, #2b6fff 0%, #68b6ff 100%)',
              boxShadow: '0 4px 16px rgba(43, 111, 255, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
            }}
          >
            Enter App
          </Link>

          <Link
            href="/signin"
            className="flex h-[54px] w-full items-center justify-center rounded-[15px] text-[17px] font-semibold text-white backdrop-blur-sm transition-all active:scale-[0.98]"
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
            }}
          >
            Sign In
          </Link>

          <p className="mt-1 text-[13px] text-white/65">
            Invite only
          </p>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 z-10 text-center text-[12px] text-white/40"
        style={{
          paddingBottom: 'max(env(safe-area-inset-bottom), 20px)',
        }}
      >
        Not investment advice.
      </div>
    </main>
  );
}
