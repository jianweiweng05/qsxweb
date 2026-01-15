import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://qsx-ai.onrender.com/macro/v1/control_tower', {
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `API 返回 ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : '网络错误' },
      { status: 500 }
    );
  }
}
