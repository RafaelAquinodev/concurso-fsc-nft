"use server";

export async function generateInsight(collection: string) {
  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Você é um analista de mercado NFT. Gere um resumo em até 2 frases sobre a coleção ${collection}. Houve hype, notícias recentes ou queda/subida no floor price? Responda em português.`,
                },
              ],
            },
          ],
        }),
      },
    );

    const data = await response.json();
    // Verifica se a resposta é válida antes de tentar acessar os dados
    if (
      !data.candidates ||
      data.candidates.length === 0 ||
      !data.candidates[0].content ||
      !data.candidates[0].content.parts ||
      data.candidates[0].content.parts.length === 0
    ) {
      console.error("Invalid response from Gemini API:", data);
      return {
        success: false,
        error: "Invalid response from AI model",
      };
    }

    const insight = data.candidates[0].content.parts[0].text;

    return {
      success: true,
      insight,
    };
  } catch (error) {
    console.error("Error generating insight:", error);
    return {
      success: false,
      error: "Failed to generate insight",
    };
  }
}
