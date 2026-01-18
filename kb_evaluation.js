const fs = require('fs');
const path = require('path');

// Load KB files
const kbPath = './app/lib/kb';
const status = JSON.parse(fs.readFileSync(path.join(kbPath, 'status.json'), 'utf8'));
const rules = JSON.parse(fs.readFileSync(path.join(kbPath, 'rules.json'), 'utf8'));
const terms = JSON.parse(fs.readFileSync(path.join(kbPath, 'terms.json'), 'utf8'));
const constitution = JSON.parse(fs.readFileSync(path.join(kbPath, 'constitution.json'), 'utf8'));
const templates = JSON.parse(fs.readFileSync(path.join(kbPath, 'templates.json'), 'utf8'));
const p0patch = JSON.parse(fs.readFileSync(path.join(kbPath, 'kb_p0_patch.json'), 'utf8'));
const termsSupplement = JSON.parse(fs.readFileSync(path.join(kbPath, 'terms_supplement.json'), 'utf8'));

// Combine all entries
const allEntries = [
  ...status.entries,
  ...rules.entries,
  ...constitution.entries,
  ...templates.entries,
  ...p0patch.entries,
  ...terms.terms.map(t => ({...t, triggers: t.triggers || []})),
  ...termsSupplement.terms.map(t => ({...t, triggers: t.triggers || []}))
];

// Test questions by category
const testQuestions = {
  "市场状态与风险": [
    "现在市场怎么样？", "市场状态是什么", "今天市场偏多还是偏空", "当前是牛市还是熊市",
    "市场震荡吗", "现在适合进攻吗", "市场方向不明怎么办", "整体状态如何", "今天市场趋势",
    "当前风险大吗", "会不会大跌", "最大的风险是什么", "系统性风险高吗", "暴跌风险",
    "需要警惕什么", "最怕什么风险", "风险在哪", "环境风险", "杠杆风险大吗", "结构性风险",
    "现在有多确定", "判断准不准", "靠谱吗", "会不会错", "确定性高吗", "容易被打脸吗",
    "你有多确定", "这个判断可信吗", "准确率多少", "胜率怎么样"
  ],
  "仓位控制": [
    "仓位怎么控制", "建议仓位多少", "现在仓位", "可以加仓吗", "要不要减仓",
    "轻仓是多少", "满仓合适吗", "仓位上限", "Risk Cap怎么用", "20%是让我开20%吗",
    "仓位红线", "该开多少仓", "仓位比例", "风险预算", "仓位规则",
    "怎么配置仓位", "仓位怎么算", "加仓策略", "减仓策略", "分批加仓",
    "仓位管理", "持仓比例", "风险暴露", "最大仓位", "安全仓位",
    "仓位控制原则", "动态仓位", "仓位调整", "仓位分配", "合理仓位"
  ],
  "交易决策": [
    "现在能交易吗", "适合观望吗", "还能不能参与", "现在能不能做", "适合短线吗",
    "要不要试错", "顺势交易", "逆势抄底", "现在该做什么", "能不能开仓",
    "买不买", "该不该买", "该不该卖", "给点位", "止盈止损",
    "目标价", "什么时候平仓", "抄底时机", "做多还是做空", "交易方向",
    "入场时机", "出场时机", "持仓还是平仓", "追涨杀跌", "高抛低吸",
    "波段操作", "日内交易", "长线持有", "短线进出", "网格交易"
  ],
  "信号冲突与层级": [
    "信号冲突怎么办", "信号打架", "互相矛盾", "不一致", "分歧很大",
    "到底听谁的", "L1看多L3看空", "六层不共振", "为什么一会这样一会那样", "层级优先级",
    "L1是什么", "L2是什么", "L3是什么", "L4是什么", "L5是什么",
    "L6是什么", "环境层", "资金层", "衍生品层", "链上层",
    "情绪层", "结构层", "六层怎么看", "层级权重", "哪层最重要",
    "多层分析", "层级裁决", "共振信号", "背离信号", "层级冲突"
  ],
  "指标与数据": [
    "RR25是什么", "资金费率", "Funding", "多空比", "LS",
    "ETF净流入", "ETF_D", "ETF_7DMA", "恐惧贪婪指数", "FGI",
    "波动状态", "Gamma", "MVRV", "SOPR", "持仓量",
    "OI", "隐含波动率", "IV", "成本区", "链上数据",
    "实时吗", "数据延迟", "asof", "更新频率", "多久更新",
    "数据源", "数据准确吗", "时间戳", "数据滞后", "不是最新"
  ],
  "历史相似性": [
    "历史相似度", "相似性", "相似度怎么用", "80%相似", "像哪次行情",
    "历史对比", "相似案例", "HCRI", "top3相似", "历史复刻",
    "会不会复制历史", "相似度是预测吗", "相似环境", "历史参考", "相似度高",
    "历史回溯", "过往案例", "类似行情", "历史重演", "相似阶段",
    "环境识别", "历史匹配", "相似度分析", "历史对标", "参考案例",
    "历史经验", "相似度意义", "历史借鉴", "案例研究", "历史规律"
  ],
  "报警系统": [
    "报警是什么", "红色报警", "黄色报警", "报警怎么理解", "红警怎么办",
    "报警是信号吗", "报警要不要做空", "报警要不要平仓", "报警数量", "报警层级",
    "报警原因", "报警触发", "报警处理", "报警响应", "多个报警",
    "报警优先级", "报警严重吗", "报警频繁", "报警消除", "报警持续",
    "报警历史", "报警趋势", "报警分析", "报警意义", "报警机制",
    "报警阈值", "报警规则", "报警逻辑", "报警准确吗", "报警误报"
  ],
  "系统理解": [
    "系统是什么", "QSX", "这是啥", "干什么的", "怎么用",
    "能预测吗", "会涨吗", "会跌吗", "准确率", "系统优势",
    "好在哪", "值吗", "凭什么", "牛在哪", "怎么样",
    "权重怎么来的", "算法", "模型细节", "公式", "参数",
    "内部逻辑", "计算方法", "为什么这样算", "依据是什么", "原理",
    "免责声明", "风险提示", "不构成投资建议", "法律", "责任"
  ],
  "会员与订阅": [
    "会员权益", "VIP", "Pro", "Free", "权限",
    "多少钱", "价格", "订阅", "升级", "付费",
    "怎么买", "开通", "取消订阅", "退订", "退款",
    "不想用了", "Pro有什么用", "Pro值不值", "VIP和Pro区别", "买Pro好处",
    "会员对比", "套餐选择", "订阅方式", "支付方式", "到账时间",
    "续费", "优惠", "折扣", "试用", "体验"
  ]
};

