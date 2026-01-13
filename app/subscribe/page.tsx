import Link from "next/link";

export default async function SubscribePage({ searchParams }: { searchParams: Promise<{ plan?: string }> }) {
  const { plan } = await searchParams;
  const currentPlan = plan || "pro";
  return (
    <div className="p-4 text-white min-h-screen bg-black/90">
      <h1 className="text-xl font-bold mb-4">订阅 {plan || "Pro"}</h1>
      <div className="p-4 rounded-lg bg-white/5 border border-white/10 mb-4">
        <div className="text-white/50">这里将跳转 Stripe Checkout（占位）</div>
      </div>
      {/* DEV: 模拟订阅成功 */}
      <Link href={`/subscribe/success?plan=${currentPlan}`} className="inline-block px-4 py-2 bg-green-600 rounded-lg text-sm mr-2">模拟订阅成功</Link>
      <Link href="/pricing" className="inline-block px-4 py-2 bg-white/10 rounded-lg text-sm">返回方案</Link>
    </div>
  );
}
