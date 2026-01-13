import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function SubscribeSuccessPage({ searchParams }: { searchParams: Promise<{ plan?: string }> }) {
  const { plan } = await searchParams;
  const planName = plan === "max" ? "Max" : "Pro";
  return (
    <div className="p-4 text-white min-h-screen bg-black/90">
      <h1 className="text-xl font-bold mb-4">订阅成功</h1>
      <div className="p-4 rounded-lg bg-white/5 border border-white/10 mb-4">
        <div className="text-white/70">你的 {planName} 权限已生效</div>
      </div>
      <Link href="/today" className="inline-block px-4 py-2 bg-blue-600 rounded-lg text-sm">返回今日决策</Link>
    </div>
  );
}
