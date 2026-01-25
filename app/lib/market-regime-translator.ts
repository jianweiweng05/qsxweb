import type { Language } from './i18n';

// Market regime translations
const marketRegimeTranslations: Record<string, string> = {
  // Market regimes
  '牛市过热': 'Overheated Bull Market',
  '健康牛市': 'Healthy Bull Market',
  '震荡市': 'Oscillating Market',
  '熊市震荡': 'Bear Market Oscillation',
  '熊市恐慌': 'Bear Market Panic',

  // Market phases
  '底部吸筹': 'Accumulation at Lows',
  '过热拉升': 'Overheated Rally',
  '结构修复': 'Structural Recovery',
  '筑底震荡': 'Base Formation Range',
  '下行承压': 'Downside Pressure',

  // Gamma/Volatility - Suppressed category
  '波动压制': 'Suppressed Volatility',
  '下探': 'Downside Drift',
  '逼空': 'Short Squeeze Risk',
  '震荡': 'Range-Bound',

  // Gamma/Volatility - Expansion category
  '波动释放': 'Volatility Expansion',
  '防插针': 'Liquidation Risk',
  '防逼空': 'Short Squeeze Risk',
  '双向': 'Two-Way Volatility',

  // Global asset names
  '美股-标普': 'US Stocks - S&P',
  '美股-纳指': 'US Stocks - Nasdaq',
  '新兴市场': 'Emerging Markets',
  '大宗商品': 'Commodities',
  '数字资产': 'Digital Assets',
  '黄金': 'Gold',
  '美元': 'US Dollar',
  '现金': 'Cash',

  // Macro descriptions
  '流动性充裕': 'Ample Liquidity',
  '风险偏好强': 'Strong Risk Appetite',
  '配置风险资产': 'Allocate to Risk Assets',
  '流动性收紧': 'Tightening Liquidity',
  '风险偏好弱': 'Weak Risk Appetite',
  '规避风险资产': 'Avoid Risk Assets',

  // Strategy names
  '趋势跟随': 'Trend Following',
  '趋势回撤': 'Trend Retracement',
  '动量策略': 'Momentum Strategy',
  '区间震荡': 'Range Oscillation',
  '均值回归': 'Mean Reversion',
  '网格交易': 'Grid Trading',
  '波动率管理': 'Volatility Management',
  '波动率突破': 'Volatility Breakout',
  '去杠杆 / 捆挤清洗': 'Deleveraging / Squeeze Washout',
  '清算反转': 'Liquidation Reversal',

  // Strategy types
  '方向型': 'Directional',
  '非方向': 'Non-directional',
  '风控型': 'Risk Control',
  '条件方向': 'Conditional Directional',
  '结构型': 'Structural',

  // Pro Structural Insight - Structure Status (结构状态)
  '当前结构信息不足': 'Insufficient structural data',
  '震荡结构占主导，暂无趋势性合力': 'Range-dominant environment; no clear trend alignment',
  '风险定价偏防御，震荡中隐含尾部担忧': 'Defensive risk pricing; latent tail concerns within range',
  '资金驱动较集中，结构存在方向潜力': 'Flow concentration evident; directional potential building',
  '杠杆张力突出，结构更偏事件驱动': 'Elevated leverage tension; event-driven dynamics',
  '震荡结构占主导，内部张力存在': 'Range-dominant structure with internal tension',

  // Pro Structural Insight - Current Focus (当前注意)
  '保持观望，避免主观判断': 'Stay neutral; avoid discretionary bias',
  '资金与杠杆方向对冲，容易反复扫损': 'Flow and leverage misaligned; prone to whipsaws',
  '杠杆张力突出，注意结构性挤压风险': 'Elevated leverage tension; monitor squeeze risk',
  '风险保护偏强，注意波动放大时的被动调整': 'Defensive positioning elevated; expect reactive volatility',
  '风险约束偏紧，注意仓位与回撤控制': 'Risk constraints elevated; manage exposure and drawdown',
  '结构仍在磨合，注意节奏控制': 'Structural alignment still evolving; manage timing',

  // Pro Structural Insight - Outlook Reference (后市参考)
  '等待数据完整': 'Await further data confirmation',
  '缺乏稳定历史映射，等待信号收敛': 'No stable historical analogue; await signal convergence',
  '历史上多表现为区间消化与反复试探': 'Historically characterized by range digestion and repeated probing',
  '历史演化路径更集中，偏震荡消化': 'Historical paths more clustered; range digestion bias',
  '历史映射存在差异，演化路径不够集中': 'Divergent historical mapping; path dispersion elevated',
  '历史演化差异较大，暂不具备统一路径': 'High historical dispersion; no unified trajectory',

  // Pro Structural Insight - Labels
  '结构状态': 'Structure',
  '当前注意': 'Focus',
  '后市参考': 'Outlook',

  // Historical Similarity - Group A (Crisis/Shock Events)
  '312 流动性枯竭': 'Liquidity Collapse',
  '519 杠杆清算': 'Leveraged Liquidation Cascade',
  'LUNA / UST 崩溃': 'LUNA / UST Systemic Breakdown',
  'Celsius / 3AC 去杠杆': 'Celsius / 3AC Credit Deleveraging',
  'FTX 暴雷': 'FTX Credit Shock',
  'FTX 后遗症底部磨底': 'Post-FTX Bottoming Phase',
  '极端波动冲击': 'Extreme Volatility Shock',
  '萨尔瓦多法币日（利好兑现）': 'El Salvador Legal Tender Event (Sell-the-News Deleveraging)',

  // Historical Similarity - Group B (Bull Market/Institutional Events)
  '无限 QE 启动': 'Unlimited QE Launch',
  '牛市启动（机构入场初期）': 'Early Bull Phase (Institutional Entry)',
  '突破 20000（主升浪确认）': '20K Breakout Confirmation',
  '519 后去杠杆完成': 'Post-Liquidation Structural Rebuild',
  '熊转牛拐点': 'Bear-to-Bull Regime Shift',
  '贝莱德 ETF 申请': 'BlackRock ETF Filing (Institutional Pivot)',
  'DTCC 事件（空头挤压）': 'DTCC Short Squeeze Event',
  'ETF 狂热（阶段高点）': 'ETF Euphoria Peak Zone',

  // Historical Similarity - Group C (Mid-Cycle Corrections)
  '牛市中段急跌（非趋势反转）': 'Mid-Bull Sharp Pullback (Non-Reversal)',
  '算力迁移恐慌': 'Mining Migration Shock',
  '低位快速反弹（诱多）': 'Dead Cat Bounce',
  '宏观利率压制反弹': 'Macro Rate Pressure on Rebound',
  'ETF 预期兑现震荡': 'ETF Expectation Flush (Range Volatility)',
  '高位横盘去杠杆': 'High-Range Deleveraging',
  '312 后首次强阻力回落': 'Post-312 Resistance Rejection',
  '低波动破位下杀': 'Low-Volatility Breakdown Release',

  // Historical Similarity - Group D (Range/Volatility Events)
  '低波动突发下杀': 'Low-Volatility Breakdown',
  '区间突破失败': 'Failed Range Breakout',
  '熊市反弹顶': 'Bear Market Rally Top',
  '震荡放量不破': 'Range Expansion Without Break',
  '高位波动压缩': 'High-Level Volatility Compression',
  '波动释放但无趋势': 'Volatility Expansion Without Trend',
  '牛市顶部钝化': 'Distribution Phase at Cycle Top',
  '突破前低波动蓄力': 'Pre-Breakout Volatility Compression',
};

