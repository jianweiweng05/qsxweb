import Link from "next/link";

export default function HomePage() {
  return (
    <main
      className="relative min-h-[100svh] min-h-[100vh] w-full overflow-hidden bg-[#05080f]"
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {/* 1. 深度背景层：还原截图中的极深邃底色 */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "radial-gradient(circle at 50% 40%, #0a1122 0%, #05080f 100%)",
        }}
      />

      {/* 2. 星云质感层：使用混合径向渐变模拟图中那种不规则的幽蓝色雾气 */}
      <div
        className="absolute inset-0 z-0 opacity-60"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(41, 98, 255, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(29, 78, 216, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 50% 80%, rgba(30, 58, 138, 0.2) 0%, transparent 60%)
          `,
          filter: "blur(60px)",
        }}
      />

      {/* 3. 繁星点缀层：还原背景中细碎的星光感 */}
      <div
        className="absolute inset-0 z-0 opacity-40"
        style={{
          backgroundImage: `
            radial-gradient(1px 1px at 10% 10%, #fff 100%, transparent 0),
            radial-gradient(1px 1px at 25% 35%, #fff 100%, transparent 0),
            radial-gradient(1.2px 1.2px at 50% 50%, #fff 100%, transparent 0),
            radial-gradient(1px 1px at 85% 20%, #fff 100%, transparent 0),
            radial-gradient(1px 1px at 75% 85%, #fff 100%, transparent 0),
            radial-gradient(1.5px 1.5px at 30% 75%, #fff 100%, transparent 0)
          `,
          backgroundSize: "250px 250px",
        }}
      />

      {/* 4. 内容主体 */}
      <div
        className="relative z-10 flex min-h-[100svh] min-h-[100vh] w-full flex-col px-8"
        style={{
          paddingTop: "max(env(safe-area-inset-top), 24px)",
          paddingBottom: "max(env(safe-area-inset-bottom), 24px)",
        }}
      >
        <div className="flex flex-1 flex-col items-center justify-center">
          {/* Logo：还原图中那个青绿色的四角星标 */}
          <div className="mb-10 flex items-center justify-center">
            <svg width="56" height="56" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M20 2C20 2 21.5 14.5 25 18C28.5 21.5 41 23 41 23C41 23 28.5 24.5 25 28C21.5 31.5 20 44 20 44C20 44 18.5 31.5 15 28C11.5 24.5 -1 23 -1 23C-1 23 11.5 21.5 15 18C18.5 14.5 20 2 20 2Z" 
                fill="#36e2b2" 
                style={{ filter: 'drop-shadow(0 0 12px rgba(54,226,178,0.8))' }}
              />
            </svg>
          </div>

          <div className="w-full max-w-[400px] text-center">
            {/* 标题：还原字体粗细与间距 */}
            <h1 className="mb-4 text-[42px] font-bold tracking-tight text-white md:text-[48px]">
              QuantscopeX
            </h1>

            {/* 副标题：还原文案与颜色透明度 */}
            <p className="mx-auto mb-14 max-w-[280px] text-[17px] leading-[1.4] text-white/60">
              AI market risk intelligence,
              <br />
              built for daily decisions.
            </p>

            <div className="flex w-full flex-col gap-4">
              {/* Sign Up 按钮：亮蓝色垂直渐变还原 */}
              <Link
                href="/app"
                className="flex h-[58px] w-full items-center justify-center rounded-[14px] text-[17px] font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
                style={{
                  background: "linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%)",
                  boxShadow: "0 4px 20px rgba(29, 78, 216, 0.4)",
                }}
              >
                Sign Up
              </Link>

              {/* Sign In 按钮：深色雾面质感还原 */}
              <Link
                href="/signin"
                className="flex h-[58px] w-full items-center justify-center rounded-[14px] text-[17px] font-semibold text-white transition-all hover:bg-white/[0.08] active:scale-[0.98]"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  backdropFilter: "blur(10px)",
                }}
              >
                Sign In
              </Link>

              {/* 邀请制提示 */}
              <div className="mt-3 text-[14px] font-medium text-white/30">
                Invite only
              </div>
            </div>
          </div>
        </div>

        {/* 底部免责声明 */}
        <div className="pb-4 text-center text-[12px] tracking-wide text-white/20 uppercase">
          Not investment advice.
        </div>
      </div>
    </main>
  );
}
