import { NextResponse } from "next/server";

const API_URL = "https://qsx-ai.onrender.com/macro/v1/report_payload";

export async function GET() {
  try {
    const res = await fetch(API_URL, {
      next: { revalidate: 300 } // 5分钟缓存
    });
    if (!res.ok) {
      return NextResponse.json({ error: "API_ERROR" }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    console.error("[API_REPORT_ERROR]", e);
    return NextResponse.json({ error: "NETWORK_ERROR" }, { status: 500 });
  }
}
