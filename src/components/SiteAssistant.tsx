"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { readAssistantEvents } from "@/lib/assistant-stream";
import styles from "./SiteAssistant.module.css";

type Message = { role: "user" | "assistant"; content: string };
const greeting: Message = { role: "assistant", content: "Olá! Sou a Clara, assistente virtual da ClinicaFlow. Posso ajudar a agendar uma consulta, encontrar uma unidade ou acessar seu portal. Como posso ajudar?" };
const publicPages = ["/", "/sobre", "/procurar-clinica", "/agendamento-online", "/portal-medico", "/recuperar-senha"];
const routes = ["/agendamento-online", "/cadastro", "/portal-paciente", "/portal-medico", "/recuperar-senha", "/#unidades", "/#especialidades", "/#exames", "/#faq"];
function MessageText({ text, close }: { text: string; close: () => void }) {
  return <>{text.split(/(\/(?:[a-z-]+|#[a-z-]+))/g).map((part, i) => routes.includes(part) ? <Link key={i} href={part} onClick={close}>{part}</Link> : part)}</>;
}
function ChatIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M20 11.5a8 8 0 0 1-8 8H4l1.5-4A8 8 0 1 1 20 11.5Z" /><path d="M8 10h8M8 14h5" /></svg>; }
export default function SiteAssistant({ aiEnabled }: { aiEnabled: boolean }) {
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const log = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const busy = useRef(false);
  const pending = useRef<AbortController | null>(null);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([greeting]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState(aiEnabled);
  const [copied, setCopied] = useState<number | null>(null);
  useEffect(() => { if (open) { dialog.current?.showModal(); input.current?.focus(); } else dialog.current?.close(); }, [open]);
  useEffect(() => { if (log.current) log.current.scrollTop = log.current.scrollHeight; }, [messages, loading]);
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => () => pending.current?.abort(), []);
  useEffect(() => { setMode(aiEnabled); }, [aiEnabled]);
  function close() { setOpen(false); trigger.current?.focus(); }
  function reset() {
    if (busy.current) return;
    setMessages([greeting]); setDraft(""); setError(""); setCopied(null); input.current?.focus();
  }
  async function copy(text: string, index: number) {
    try { await navigator.clipboard.writeText(text); setCopied(index); }
    catch { setError("Não foi possível copiar. Selecione o texto da resposta para copiar."); }
  }
  async function send(text: string) {
    if (!text.trim() || busy.current) return;
    busy.current = true;
    const next: Message[] = [...messages, { role: "user", content: text.trim() }];
    setMessages(next); setDraft(""); setLoading(true); setError(""); setCopied(null);
    const controller = new AbortController();
    pending.current = controller;
    let answer = "";
    try {
      const response = await fetch("/api/assistente", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.slice(-10).map(message => ({ ...message, content: message.content.slice(0, 1200) })) }),
        signal: AbortSignal.any([controller.signal, AbortSignal.timeout(60000)]),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Não foi possível enviar sua mensagem.");
      }
      if (response.headers.get("content-type")?.includes("text/event-stream") && response.body) {
        setMode(true);
        let completed = false;
        for await (const event of readAssistantEvents(response.body)) {
          if (event.type === "error") throw new Error(event.error);
          if (event.type === "delta") {
            answer += event.text;
            setMessages([...next, { role: "assistant", content: answer }]);
          }
          if (event.type === "done") completed = true;
        }
        if (!completed) throw new Error("A conexão foi interrompida. Tente novamente.");
      } else {
        const data = await response.json();
        setMode(data.mode === "ai");
        setMessages([...next, { role: "assistant", content: data.answer }]);
      }
    } catch (e) {
      setError(controller.signal.aborted ? "Resposta interrompida por você." : e instanceof Error && e.name !== "TimeoutError" ? e.message : "A resposta demorou. Tente novamente.");
      if (answer) setMessages([...next, { role: "assistant", content: `${answer}\n\n[Resposta interrompida]` }]);
      else setMessages(messages);
      setDraft(text);
    } finally { pending.current = null; busy.current = false; setLoading(false); input.current?.focus(); }
  }
  if (!publicPages.includes(pathname)) return null;
  return <>
    <button ref={trigger} className={styles.launcher} type="button" onClick={() => setOpen(true)} aria-label="Conversar com Clara, assistente virtual" aria-haspopup="dialog" aria-expanded={open}><ChatIcon /><span>Converse com a Clara</span></button>
    <dialog ref={dialog} className={styles.panel} aria-labelledby="assistant-title" onCancel={close} onClose={() => setOpen(false)}>
      <header className={styles.header}><div className={styles.avatar}><ChatIcon /></div><div><h2 id="assistant-title">Clara · ClinicaFlow</h2><p>{mode ? "Assistente com inteligência artificial" : "Demonstração · respostas básicas"}</p></div><button type="button" onClick={close} aria-label="Fechar assistente">×</button></header>
      <div className={styles.toolbar}><span>Seu próximo passo, mais simples.</span><button type="button" onClick={reset} disabled={loading || messages.length === 1}>Nova conversa</button></div>
      <div className={styles.log} ref={log} role="log" aria-live="polite" aria-busy={loading} aria-relevant="additions text" aria-label="Conversa com a assistente">
        {messages.map((message, i) => <div key={i} className={`${styles.message} ${message.role === "user" ? styles.user : ""}`}><small>{message.role === "user" ? "Você" : "Clara"}</small><p>{message.role === "assistant" ? <MessageText text={message.content} close={close} /> : message.content}</p>{message.role === "assistant" && i > 0 && !loading && <button className={styles.copy} type="button" onClick={() => copy(message.content, i)}>{copied === i ? "Copiado ✓" : "Copiar resposta"}</button>}</div>)}
        {loading && <p className={styles.thinking} role="status">Clara está respondendo…</p>}
      </div>
      {messages.length === 1 && <div className={styles.suggestions}>{["Como agendar?", "Onde ficam as unidades?", "Quais exames estão disponíveis?"].map(text => <button type="button" key={text} disabled={loading} onClick={() => send(text)}>{text}</button>)}</div>}
      <nav className={styles.links} aria-label="Links úteis do assistente"><Link href="/agendamento-online" onClick={close}>Agendamento</Link><Link href="/#unidades" onClick={close}>Unidades</Link><Link href="/portal-paciente" onClick={close}>Portal do paciente</Link></nav>
      {error && <p className={styles.error} role="alert">{error}</p>}
      <form className={styles.form} onSubmit={e => { e.preventDefault(); send(draft); }}><input ref={input} value={draft} onChange={e => setDraft(e.target.value)} maxLength={1200} placeholder="Digite sua dúvida…" aria-label="Sua pergunta para a assistente" />{loading ? <button type="button" onClick={() => pending.current?.abort()} aria-label="Interromper resposta" title="Interromper resposta">■</button> : <button type="submit" disabled={!draft.trim()} aria-label="Enviar mensagem">↑</button>}</form>
      <p className={styles.notice}>Ajuda sobre o site, sem orientação médica. Não envie dados de saúde ou senhas.{mode && " As mensagens são processadas por IA."}</p>
    </dialog>
  </>;
}
