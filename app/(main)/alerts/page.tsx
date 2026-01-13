import { getReportPayload } from "@/app/lib/qsx_api";

export default async function AlertsPage() {
  const payload = await getReportPayload();
  const redCount = payload.red_summary?.red_count ?? 0;

  return (
    <div className="p-4 text-white min-h-full bg-black/90">
      <h1 className="text-xl font-bold mb-4">报警</h1>
      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
        <div className="text-sm text-white/50 mb-1">红色警报数量</div>
        <div className="text-2xl font-bold text-red-400">{redCount}</div>
      </div>
    </div>
  );
}
