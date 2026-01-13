// 数据层：统一 API 入口
const API_URL = "https://qsx-ai.onrender.com/macro/v1/report_payload";

// 本地 mock 数据，接口挂了也能用
const MOCK_DATA = {
  macro_state: "unknown",
  risk_cap: 0.5,
  ai_json: {
    one_liner: "数据加载失败，显示默认内容",
    market_comment: "请检查网络连接",
  },
  red_summary: {
    red_count: 0,
  },
  ui: {
    radar: null,
  },
};

export async function getReportPayload(): Promise<any> {
  try {
    const res = await fetch(API_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("API error");
    return await res.json();
  } catch {
    return MOCK_DATA;
  }
}
