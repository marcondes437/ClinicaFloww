import { NextResponse } from "next/server";
import { ASSISTANT_KNOWLEDGE, basicAnswer } from "@/lib/assistant";

export const runtime = "nodejs";
const headers = { "Cache-Control": "no-store" };
let windowStart = 0;
let requests = 0;

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return NextResponse.json({ error: "Origem não permitida." }, { status: 403, headers });
  const raw = await request.text();
  if (raw.length > 16000) return NextResponse.json({ error: "Conversa muito longa. Inicie uma nova conversa." }, { status: 413, headers });
  let body;
  try { body = JSON.parse(raw); } catch { return NextResponse.json({ error: "Mensagem inválida." }, { status: 400, headers }); }
  const messages = body?.messages;
  if (!Array.isArray(messages) || messages.length < 1 || messages.length > 12 || messages.some(m => !m || !["user", "assistant"].includes(m.role) || typeof m.content !== "string" || !m.content.trim() || m.content.length > 1200) || messages.at(-1).role !== "user") {
    return NextResponse.json({ error: "Envie uma pergunta com até 1.200 caracteres." }, { status: 400, headers });
  }
  if (Date.now() - windowStart > 60000) { windowStart = Date.now(); requests = 0; }
  if (++requests > 30) return NextResponse.json({ error: "Muitas mensagens neste momento. Tente novamente em um minuto." }, { status: 429, headers: { ...headers, "Retry-After": "60" } });
  if (!process.env.OPENAI_API_KEY || !process.env.OPENAI_MODEL) return NextResponse.json({ answer: basicAnswer(messages.at(-1).content), mode: "basic" }, { headers });
  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: process.env.OPENAI_MODEL, instructions: ASSISTANT_KNOWLEDGE, input: messages, max_output_tokens: 450, store: false }),
      signal: AbortSignal.timeout(25000),
    });
    if (!response.ok) throw new Error("Provider unavailable");
    const data = await response.json();
    const answer = (data.output ?? []).filter((item: { type: string }) => item.type === "message").flatMap((item: { content: { type: string; text?: string }[] }) => item.content ?? []).filter((item: { type: string }) => item.type === "output_text").map((item: { text: string }) => item.text).join("\n");
    if (!answer || data.status !== "completed") throw new Error("Empty response");
    return NextResponse.json({ answer, mode: "ai" }, { headers });
  } catch {
    return NextResponse.json({ error: "O assistente está indisponível agora. Tente novamente ou consulte os contatos da unidade." }, { status: 503, headers });
  }
}
