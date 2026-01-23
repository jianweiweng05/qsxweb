import { NextResponse } from "next/server";

const ALLOWED = new Set(["en", "zh"]);
const MAX_LEN = 300;

export async function POST(request: Request) {
  let payload: any = null;

  try {
    payload = await request.json();
    const text = typeof payload?.text === "string" ? payload.text.trim() : "";
    const target = typeof payload?.target === "string" ? payload.target : "";

    if (!text || !ALLOWED.has(target)) {
      return NextResponse.json({ error: "bad_request" }, { status: 400 });
    }

    if (text.length > MAX_LEN) {
      return NextResponse.json({ translated: text }, { status: 200 });
    }

    const url =
      "https://translate.googleapis.com/translate_a/single" +
      `?client=gtx&sl=auto&tl=${encodeURIComponent(target)}` +
      `&dt=t&q=${encodeURIComponent(text)}`;

    const resp = await fetch(url, {
      method: "GET",
      headers: { "User-Agent": "Mozilla/5.0" },
      cache: "no-store",
    });

    if (!resp.ok) {
      return NextResponse.json({ translated: text }, { status: 200 });
    }

    const data = await resp.json();
    let translated = text;

    if (Array.isArray(data) && Array.isArray(data[0])) {
      translated = data[0].map((it: any) => (Array.isArray(it) ? it[0] : "")).join("");
      if (!translated) translated = text;
    }

    return NextResponse.json({ translated }, { status: 200 });
  } catch {
    const text = typeof payload?.text === "string" ? payload.text : "";
    return NextResponse.json({ translated: text }, { status: 200 });
  }
}