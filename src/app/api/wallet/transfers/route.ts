import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const apiKey = process.env.MORALIS_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "MORALIS_API_KEY não configurada" },
      { status: 500 },
    );
  }

  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");
  const chain = searchParams.get("chain") || "eth";
  const limit = searchParams.get("limit") || "40";
  const cursor = searchParams.get("cursor") || "";

  if (!address || !address.trim()) {
    return NextResponse.json(
      { error: "Endereço da wallet é obrigatório" },
      { status: 400 },
    );
  }

  const url = new URL(
    `https://deep-index.moralis.io/api/v2.2/wallets/${address}/nfts/trades`,
  );
  url.searchParams.append("chain", chain);
  url.searchParams.append("format", "decimal");
  url.searchParams.append("order", "desc");
  url.searchParams.append("limit", limit);
  url.searchParams.append("include_prices", "true");
  if (cursor) {
    url.searchParams.append("cursor", cursor);
  }

  try {
    const res = await fetch(url.toString(), {
      headers: {
        "X-API-Key": apiKey,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Erro ${res.status}: ${res.statusText}` },
        { status: res.status },
      );
    }

    const data = await res.json();

    return NextResponse.json({
      result: data.result,
      cursor: data.cursor,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erro ao buscar transferências" },
      { status: 500 },
    );
  }
}
