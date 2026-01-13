"use client";

import { TabBar } from "antd-mobile";
import { usePathname, useRouter } from "next/navigation";

const tabs = [
  { key: "/today", title: "今日", icon: "📊" },
  { key: "/radar", title: "雷达", icon: "📡" },
  { key: "/alerts", title: "报警", icon: "🔔" },
  { key: "/history", title: "历史", icon: "📜" },
  { key: "/ai", title: "AI", icon: "🤖" },
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

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-auto">{children}</div>
      <div className="border-t border-white/10 bg-black/80 backdrop-blur">
        <TabBar
          activeKey={mapActiveKey(pathname)}
          onChange={(key) => router.push(key)}
        >
          {tabs.map((tab) => (
            <TabBar.Item
              key={tab.key}
              icon={<span>{tab.icon}</span>}
              title={tab.title}
            />
          ))}
        </TabBar>
      </div>
    </div>
  );
}
