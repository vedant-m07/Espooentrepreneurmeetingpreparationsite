import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const { message } = req.body as { message?: string };
  if (!message) {
    res.status(400).json({ error: "Missing message" });
    return;
  }

  const apiKey = process.env.FEATHERLESS_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Missing FEATHERLESS_API_KEY" });
    return;
  }

  const r = await fetch("https://api.featherless.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "deepseek-ai/DeepSeek-V3-0324",
      messages: [{ role: "user", content: message }],
    }),
  });

  const data = await r.json();
  const reply = data?.choices?.[0]?.message?.content ?? "";

  res.status(200).json({ reply });
}
