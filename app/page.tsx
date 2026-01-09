import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6">
      {/* 蓝色深色渐变背景 + 星空效果 */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628] via-[#0d1f3c] to-[#1a2942]" />

      {/* 星空点缀效果 */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute left-[10%] top-[15%] h-1 w-1 rounded-full bg-blue-300 blur-[1px]" />
        <div className="absolute left-[20%] top-[25%] h-1.5 w-1.5 rounded-full bg-blue-200 blur-[1px]" />
        <div className="absolute left-[80%] top-[20%] h-1 w-1 rounded-full bg-blue-400 blur-[1px]" />
        <div className="absolute left-[70%] top-[40%] h-1 w-1 rounded-full bg-blue-300 blur-[1px]" />
        <div className="absolute left-[15%] top-[60%] h-1.5 w-1.5 rounded-full bg-blue-200 blur-[1px]" />
        <div className="absolute left-[85%] top-[70%] h-1 w-1 rounded-full bg-blue-300 blur-[1px]" />
        <div className="absolute left-[30%] top-[80%] h-1 w-1 rounded-full bg-blue-400 blur-[1px]" />
        <div className="absolute left-[60%] top-[85%] h-1.5 w-1.5 rounded-full bg-blue-200 blur-[1px]" />
      </div>

      {/* 主内容区 */}
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* 主标题 */}
        <h1 className="mb-6 text-[clamp(2.5rem,8vw,4rem)] font-light tracking-wide text-white">
          QuantscopeX
        </h1>

        {/* 副标题 */}
        <p className="mb-16 max-w-md text-[clamp(1rem,3vw,1.25rem)] font-light leading-relaxed text-gray-300">
          AI market risk intelligence,<br />built for daily decisions.
        </p>

        {/* 按钮组 */}
        <div className="flex flex-col gap-4 sm:flex-row">
          {/* 主按钮 - Enter App */}
          <Link
            href="/app"
            className="rounded-full bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] px-12 py-4 text-lg font-medium text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40 hover:scale-[1.02]"
          >
            Enter App
          </Link>

          {/* 次按钮 - Sign in */}
          <Link
            href="/signin"
            className="rounded-full border border-white/20 bg-white/5 px-12 py-4 text-lg font-medium text-white backdrop-blur-sm transition-all hover:border-white/30 hover:bg-white/10"
          >
            Sign In
          </Link>
        </div>

        {/* Invite only 提示 */}
        <p className="mt-6 text-sm text-gray-400">
          Invite only
        </p>
      </div>

      {/* 底部免责声明 */}
      <div className="absolute bottom-8 left-0 right-0 z-10 px-6 text-center">
        <p className="text-xs text-gray-500">
          Not investment advice. For informational purposes only.
        </p>
      </div>
    </main>
  );
}
