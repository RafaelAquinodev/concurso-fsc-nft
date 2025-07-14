import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const apiKey = process.env.MORALIS_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "MORALIS_API_KEY não configurada" },
      { status: 500 },
    );
  }

  const { searchParams } = req.nextUrl;

  const address = searchParams.get("address");
  const chain = searchParams.get("chain") || "eth";
  const limit = searchParams.get("limit") || "40";
  const cursor = searchParams.get("cursor") || "";
  const normalizeMetadata = searchParams.get("normalizeMetadata") || "true";
  const includePrices = searchParams.get("includePrices") || "true";
  const excludeSpam = searchParams.get("excludeSpam") || "true";

  if (!address || !address.trim()) {
    return NextResponse.json(
      { error: "Endereço da wallet é obrigatório" },
      { status: 400 },
    );
  }

  const url = new URL(
    `https://deep-index.moralis.io/api/v2.2/${address.trim()}/nft`,
  );
  url.searchParams.set("chain", chain);
  url.searchParams.set("format", "decimal");
  url.searchParams.set("limit", limit);
  url.searchParams.set("normalizeMetadata", normalizeMetadata);
  url.searchParams.set("include_prices", includePrices);
  url.searchParams.set("exclude_spam", excludeSpam);

  if (cursor) {
    url.searchParams.set("cursor", cursor);
  }

  try {
    const res = await fetch(url.toString(), {
      headers: {
        "X-API-Key": apiKey,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: text }, { status: res.status });
    }

    const data = await res.json();

    return NextResponse.json({
      result: data.result,
      cursor: data.cursor,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao buscar NFTs" }, { status: 500 });
  }
}
