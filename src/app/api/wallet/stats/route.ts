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

  if (!address || !address.trim()) {
    return NextResponse.json(
      { error: "Endereço da wallet é obrigatório" },
      { status: 400 },
    );
  }

  const url = new URL(
    `https://deep-index.moralis.io/api/v2.2/wallets/${address.trim()}/stats`,
  );
  url.searchParams.set("chain", chain);

  try {
    const res = await fetch(url.toString(), {
      headers: {
        "X-API-Key": apiKey,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json(
        { error: errorText || `Erro ${res.status}: ${res.statusText}` },
        { status: res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Erro ao buscar estatísticas da wallet:", err);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
