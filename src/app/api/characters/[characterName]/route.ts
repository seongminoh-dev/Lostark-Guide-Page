import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  context: { params: { characterName: string } } // 올바른 타입 정의
) {
  const { params } = context;
  const characterName = params.characterName;

  const apiKey = process.env.LA_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'API key is not set' },
      { status: 500 }
    );
  }

  const url = `https://developer-lostark.game.onstove.com/characters/${encodeURIComponent(
    characterName
  )}/siblings`;

  try {
    const res = await fetch(url, {
      headers: {
        accept: 'application/json',
        authorization: `bearer ${apiKey}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch data from external API' },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