/**
 * Translates market regime text from Chinese to bilingual format
 * Handles both single regime labels and compound labels (e.g., "熊市震荡｜下行承压")
 * Also handles comma-separated phrases (e.g., "流动性充裕，风险偏好强")
 */
export function translateMarketRegime(text: string, lang: Language): string {
  if (!text) return text;

  // If already in English or mixed, return as is
  if (lang === 'zh') return text;

  // Handle mixed separators (｜ and ，) by processing pipe-separated parts first
  if (text.includes('｜')) {
    const pipeParts = text.split('｜').map(part => part.trim());
    const translatedPipeParts = pipeParts.map(pipePart => {
      // Each pipe part might have comma-separated phrases
      if (pipePart.includes('，')) {
        const commaParts = pipePart.split('，').map(p => p.trim());
        const translatedCommaParts = commaParts.map(p => marketRegimeTranslations[p] || p);
        return translatedCommaParts.join(', ');
      } else {
        return marketRegimeTranslations[pipePart] || pipePart;
      }
    });
    return translatedPipeParts.join(' | ');
  }

  // Handle comma-only separator
  if (text.includes('，')) {
    const parts = text.split('，').map(part => part.trim());
    const translatedParts = parts.map(part => marketRegimeTranslations[part] || part);
    return translatedParts.join(', ');
  }

  // Single phrase
  return marketRegimeTranslations[text] || text;
}

/**
 * Gets bilingual text with market regime translation support
 * Falls back to translateMarketRegime if the field is a string
 */
export function getBilingualMarketText(field: any, lang: Language): string {
  if (!field) return '';

  // If it's already a bilingual object, use the language-specific value
  if (typeof field === 'object' && !Array.isArray(field)) {
    return field[lang] || field[lang === 'zh' ? 'en' : 'zh'] || '';
  }

  // If it's a string, try to translate it
  if (typeof field === 'string') {
    return translateMarketRegime(field, lang);
  }

  return '';
}

/**
 * Translates Pro Structural Insight lines
 * Handles format like "结构状态：震荡结构占主导，内部张力存在"
 * Translates both the label and the content
 */
export function translateProStructuralInsight(text: string, lang: Language): string {
  if (!text || lang === 'zh') return text;

  // Check if the line contains a colon separator (：)
  if (text.includes('：')) {
    const [label, ...contentParts] = text.split('：');
    const content = contentParts.join('：'); // In case content also has colons

    const translatedLabel = marketRegimeTranslations[label.trim()] || label.trim();
    const translatedContent = marketRegimeTranslations[content.trim()] || content.trim();

    return `${translatedLabel}: ${translatedContent}`;
  }

  // If no colon, just translate the whole text
  return marketRegimeTranslations[text.trim()] || text;
}
