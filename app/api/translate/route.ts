import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { text, target } = await request.json();

    if (!text || !target) {
      return NextResponse.json(
        { error: 'Missing text or target language' },
        { status: 400 }
      );
    }

    // Use Google Translate API or similar service
    // For now, using a simple proxy to a translation service
    // You can replace this with your preferred translation API

    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${target}&dt=t&q=${encodeURIComponent(text)}`,
      {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0',
        },
      }
    );

    if (!response.ok) {
      console.error('Translation API error:', response.status);
      return NextResponse.json(
        { translated: text }, // Fallback to original
        { status: 200 }
      );
    }

    const data = await response.json();

    // Parse Google Translate response format
    // Response is: [[[translated_text, original_text, ...]]]
    let translated = text;
    if (Array.isArray(data) && data[0] && Array.isArray(data[0])) {
      translated = data[0].map((item: any) => item[0]).join('');
    }

    return NextResponse.json({ translated });
  } catch (error) {
    console.error('Translation error:', error);
    // Return original text as fallback
    return NextResponse.json(
      { translated: (await request.json()).text },
      { status: 200 }
    );
  }
}
