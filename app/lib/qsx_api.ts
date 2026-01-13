// 数据层：统一 API 入口
const API_URL = "https://qsx-ai.onrender.com/macro/v1/report_payload";

export class ApiError extends Error {
  constructor(public code: "API_ERROR" | "NETWORK_ERROR", message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export async function getReportPayload(): Promise<any> {
  try {
    const res = await fetch(API_URL, { cache: "no-store" });
    if (!res.ok) {
      throw new ApiError("API_ERROR", `API returned ${res.status}`);
    }
    return await res.json();
  } catch (e) {
    console.error("[QSX_API_ERROR]", e);
    if (e instanceof ApiError) throw e;
    throw new ApiError("NETWORK_ERROR", String(e));
  }
}
