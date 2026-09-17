import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./PatientPortal.module.css";

export default function PatientPortal({ children }: { children: ReactNode }) {
  return <div className={styles.page}>
    <header className={styles.header}>
      <Link href="/" className={styles.brand} aria-label="ClinicaFlow — página inicial">
        <img src="/fotos/logo-transparente.png" alt="" width="60" height="60" />
        <span>ClinicaFlow<small>Seu cuidado, sempre perto</small></span>
      </Link>
      <nav className={styles.nav} aria-label="Serviços do paciente">
        <Link href="/agendamento-online">Novo agendamento</Link>
        <Link href="/paciente/historico">Histórico de atendimentos</Link>
        <Link href="/paciente">Minha agenda</Link>
        <Link href="/#exames">Exames e check-ups</Link>
        <Link href="/#contato">Fale conosco</Link>
        <Link href="/procurar-clinica">Buscar médicos</Link>
      </nav>
    </header>

    <main className={styles.main}>
      <div className={styles.photograph} aria-hidden="true" />
      <div className={styles.content}>
        <section className={styles.welcome} aria-labelledby="patient-welcome">
          <span className={styles.eyebrow}>Portal do paciente</span>
          <h1 id="patient-welcome">VOCÊ</h1>
          <p>é a nossa primeira escolha.</p>
          <span className={styles.caption}>Cuidado para cada fase da sua vida.</span>
        </section>
        <section className={styles.access} aria-labelledby="patient-login-title">
          <div className={styles.card}>
            <h2 id="patient-login-title">Realizar login</h2>
            <p className={styles.intro}>Acesse com seu e-mail cadastrado.</p>
            {children}
          </div>
          <Link href="/cadastro" className={styles.register}>Me cadastrar</Link>
          <Link href="/" className={styles.back}>← Voltar para a página inicial</Link>
        </section>
      </div>
      <footer className={styles.footer}>© {new Date().getFullYear()} ClinicaFlow. Todos os direitos reservados.</footer>
    </main>
  </div>;
}
