"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Activity, Radar, Bell, Box, User } from "lucide-react";
import { FloatingAIBubble } from "./floating-ai-bubble";
import { getLanguage, translations, type Language } from "@/app/lib/i18n";
import { ReportProvider } from "./report-provider";

const getTabs = (lang: Language) => [
  { key: "/today", title: translations[lang].today, Icon: Activity },
  { key: "/radar", title: translations[lang].dataCenter, Icon: Radar },
  { key: "/toolbox", title: translations[lang].pro, Icon: Box },
];

function mapActiveKey(pathname: string, tabs: any[]): string {
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
  const [lang, setLang] = useState<Language>("zh");
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([]);

  useEffect(() => {
    setLang(getLanguage());
  }, []);

  const t = translations[lang];
  const tabs = getTabs(lang);
  const activeKey = mapActiveKey(pathname, tabs);

  const unreadAlerts = 3;

  return (
    <ReportProvider>
      <div className="min-h-screen flex flex-col bg-black">
        {/* 顶部导航栏 */}
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur-sm">
          <div className="mx-auto w-full max-w-[1600px] 2xl:max-w-[1760px] h-14 flex items-center justify-between px-4 lg:px-6">
            <button
              onClick={() => router.push("/account")}
              className={`flex items-center gap-2 transition-colors ${
                activeKey === "/account" ? "text-cyan-400" : "text-zinc-400 hover:text-zinc-300"
              }`}
            >
              <User size={20} strokeWidth={1.5} />
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
            </button>
          </div>
        </header>

        {/* 内容区 */}
        <main className="flex-1 flex justify-center pt-14 pb-14">
          <div className="w-full max-w-[1600px] 2xl:max-w-[1760px] px-4 lg:px-6">
            {children}
          </div>
        </main>

        {/* 底部导航 */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/90 backdrop-blur-sm">
          <div className="mx-auto w-full max-w-[1600px] 2xl:max-w-[1760px] h-14 flex items-center justify-around px-2">
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

        <FloatingAIBubble messages={messages} setMessages={setMessages} />
      </div>
    </ReportProvider>
  );
}