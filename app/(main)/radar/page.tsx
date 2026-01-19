"use client";

import RadarClient from "./client";

export default function RadarPage() {
  return (
    <div className="p-4 text-white min-h-full bg-black/90">
      <h1 className="text-xl font-bold mb-4">数据中心</h1>
      <RadarClient />
    </div>
  );
}
