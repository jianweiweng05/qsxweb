// QA System Self-Test Script
// Set tier to PRO for testing
process.env.NEXT_PUBLIC_QSX_TIER = 'PRO';

const tests = [
  // 场景 1：垃圾输入
  { id: 1, q: "12345", expect: "invalid" },
  { id: 2, q: "？？？？？", expect: "invalid" },
  { id: 3, q: "aaa", expect: "invalid" },
  { id: 4, q: "😀😀😀", expect: "invalid" },
  
  // 场景 2：小白基础
  { id: 5, q: "L3 是什么", expect: "kb:l3" },
  { id: 6, q: "RR25 怎么看", expect: "kb:rr25" },
  { id: 7, q: "风险预算是啥", expect: "kb:risk_cap" },
  { id: 8, q: "仓位规则", expect: "kb:risk_budget_formula" },
  
  // 场景 3：资深逻辑（LLM 或 API 不可用）
  { id: 9, q: "为什么 L1 走强但 L3 费率下降", expect: "llm_or_unavailable" },
  { id: 10, q: "当前 Gamma 释放状态对 Risk Cap 有何影响", expect: "llm_or_unavailable" },
  { id: 11, q: "L2 资金流入但 L5 情绪恐惧如何解读", expect: "llm_or_unavailable" },
  { id: 12, q: "L1 和 L6 背离的原因是什么", expect: "llm_or_unavailable" },
  
  // 场景 4：销售/售后
  { id: 13, q: "多少钱", expect: "kb:sub_upgrade" },
  { id: 14, q: "取消订阅", expect: "kb:sub_cancel" },
  { id: 15, q: "你们厉害吗", expect: "kb:advantage" },
  { id: 16, q: "怎么升级到 PRO", expect: "kb:sub_upgrade" },
  
  // 场景 5：边缘案例
  { id: 17, q: "RR25 是什么", expect: "kb:rr25", repeat: 3 },
  { id: 18, q: "L1 怎么样", expect: "blocked:no_llm_match" },
  { id: 19, q: "今天策略建议", expect: "blocked:pro_only" },
  { id: 20, q: "你好", expect: "greeting" },
];

async function runTest(test) {
  const res = await fetch("http://localhost:3000/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: test.q }),
  });
  
  const contentType = res.headers.get("content-type") || "";
  
  if (contentType.includes("text/event-stream")) {
    return { type: "llm", text: "[Stream]" };
  } else {
    return await res.json();
  }
}

async function main() {
  console.log("=== QA System Self-Test ===\n");
  
  for (const test of tests) {
    const repeat = test.repeat || 1;
    
    for (let i = 0; i < repeat; i++) {
      const result = await runTest(test);
      const pass = 
        (test.expect === "llm_or_unavailable" && (result.type === "llm" || (result.type === "blocked" && result.text?.includes("AI 服务")))) ||
        (test.expect === "llm" && result.type === "llm") ||
        (test.expect === "invalid" && result.type === "blocked" && result.reason === "invalid") ||
        (test.expect === "greeting" && result.type === "blocked" && result.reason === "greeting") ||
        (test.expect.startsWith("kb:") && result.type === "kb" && result.source_id === test.expect.split(":")[1]) ||
        (test.expect.startsWith("blocked:") && result.type === "blocked" && result.reason === test.expect.split(":")[1]);
      
      const status = pass ? "✅" : "❌";
      const suffix = repeat > 1 ? ` (${i+1}/${repeat})` : "";
      
      console.log(`${status} #${test.id}${suffix}: "${test.q}"`);
      console.log(`   Expected: ${test.expect}`);
      console.log(`   Got: ${result.type}${result.source_id ? `:${result.source_id}` : ""}${result.reason ? `:${result.reason}` : ""}`);
      
      if (!pass) {
        console.log(`   Text: ${result.text?.substring(0, 80)}...`);
      }
      console.log();
      
      await new Promise(r => setTimeout(r, 100));
    }
  }
}

main().catch(console.error);
