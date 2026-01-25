import type { Language } from './i18n';

// Market regime translations
const marketRegimeTranslations: Record<string, string> = {
  '牛市过热': 'Overheated Bull Market',
  '健康牛市': 'Healthy Bull Market',
  '震荡市': 'Oscillating Market',
  '熊市震荡': 'Bear Market Oscillation',
  '熊市恐慌': 'Bear Market Panic',
  '底部吸筹': 'Accumulation at Lows',
  '过热拉升': 'Overheated Rally',
  '结构修复': 'Structural Recovery',
  '筑底震荡': 'Base Formation Range',
  '下行承压': 'Downside Pressure',
};

/**
 * Translates market regime text from Chinese to bilingual format
 * Handles both single regime labels and compound labels (e.g., "熊市震荡｜下行承压")
 */
export function translateMarketRegime(text: string, lang: Language): string {
  if (!text) return text;

  // If already in English or mixed, return as is
  if (lang === 'zh') return text;

  // Split by separator if compound label
  const parts = text.split('｜').map(part => part.trim());

  const translatedParts = parts.map(part => {
    // Look up translation
    return marketRegimeTranslations[part] || part;
  });

  return translatedParts.join(' | ');
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
