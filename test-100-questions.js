/**
 * 100 问压力测试脚本
 * 测试 /api/chat 对裁决类问题的响应质量
 */

const questions = [
  // 一、市场状态 / 环境判断（1-20）
  "现在市场整体是什么状态？",
  "当前是偏多还是偏空环境？",
  "今天市场风险高不高？",
  "现在属于牛市、熊市还是震荡？",
  "市场是在反弹还是下跌中继？",
  "当前行情算不算极端？",
  "现在是趋势市还是区间市？",
  "市场是在筑底阶段吗？",
  "现在算不算危险阶段？",
  "当前环境适合激进还是保守？",
  "现在整体是顺风还是逆风？",
  "市场是在修复还是恶化？",
  "当前行情对普通交易者友好吗？",
  "市场是否进入高不确定性阶段？",
  "现在是情绪主导还是理性主导？",
  "当前环境适合试错吗？",
  "市场有没有明显方向？",
  "现在更像风险释放前还是之后？",
  "当前环境适合等待吗？",
  "市场是否进入高波动区间？",

  // 二、风险感知 / 风险来源（21-40）
  "当前最大的风险是什么？",
  "现在最怕发生什么情况？",
  "有没有系统性风险在积累？",
  "当前风险主要来自哪里？",
  "会不会突然出现大幅下跌？",
  "有没有类似历史大跌前的信号？",
  "现在是假反弹吗？",
  "当前风险是短期还是中期？",
  "现在的风险是显性的还是隐性的？",
  "风险是在上升还是下降？",
  "哪类人现在最容易亏钱？",
  "当前环境下最大的误判风险是什么？",
  "风险是否已经被市场充分计价？",
  "现在最需要防范的风险事件是什么？",
  "风险集中在情绪面还是资金面？",
  "有没有连锁风险的可能？",
  "当前是低风险高不确定，还是高风险低不确定？",
  "市场是否接近风险拐点？",
  "如果出问题，最可能从哪里开始？",
  "现在是否存在踩踏风险？",

  // 三、仓位管理 / 风险预算（41-60）
  "现在仓位应该怎么控制？",
  "建议总仓位控制在多少？",
  "当前环境适合满仓吗？",
  "什么情况下应该减仓？",
  "现在可以加仓吗？",
  "已有仓位需要调整吗？",
  "轻仓一般指多少比例？",
  "仓位太高会不会有风险？",
  "当前环境适合逐步建仓吗？",
  "现在更适合持仓还是空仓？",
  "如果已经套住了，仓位怎么处理？",
  "现在适合分批进场吗？",
  "当前环境适合提高风险暴露吗？",
  "仓位是否需要随行情动态调整？",
  "现在适合防守型仓位吗？",
  "重仓用户现在最应该做什么？",
  "小仓位用户现在该不该参与？",
  "当前环境适合扩大仓位吗？",
  "仓位控制的首要原则是什么？",
  "现在仓位管理最容易犯的错误是什么？",

  // 四、交易方式 / 策略选择（61-80）
  "现在适合做短线吗？",
  "当前环境更适合波段还是观望？",
  "顺势交易现在成功率高吗？",
  "逆势抄底现在靠谱吗？",
  "现在适合高频交易吗？",
  "低频策略现在合适吗？",
  "当前环境适合突破策略吗？",
  "震荡市现在该怎么交易？",
  "现在适合主动交易还是被动等待？",
  "当前环境适合激进策略吗？",
  "哪种交易方式现在风险最低？",
  "当前环境适合新手交易吗？",
  "现在适合提高交易频率吗？",
  "当前阶段适合试新策略吗？",
  "做趋势交易现在晚不晚？",
  "当前环境适合做套利吗？",
  "做交易现在最大的坑是什么？",
  "当前行情下最不适合什么策略？",
  "如果一定要交易，优先注意什么？",
  "当前阶段最合理的交易思路是什么？",

  // 五、验证 / 追问 / 信心管理（81-100）
  "和昨天相比有变化吗？",
  "当前状态一般会持续多久？",
  "过去类似行情通常怎么走？",
  "现在更像历史上的哪一类阶段？",
  "这种环境下机构通常怎么做？",
  "现在的判断有多确定？",
  "如果我什么都不做，会更安全吗？",
  "当前结论是否容易被打脸？",
  "什么时候算环境真正改善？",
  "如果风险下降，一般先出现什么变化？",
  "当前判断的核心依据是什么？",
  "现在适合等待确认信号吗？",
  "如果判断错了，最大的代价是什么？",
  "现在是忍耐期还是行动期？",
  "当前环境更适合保本还是博弈？",
  "现在的机会是否值得承担风险？",
  "当前环境下最重要的纪律是什么？",
  "什么时候应该重新评估判断？",
  "现在是否需要降低预期？",
  "当前阶段最合理的总体策略是什么？",
];

const categories = [
  { name: "市场状态/环境判断", range: [0, 20] },
  { name: "风险感知/风险来源", range: [20, 40] },
  { name: "仓位管理/风险预算", range: [40, 60] },
  { name: "交易方式/策略选择", range: [60, 80] },
  { name: "验证/追问/信心管理", range: [80, 100] },
];

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

