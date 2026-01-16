"use client";

import { usePathname, useRouter } from "next/navigation";
import { Activity, Radar, Bell, Wrench, User } from "lucide-react";

const tabs = [
  { key: "/today", title: "今日", Icon: Activity },
  { key: "/radar", title: "数据中心", Icon: Radar },
  { key: "/toolbox", title: "PRO", Icon: Wrench },
];

function mapActiveKey(pathname: string): string {
  for (const tab of tabs) {
    if (pathname.startsWith(tab.key)) return tab.key;
  }
  if (pathname.startsWith("/account")) return "/account";
  if (pathname.startsWith("/alerts")) return "/alerts";
  return "/today";
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const activeKey = mapActiveKey(pathname);

  const unreadAlerts = 3;

  return (
    <div className="min-h-screen flex flex-col bg-black">
      {/* 顶部导航栏 */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur-sm">
        <div className="mx-auto max-w-[1200px] h-14 flex items-center justify-between px-4">
          <button
            onClick={() => router.push("/account")}
            className={`flex items-center gap-2 transition-colors ${
              activeKey === "/account" ? "text-cyan-400" : "text-zinc-400 hover:text-zinc-300"
            }`}
          >
            <User size={20} strokeWidth={1.5} />
            <span className="text-sm">我的</span>
          </button>

          <button
            onClick={() => router.push("/alerts")}
            className={`flex items-center gap-2 transition-colors ${
              activeKey === "/alerts" ? "text-cyan-400" : "text-zinc-400 hover:text-zinc-300"
            }`}
          >
            <span className="relative">
              <Bell size={20} strokeWidth={1.5} />
              {unreadAlerts > 0 && (
                <span className="absolute -top-1 -right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </span>
            <span className="text-sm">报警</span>
          </button>
        </div>
      </header>

      {/* 内容区 */}
      <main className="flex-1 flex justify-center pt-14 pb-14">
        <div className="w-full max-w-[1200px] px-4">
          {children}
        </div>
      </main>

      {/* 底部导航 */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/90 backdrop-blur-sm">
        <div className="mx-auto max-w-[1200px] h-14 flex items-center justify-around px-2">
          {tabs.map((tab) => {
            const isActive = activeKey === tab.key;

            return (
              <button
                key={tab.key}
                onClick={() => router.push(tab.key)}
                className={`
                  relative flex flex-col items-center justify-center flex-1 h-full
                  transition-colors duration-150
                  ${isActive ? "text-cyan-400" : "text-zinc-500 hover:text-zinc-300"}
                `}
              >
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-cyan-400" />
                )}

                <tab.Icon size={20} strokeWidth={1.5} />

                <span
                  className={`
                    mt-1 text-[10px] tracking-wide
                    ${isActive ? "opacity-100 font-medium" : "opacity-60"}
                  `}
                >
                  {tab.title}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}