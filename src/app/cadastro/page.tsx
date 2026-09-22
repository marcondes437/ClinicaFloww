"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import PatientPortal from "@/components/PatientPortal";
import styles from "@/components/PortalLogin.module.css";

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
    <PatientPortal
      accessTitle="Criar conta"
      accessIntro="Cadastre-se para acessar sua área do paciente."
      accessLink={{ href: "/portal-paciente", label: "Já tenho conta" }}
    >
      <form onSubmit={onSubmit} className={styles.form}>
        {erro && <div className={styles.error} role="alert">{erro}</div>}
        {ok && <div className={styles.success} role="status">{ok}</div>}

        <label htmlFor="nome">Nome completo</label>
        <input id="nome" autoComplete="name" required value={form.nome} onChange={(e) => set("nome", e.target.value)} />

        <label htmlFor="email">E-mail</label>
        <input id="email" type="email" autoComplete="email" required value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="seu@email.com" />

        <label htmlFor="senha">Senha</label>
        <input id="senha" type="password" autoComplete="new-password" required minLength={6} value={form.senha} onChange={(e) => set("senha", e.target.value)} placeholder="Crie uma senha" />

        <button type="submit" disabled={carregando}>
          {carregando ? "Criando..." : "Criar conta"}
        </button>
      </form>
    </PatientPortal>
  );
}

export default function CadastroPage() {
  return (
    <Suspense fallback={<p>Carregando...</p>}>
      <CadastroForm />
    </Suspense>
  );
}
