"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import styles from "./SiteAssistant.module.css";

type Message = { role: "user" | "assistant"; content: string };
const greeting: Message = { role: "assistant", content: "Olá! Sou a Clara, assistente virtual da ClinicaFlow. Como posso ajudar você hoje?" };
const publicPages = ["/", "/sobre", "/procurar-clinica", "/agendamento-online", "/portal-paciente", "/portal-medico", "/login", "/cadastro", "/recuperar-senha"];
function ChatIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M20 11.5a8 8 0 0 1-8 8H4l1.5-4A8 8 0 1 1 20 11.5Z" /><path d="M8 10h8M8 14h5" /></svg>; }
export default function SiteAssistant({ aiEnabled }: { aiEnabled: boolean }) {
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const log = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const busy = useRef(false);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([greeting]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState(aiEnabled);
  useEffect(() => { if (open) { dialog.current?.showModal(); input.current?.focus(); } else dialog.current?.close(); }, [open]);
  useEffect(() => { if(log.current) log.current.scrollTop = log.current.scrollHeight; }, [messages, loading]);
  useEffect(() => { setOpen(false); }, [pathname]);
  function close() { setOpen(false); trigger.current?.focus(); }
  async function send(text: string) {
    if (!text.trim() || busy.current) return;
    busy.current = true;
    const next: Message[] = [...messages, { role: "user", content: text.trim() }];
    setMessages(next); setDraft(""); setLoading(true); setError("");
    try {
      const response = await fetch("/api/assistente", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: next.slice(-10).map(message => ({ ...message, content: message.content.slice(0, 1200) })) }), signal: AbortSignal.timeout(30000) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Não foi possível enviar sua mensagem.");
      setMode(data.mode === "ai");
      setMessages([...next, { role: "assistant", content: data.answer }]);
    } catch (e) {
      setError(e instanceof Error && e.name !== "TimeoutError" ? e.message : "A resposta demorou. Tente novamente.");
      setMessages(messages); setDraft(text);
    } finally { busy.current = false; setLoading(false); input.current?.focus(); }
  }
  if (!publicPages.includes(pathname)) return null;
  return <>
    <button ref={trigger} className={styles.launcher} type="button" onClick={() => setOpen(true)} aria-label="Abrir assistente virtual" aria-haspopup="dialog" aria-expanded={open}><ChatIcon /><span>Precisa de ajuda?</span></button>
    <dialog ref={dialog} className={styles.panel} aria-labelledby="assistant-title" onCancel={close} onClose={() => setOpen(false)}>
      <header className={styles.header}><div className={styles.avatar}><ChatIcon /></div><div><h2 id="assistant-title">Clara · ClinicaFlow</h2><p>{mode ? "Assistente com inteligência artificial" : "Demonstração · respostas básicas"}</p></div><button type="button" onClick={close} aria-label="Fechar assistente">×</button></header>
      <div className={styles.log} ref={log} role="log" aria-live="polite" aria-relevant="additions" aria-label="Conversa com a assistente">
        {messages.map((message, i) => <div key={i} className={`${styles.message} ${message.role === "user" ? styles.user : ""}`}><small>{message.role === "user" ? "Você" : "Clara"}</small><p>{message.content}</p></div>)}
        {loading && <p className={styles.thinking} role="status">Clara está respondendo…</p>}
      </div>
      {messages.length === 1 && <div className={styles.suggestions}>{["Como agendar?", "Onde ficam as unidades?", "Quais exames estão disponíveis?"].map(text => <button type="button" key={text} disabled={loading} onClick={() => send(text)}>{text}</button>)}</div>}
      <nav className={styles.links} aria-label="Links úteis do assistente"><Link href="/agendamento-online" onClick={close}>Agendamento</Link><Link href="/#unidades" onClick={close}>Unidades</Link><Link href="/portal-paciente" onClick={close}>Portal do paciente</Link></nav>
      {error && <p className={styles.error} role="alert">{error}</p>}
      <form className={styles.form} onSubmit={e => { e.preventDefault(); send(draft); }}><input ref={input} value={draft} onChange={e => setDraft(e.target.value)} maxLength={1200} placeholder="Digite sua dúvida…" aria-label="Sua pergunta para a assistente" /><button type="submit" disabled={loading || !draft.trim()} aria-label="Enviar mensagem">↑</button></form>
      <p className={styles.notice}>Ajuda sobre o site, sem orientação médica. Não envie dados de saúde ou senhas.{mode && " As mensagens são processadas por IA."}</p>
    </dialog>
  </>;
}
