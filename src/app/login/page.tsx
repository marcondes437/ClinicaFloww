"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { HOME_BY_ROLE, type AppRole } from "@/lib/roles";
import styles from "./auth.module.css";

function safeRedirect(value: string | null) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : null;
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);
    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha });
    if (error || !data.user) {
      setErro("E-mail ou senha inválidos.");
      setCarregando(false);
      return;
    }

    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", data.user.id);
    const role = ((roles ?? [])[0]?.role as AppRole) ?? "paciente";
    const destino = safeRedirect(params.get("redirect")) || HOME_BY_ROLE[role];
    router.replace(destino);
    router.refresh();
  }

  async function loginComGoogle() {
    setErro(null);
    const supabase = createClient();
    const redirectParam = safeRedirect(params.get("redirect"));

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback${
          redirectParam ? `?next=${encodeURIComponent(redirectParam)}` : ""
        }`,
      },
    });

    if (error) {
      setErro("Não foi possível iniciar o login com Google.");
    }
  }

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <h1>Entrar no ClinicxFlow</h1>
      <p className={styles.sub}>Acesse com seu e-mail cadastrado. O sistema leva você ao painel do seu cargo.</p>

      {erro && <div className="cx-alert cx-alert-error">{erro}</div>}

      <div className="cx-field">
        <label htmlFor="email">E-mail</label>
        <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@email.com" />
      </div>
      <div className="cx-field">
        <label htmlFor="senha">Senha</label>
        <input id="senha" type="password" required value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="••••••••" />
      </div>

      <div className={styles.actions}>
        <button className={`cx-btn cx-btn-primary ${styles.full}`} disabled={carregando}>
          {carregando ? "Entrando..." : "Entrar"}
        </button>
      </div>

      <div className={styles.divider}>
        <span>ou</span>
      </div>

      <button
        type="button"
        onClick={loginComGoogle}
        className={`cx-btn cx-btn-secondary ${styles.full}`}
      >
        Entrar com Google
      </button>

      <div className={styles.links}>
        <Link href="/recuperar-senha">Esqueci minha senha</Link>
        <Link href="/cadastro">Criar conta</Link>
      </div>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className={styles.wrap}>
      <aside className={styles.side}>
        <Link href="/" className={styles.brand}>
          <span className={styles.brandMark}>✚</span> ClinicxFlow
        </Link>
        <div>
          <h2>Cuidado organizado, decisão com dados.</h2>
          <p>Agenda, prontuário, histórico e indicadores em um único ambiente seguro.</p>
        </div>
        <ul className={styles.list}>
          <li>· Acesso por cargo com permissões reais</li>
          <li>· Dados protegidos por políticas no banco</li>
          <li>· Área do paciente com agendamento online</li>
        </ul>
      </aside>
      <main className={styles.panel}>
        <Suspense fallback={<p>Carregando...</p>}>
          <LoginForm />
        </Suspense>
      </main>
    </div>
  );
}
