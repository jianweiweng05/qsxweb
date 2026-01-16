"use client";

import { usePathname, useRouter } from "next/navigation";
import { Activity, Radar, Bell, Clock, Bot, User } from "lucide-react";

const tabs = [
  { key: "/today", title: "今日", Icon: Activity },
  { key: "/radar", title: "雷达", Icon: Radar },
  { key: "/alerts", title: "报警", Icon: Bell },
  { key: "/history", title: "历史", Icon: Clock },
  { key: "/ai", title: "AI", Icon: Bot },
  { key: "/account", title: "我的", Icon: User },
];

function mapActiveKey(pathname: string): string {
  for (const tab of tabs) {
    if (pathname.startsWith(tab.key)) return tab.key;
  }
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

  // TODO: Replace with actual unread alerts count from your state/API
  const unreadAlerts = 3;

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-auto">{children}</div>
      <nav className="border-t border-white/10 bg-black/90 backdrop-blur-sm">
        <div className="flex justify-around items-center h-14">
          {tabs.map((tab) => {
            const isActive = activeKey === tab.key;
            const isAlerts = tab.key === "/alerts";
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
                <span className="relative">
                  <tab.Icon size={20} strokeWidth={1.5} />
                  {isAlerts && unreadAlerts > 0 && (
                    <span className="absolute -top-1 -right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </span>
                <span
                  className={`
                    text-[10px] mt-1 tracking-wide
                    ${isActive ? "font-medium opacity-100" : "font-normal opacity-60"}
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
