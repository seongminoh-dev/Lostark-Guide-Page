import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: { characterName: string } }
) {
  const { characterName } = context.params;
  const apiKey = request.headers.get("x-api-key"); // 헤더에서 API 키 가져오기

  if (!apiKey) {
    return NextResponse.json(
      { error: "API key is missing" },
      { status: 400 }
    );
  }

  const url = `https://developer-lostark.game.onstove.com/characters/${encodeURIComponent(
    characterName
  )}/siblings`;

  const res = await fetch(url, {
    headers: {
      accept: "application/json",
      authorization: `bearer ${apiKey}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }

  const data = await res.json();
  return NextResponse.json(data);
}

