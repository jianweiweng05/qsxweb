import RadarClient from "./client";

export const dynamic = "force-dynamic";

export default function RadarPage() {
  return (
    <div className="p-4 text-white min-h-full bg-black/90">
      <h1 className="text-xl font-bold mb-4">雷达</h1>
      <RadarClient />
    </div>
  );
}