async function testQuestion(q, idx) {
  const start = Date.now();
  try {
    const res = await fetch(`${BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: q }),
    });
    const latency = Date.now() - start;
    const data = await res.json();

    // 评分逻辑
    let score = 0;
    let tags = [];
    const text = data.text || "";

    if (data.type === "blocked" && data.reason === "upgrade") {
      // 被拦截要求升级 = 进入 LLM 路径，算通过
      score = 3;
      tags.push("LLM路径");
    } else if (data.type === "kb") {
      // KB 命中
      if (text.includes("【市场状态】") && text.includes("【仓位建议】")) {
        score = 5; // 完整四行裁决
        tags.push("完整裁决");
      } else if (text.includes("【") && text.includes("】")) {
        score = 4; // 部分裁决格式
        tags.push("部分裁决");
      } else {
        score = 2; // KB 但非裁决格式
        tags.push("百科回复");
      }
    } else if (data.type === "blocked") {
      if (data.reason === "no_match") {
        score = 1; // 兜底
        tags.push("未命中");
      } else {
        score = 0;
        tags.push("被拦截");
      }
    }

    return {
      idx: idx + 1,
      question: q,
      type: data.type,
      reason: data.reason || "-",
      score,
      tags: tags.join(","),
      latency,
      preview: text.slice(0, 80).replace(/\n/g, " "),
    };
  } catch (e) {
    return {
      idx: idx + 1,
      question: q,
      type: "error",
      reason: e.message,
      score: 0,
      tags: "错误",
      latency: Date.now() - start,
      preview: "",
    };
  }
}

async function runTest() {
  console.log("🚀 开始 100 问压力测试...\n");
  console.log(`目标: ${BASE_URL}/api/chat\n`);

  const results = [];
  for (let i = 0; i < questions.length; i++) {
    const r = await testQuestion(questions[i], i);
    results.push(r);
    const icon = r.score >= 4 ? "✅" : r.score >= 2 ? "⚠️" : "❌";
    console.log(`${icon} [${r.idx}] ${r.question.slice(0, 20)}... → ${r.type}/${r.reason} (${r.score}分)`);
  }

  // 统计
  console.log("\n" + "=".repeat(60));
  console.log("📊 测试结果汇总\n");

  const total = results.length;
  const avgScore = (results.reduce((s, r) => s + r.score, 0) / total).toFixed(2);
  const avgLatency = (results.reduce((s, r) => s + r.latency, 0) / total).toFixed(0);

  const scoreDistribution = [0, 0, 0, 0, 0, 0];
  results.forEach((r) => scoreDistribution[r.score]++);

  console.log(`总问题数: ${total}`);
  console.log(`平均得分: ${avgScore}/5`);
  console.log(`平均延迟: ${avgLatency}ms`);
  console.log(`\n得分分布:`);
  console.log(`  5分(完整裁决): ${scoreDistribution[5]} (${((scoreDistribution[5] / total) * 100).toFixed(1)}%)`);
  console.log(`  4分(部分裁决): ${scoreDistribution[4]} (${((scoreDistribution[4] / total) * 100).toFixed(1)}%)`);
  console.log(`  3分(LLM路径):  ${scoreDistribution[3]} (${((scoreDistribution[3] / total) * 100).toFixed(1)}%)`);
  console.log(`  2分(百科回复): ${scoreDistribution[2]} (${((scoreDistribution[2] / total) * 100).toFixed(1)}%)`);
  console.log(`  1分(未命中):   ${scoreDistribution[1]} (${((scoreDistribution[1] / total) * 100).toFixed(1)}%)`);
  console.log(`  0分(被拦截):   ${scoreDistribution[0]} (${((scoreDistribution[0] / total) * 100).toFixed(1)}%)`);

  // 分类统计
  console.log(`\n分类得分:`);
  for (const cat of categories) {
    const catResults = results.slice(cat.range[0], cat.range[1]);
    const catAvg = (catResults.reduce((s, r) => s + r.score, 0) / catResults.length).toFixed(2);
    const pass = catResults.filter((r) => r.score >= 4).length;
    console.log(`  ${cat.name}: ${catAvg}/5 (${pass}/${catResults.length} 通过)`);
  }

  // 问题清单
  const lowScoreItems = results.filter((r) => r.score <= 2);
  if (lowScoreItems.length > 0) {
    console.log(`\n⚠️ 低分问题 (≤2分) - 需优化:`);
    lowScoreItems.forEach((r) => {
      console.log(`  [${r.idx}] ${r.question} → ${r.type}/${r.reason}`);
    });
  }

  // 输出 CSV
  const csv = [
    "序号,问题,类型,原因,得分,标签,延迟ms,回复预览",
    ...results.map(
      (r) =>
        `${r.idx},"${r.question}",${r.type},${r.reason},${r.score},${r.tags},${r.latency},"${r.preview.replace(/"/g, '""')}"`
    ),
  ].join("\n");

  const fs = require("fs");
  fs.writeFileSync("test-100-results.csv", csv);
  console.log(`\n📁 详细结果已保存到 test-100-results.csv`);

  // 优化建议
  console.log("\n" + "=".repeat(60));
  console.log("💡 优化建议\n");

  if (scoreDistribution[1] + scoreDistribution[0] > 10) {
    console.log("1. 大量问题未命中 KB，建议扩充 status.json 的 triggers");
  }
  if (scoreDistribution[3] > 30) {
    console.log("2. 过多问题走 LLM 路径，建议增加 KB 覆盖减少 API 成本");
  }
  if (avgScore < 3.5) {
    console.log("3. 整体得分偏低，建议检查 DECISION_WORDS 和 JUDGEMENT_WORDS 覆盖");
  }

  // 具体 trigger 建议
  const missedKeywords = {};
  lowScoreItems.forEach((r) => {
    const words = r.question.match(/[\u4e00-\u9fa5]+/g) || [];
    words.forEach((w) => {
      if (w.length >= 2) missedKeywords[w] = (missedKeywords[w] || 0) + 1;
    });
  });
  const topMissed = Object.entries(missedKeywords)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  if (topMissed.length > 0) {
    console.log("\n建议添加到 triggers 的高频词:");
    topMissed.forEach(([w, c]) => console.log(`  "${w}" (出现 ${c} 次)`));
  }
}

runTest().catch(console.error);
