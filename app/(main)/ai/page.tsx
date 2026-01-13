import { ProGate } from "@/app/lib/gate";

export const dynamic = "force-dynamic";

export default function AIPage() {
  return (
    <div className="p-4 text-white min-h-full bg-black/90">
      <h1 className="text-xl font-bold mb-4">AI 助手</h1>
      <div className="lg:grid lg:grid-cols-2 lg:gap-6">
        {/* 左列：主问答区 */}
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="text-white/50">基础问答（免费）</div>
          </div>
          <div className="text-sm text-white/50 mb-2">深度解读 / 策略生成</div>
          <ProGate>
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="text-white/50">Pro 策略生成（占位）</div>
            </div>
          </ProGate>
        </div>
        {/* 右列：AI 说明 */}
        <div className="mt-4 lg:mt-0 p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="text-sm text-white/50 mb-1">AI 助手说明</div>
          <div className="text-sm text-white/70">桌面端可查看更多 AI 功能详情</div>
        </div>
      </div>
    </div>
  );
}
