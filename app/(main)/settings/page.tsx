import Link from "next/link";

export const dynamic = "force-dynamic";

export default function SettingsPage() {
  return (
    <div className="p-4 text-white min-h-full bg-black/90">
      <h1 className="text-xl font-bold mb-4">设置</h1>

      <div className="space-y-4">
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">语言</div>
              <div className="text-sm text-white/50">选择界面语言</div>
            </div>
            <div className="text-white/50">简体中文</div>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">时区</div>
              <div className="text-sm text-white/50">设置显示时区</div>
            </div>
            <div className="text-white/50">UTC+8</div>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">通知</div>
              <div className="text-sm text-white/50">管理推送通知</div>
            </div>
            <div className="text-white/50">已开启</div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Link href="/account" className="text-sm text-white/50 underline">
          返回账户
        </Link>
      </div>
    </div>
  );
}
