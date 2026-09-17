"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import styles from "../login/auth.module.css";

function safeRedirect(value: string | null) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/paciente";
}

function CadastroForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [form, setForm] = useState({ nome: "", email: "", senha: "" });
  const [erro, setErro] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  function set(campo: keyof typeof form, valor: string) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setOk(null);
    setCarregando(true);

    const supabase = createClient();
    const destino = safeRedirect(params.get("redirect"));
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.senha,
      options: {
        data: { nome: form.nome },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(destino)}`,
      },
    });

    setCarregando(false);
    if (error) {
      setErro(error.message);
      return;
    }
    if (data.session) {
      router.replace(destino);
      router.refresh();
      return;
    }
    setOk("Conta criada. Confirme o e-mail enviado para ativar seu acesso.");
  }

  return (
    <div className={styles.wrap}>
      <aside className={styles.side}>
        <Link href="/" className={styles.brand}>
          <span className={styles.brandMark}>✚</span>
          <span>ClinicxFlow</span>
        </Link>

        <div className={styles.heroContent}>
          <h2>Sua saúde acompanhada de perto.</h2>
          <p>Agende consultas, acompanhe seu histórico e receba lembretes na área do paciente.</p>
        </div>

        <ul className={styles.list}>
          <li>• Agendamento online em poucos cliques</li>
          <li>• Histórico de atendimentos sempre à mão</li>
          <li>• Resultados disponibilizados pela equipe</li>
        </ul>
      </aside>

      <main className={styles.panel}>
        <form className={styles.form} onSubmit={onSubmit}>
          <h1>Criar conta de paciente</h1>
          <p className={styles.sub}>Contas de equipe são criadas pelo administrador no painel interno.</p>

          {erro && <div className="cx-alert cx-alert-error">{erro}</div>}
          {ok && <div className="cx-alert cx-alert-ok">{ok}</div>}

          <div className="cx-field">
            <label htmlFor="nome">Nome completo</label>
            <input id="nome" required value={form.nome} onChange={(e) => set("nome", e.target.value)} />
          </div>
          <div className="cx-field">
            <label htmlFor="email">E-mail</label>
            <input id="email" type="email" required value={form.email} onChange={(e) => set("email", e.target.value)} />
          </div>
          <div className="cx-field">
            <label htmlFor="senha">Senha</label>
            <input id="senha" type="password" required minLength={6} value={form.senha} onChange={(e) => set("senha", e.target.value)} />
          </div>

          <div className={styles.actions}>
            <button className={`cx-btn cx-btn-primary ${styles.full}`} disabled={carregando}>
              {carregando ? "Criando..." : "Criar conta"}
            </button>
          </div>

          <div className={styles.links}>
            <Link href="/">Voltar ao site</Link>
            <Link href="/login">Já tenho conta</Link>
          </div>
        </form>
      </main>
    </div>
  );
}

export default function CadastroPage() {
  return (
    <Suspense fallback={<p>Carregando...</p>}>
      <CadastroForm />
    </Suspense>
  );
}