// Matching function
function findMatch(question) {
  const q = question.toLowerCase();
  let bestMatch = null;
  let bestScore = 0;

  for (const entry of allEntries) {
    if (!entry.triggers) continue;

    for (const trigger of entry.triggers) {
      if (q.includes(trigger.toLowerCase())) {
        const score = trigger.length / q.length;
        if (score > bestScore) {
          bestScore = score;
          bestMatch = entry;
        }
      }
    }
  }

  return { match: bestMatch, score: bestScore };
}

// Evaluate
const results = {};
let totalQuestions = 0;
let totalMatched = 0;
let totalHighConfidence = 0;

for (const [category, questions] of Object.entries(testQuestions)) {
  const categoryResults = [];

  for (const question of questions) {
    const { match, score } = findMatch(question);
    const matched = match !== null;
    const highConfidence = score > 0.3;

    totalQuestions++;
    if (matched) totalMatched++;
    if (highConfidence) totalHighConfidence++;

    categoryResults.push({
      question,
      matched,
      score: score.toFixed(3),
      matchedEntry: match ? match.id : 'NONE',
      category: match ? match.cat : 'N/A'
    });
  }

  results[category] = categoryResults;
}

// Generate report
const report = {
  summary: {
    totalQuestions,
    totalMatched,
    totalHighConfidence,
    matchRate: (totalMatched / totalQuestions * 100).toFixed(1) + '%',
    highConfidenceRate: (totalHighConfidence / totalQuestions * 100).toFixed(1) + '%'
  },
  byCategory: {}
};

for (const [category, categoryResults] of Object.entries(results)) {
  const matched = categoryResults.filter(r => r.matched).length;
  const highConf = categoryResults.filter(r => parseFloat(r.score) > 0.3).length;

  report.byCategory[category] = {
    total: categoryResults.length,
    matched,
    highConfidence: highConf,
    matchRate: (matched / categoryResults.length * 100).toFixed(1) + '%',
    highConfidenceRate: (highConf / categoryResults.length * 100).toFixed(1) + '%',
    details: categoryResults
  };
}

// Output
fs.writeFileSync('kb_evaluation_report.json', JSON.stringify(report, null, 2));
console.log('=== KB评估报告 ===\n');
console.log(`总问题数: ${report.summary.totalQuestions}`);
console.log(`命中数: ${report.summary.totalMatched}`);
console.log(`高置信命中: ${report.summary.totalHighConfidence}`);
console.log(`总命中率: ${report.summary.matchRate}`);
console.log(`高置信率: ${report.summary.highConfidenceRate}\n`);

console.log('=== 分类统计 ===\n');
for (const [cat, data] of Object.entries(report.byCategory)) {
  console.log(`【${cat}】`);
  console.log(`  问题数: ${data.total}`);
  console.log(`  命中率: ${data.matchRate}`);
  console.log(`  高置信率: ${data.highConfidenceRate}`);
  console.log(`  未命中: ${data.total - data.matched}题\n`);
}

console.log('\n详细报告已保存至: kb_evaluation_report.json');
