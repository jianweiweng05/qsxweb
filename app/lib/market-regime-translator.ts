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
