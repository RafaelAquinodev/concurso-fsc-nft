import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiKey = process.env.MORALIS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "MORALIS_API_KEY não configurada" },
        { status: 500 },
      );
    }

    const url =
      "https://deep-index.moralis.io/api/v2.2/market-data/nfts/hottest-collections";

    const response = await fetch(url, {
      headers: {
        "X-API-Key": apiKey,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Erro ${response.status}: ${response.statusText}` },
        { status: response.status },
      );
    }

    const data = await response.json();

    return NextResponse.json({ result: data });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao buscar trending NFTs" },
      { status: 500 },
    );
  }
}
