"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { AppRole } from "@/lib/roles";
import styles from "./PortalLogin.module.css";
import PatientPortal from "./PatientPortal";

type PortalLoginProps = {
  role: Extract<AppRole, "medico" | "paciente">;
};

const PORTAL = {
  paciente: {
    label: "Portal do cliente",
    title: "Bem-vindo ao seu cuidado",
    description: "Acompanhe suas consultas, histórico e informações de saúde em um só lugar.",
    image: "/fotos/clinicageral.jpg",
    emailLabel: "E-mail",
    help: "Primeiro acesso? Fale com a recepção da sua unidade.",
    destination: "/paciente",
  },
  medico: {
    label: "Portal do médico",
    title: "Sua prática clínica em um só lugar",
    description: "Consulte sua agenda, acompanhe seus pacientes e registre cada atendimento com segurança.",
    image: "/fotos/enfermagem.jpg",
    emailLabel: "E-mail profissional",
    help: "Acesso exclusivo para profissionais cadastrados pela ClinicaFlow.",
    destination: "/medico",
  },
} as const;

export default function PortalLogin({ role }: PortalLoginProps) {
  const router = useRouter();
  const portal = PORTAL[role];
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
    const temAcesso = (roles ?? []).some((item) => item.role === role);

    if (!temAcesso) {
      await supabase.auth.signOut();
      setErro(`Este acesso é exclusivo para ${role === "medico" ? "médicos" : "pacientes"}.`);
      setCarregando(false);
      return;
    }

    router.replace(portal.destination);
    router.refresh();
  }

  const loginForm = (
    <form onSubmit={onSubmit} className={styles.form}>
      {erro && <div className={styles.error} role="alert">{erro}</div>}
      <label htmlFor={`${role}-email`}>{portal.emailLabel}</label>
      <input
        id={`${role}-email`}
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="seu@email.com"
      />

      <div className={styles.passwordLabel}>
        <label htmlFor={`${role}-senha`}>Senha</label>
        <Link href="/recuperar-senha">Esqueci minha senha</Link>
      </div>
      <input
        id={`${role}-senha`}
        type="password"
        autoComplete="current-password"
        required
        value={senha}
        onChange={(event) => setSenha(event.target.value)}
        placeholder="Digite sua senha"
      />

      <button type="submit" disabled={carregando}>
        {carregando ? "Entrando..." : role === "paciente" ? "Continuar" : "Entrar no portal"}
      </button>
    </form>
  );

  if (role === "paciente") return <PatientPortal>{loginForm}</PatientPortal>;

  return (
    <main className={`${styles.page} ${role === "medico" ? styles.doctorPage : styles.patientPage}`}>
      <section className={styles.formSide}>
        <div className={styles.formWrap}>
          <Link href="/" className={styles.brand}>
            <img src="/fotos/logo-transparente.png" alt="ClinicaFlow" />
            <span>ClinicaFlow</span>
          </Link>

          <div className={styles.formHeader}>
            <span className={styles.eyebrow}>{portal.label}</span>
            <h1>{portal.title}</h1>
            <p>{portal.description}</p>
          </div>

          {loginForm}

          <p className={styles.help}>{portal.help}</p>
          <Link href="/" className={styles.back}>Voltar para a página inicial</Link>
        </div>
      </section>

      <section className={styles.visual} style={{ backgroundImage: `url("${portal.image}")` }}>
        <div className={styles.visualOverlay} />
        <div className={styles.visualContent}>
          <span>Saúde com propósito</span>
          <h2>{role === "medico" ? "Decisões melhores começam com informação." : "Mais cuidado em cada conexão."}</h2>
          <p>{role === "medico" ? "Tenha sua rotina clínica organizada para dedicar mais tempo ao que realmente importa: seus pacientes." : "Uma experiência simples, humana e segura para cada etapa do atendimento."}</p>
        </div>
      </section>
    </main>
  );
}