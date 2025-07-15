import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const apiKey = process.env.MORALIS_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "MORALIS_API_KEY não configurada" },
      { status: 500 },
    );
  }

  try {
    const body = await req.json();

    const tokens = body.tokens as Array<{
      token_address: string;
      token_id: string;
    }>;

    if (!tokens || tokens.length === 0) {
      return NextResponse.json(
        { error: "Tokens não fornecidos." },
        { status: 400 },
      );
    }

    const invalidTokens = tokens.filter(
      (token) => !token.token_address || !token.token_id,
    );

    if (invalidTokens.length > 0) {
      return NextResponse.json(
        { error: "Tokens inválidos fornecidos." },
        { status: 400 },
      );
    }

    const url = new URL(
      "https://deep-index.moralis.io/api/v2.2/nft/getMultipleNFTs",
    );
    url.searchParams.set("chain", "eth");
    url.searchParams.set("normalizeMetadata", "true");
    url.searchParams.set("media_items", "true");

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "X-API-Key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tokens }),
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          error: `Erro ${response.status}: ${response.statusText}`,
        },
        { status: response.status },
      );
    }

    const data = await response.json();

    return NextResponse.json({ result: data });
  } catch (error) {
    console.error("API favorites error:", error);
    return NextResponse.json(
      { error: "Erro interno ao buscar favoritos." },
      { status: 500 },
    );
  }
}
