import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import HomeCarousel from "@/components/HomeCarousel";
import HomeHeader from "@/components/HomeHeader";
import PresentialCare from "@/components/PresentialCare";
import HomeFooter from "@/components/HomeFooter";
import DoctorSpace from "@/components/DoctorSpace";
import UnitsSection from "@/components/UnitsSection";
import SpecialtiesSection from "@/components/SpecialtiesSection";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

const BENEFICIOS = [
  { icon: "◎", t: "Prontuário eletrônico", d: "Histórico clínico, evoluções e indicadores organizados por paciente." },
  { icon: "▤", t: "Agenda inteligente", d: "Visões diária, semanal e mensal com status de cada atendimento." },
  { icon: "⚕", t: "Atendimento humanizado", d: "Fluxos pensados para recepção, enfermagem e corpo clínico." },
  { icon: "◈", t: "Indicadores em tempo real", d: "Painéis conectados ao banco, sem números inventados." },
  { icon: "⛨", t: "Segurança por cargo", d: "Permissões aplicadas na interface e no banco com RLS." },
  { icon: "⌂", t: "Multiunidades", d: "Unidades, especialidades e equipes centralizadas." },
];

const EXAMES = ["Hemograma completo", "Eletrocardiograma", "Raio-X", "Ultrassonografia", "Teste ergométrico", "Exames laboratoriais"];
const CHECKUPS = [
  { t: "Check-up Essencial", d: "Consulta clínica, exames laboratoriais básicos e orientação preventiva." },
  { t: "Check-up Cardíaco", d: "Avaliação cardiológica, ECG e teste ergométrico." },
  { t: "Check-up Mulher", d: "Avaliação ginecológica, exames de rotina e nutrição." },
];
const UNIDADES_PARCEIRAS = [
  { nome: "Hospital Israelita Albert Einstein", imagem: "/fotos/unidade-einstein.svg" },
  { nome: "Hospital Sirio-Libanes", imagem: "/fotos/unidade-sirio-libanes.svg" },
  { nome: "Rede D'Or", imagem: "/fotos/unidade-rede-dor.svg" },
  { nome: "Fleury", imagem: "/fotos/unidade-fleury.svg" },
  { nome: "Sabin", imagem: "/fotos/unidade-sabin.svg" },
  { nome: "HCor", imagem: "/fotos/unidade-hcor.svg" },
  { nome: "Sao Luiz", imagem: "/fotos/unidade-sao-luiz.svg" },
  { nome: "Oswaldo Cruz", imagem: "/fotos/unidade-oswaldo-cruz.svg" },
  { nome: "Mater Dei", imagem: "/fotos/unidade-mater-dei.svg" },
  { nome: "Hermes Pardini", imagem: "/fotos/unidade-hermes-pardini.svg" },
];
const FAQ = [
  { q: "Como faço para agendar uma consulta?", a: "Crie sua conta na área do paciente, escolha a especialidade, o profissional e o horário disponível. O agendamento é gravado no banco em tempo real." },
  { q: "Preciso ir à unidade para cancelar?", a: "Não. Pelo painel do paciente você acompanha, remarca ou cancela consultas dentro das regras da unidade." },
  { q: "Quem pode ver meu prontuário?", a: "Apenas você e os profissionais autorizados. As permissões são aplicadas no banco de dados por políticas de segurança." },
  { q: "O ClinicxFlow atende empresas?", a: "Sim. Há atendimento empresarial com check-ups periódicos e relatórios consolidados para o RH." },
];

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: especialidades }, { data: unidades }] = await Promise.all([
    supabase.from("especialidades").select("id, nome, descricao").eq("status", "ativo").order("nome").limit(9),
    supabase.from("unidades").select("id, nome, endereco, cidade, telefone, horario_funcionamento").eq("status", "ativo"),
  ]);

  return (
    <>
      <HomeHeader />

      <HomeCarousel />

      <section className={styles.partnersSection} aria-labelledby="unidades-parceiras">
        <div className="cx-container">
          <div className={styles.partnersIntro}>
            <span className={styles.eyebrow}>Rede de cuidado</span>
            <h2 id="unidades-parceiras">Unidades Parceiras</h2>
            <p>Conectamos você a instituições de saúde reconhecidas em todo o Brasil.</p>
          </div>
          <div className={styles.partnersViewport}>
            <div className={styles.partnersTrack}>
              {[0, 1].map((group) => (
                <div className={styles.partnersGroup} key={group} aria-hidden={group === 1}>
                  {UNIDADES_PARCEIRAS.map((unidade) => (
                    <div className={styles.partnerLogo} key={`${group}-${unidade.nome}`}>
                      <img src={unidade.imagem} alt={group === 0 ? unidade.nome : ""} loading="lazy" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.helpSection}>
        <div className="cx-container">
          <div className={styles.helpIntro}>
            <span className={styles.eyebrow}>Como podemos te ajudar hoje?</span>
            <h2>Atendimento completo em saúde</h2>
          </div>

          <div className={styles.helpGrid}>
            <article className={styles.helpCard}>
              <div className={styles.helpIcon}>✚</div>
              <h3>Pronto atendimento</h3>
              <p>Resposta rápida para urgências e acompanhamento imediato com a equipe certa.</p>
              <Link href="/procurar-clinica">Saiba mais</Link>
            </article>

            <article className={styles.helpCard}>
              <div className={styles.helpIcon}>☰</div>
              <h3>Diagnósticos</h3>
              <p>Exames e avaliações com tecnologia para precisão no diagnóstico e no cuidado.</p>
              <Link href="/procurar-clinica">Saiba mais</Link>
            </article>

            <article className={styles.helpCard}>
              <div className={styles.helpIcon}>❤</div>
              <h3>Cardiologia</h3>
              <p>Cuidados preventivos, acompanhamento cardíaco e tratamento com excelência.</p>
              <Link href="/procurar-clinica">Saiba mais</Link>
            </article>

            <article className={styles.helpCard}>
              <div className={styles.helpIcon}>☼</div>
              <h3>Check-up</h3>
              <p>Programas de prevenção para cuidar da sua saúde com atenção e clareza.</p>
              <Link href="/procurar-clinica">Saiba mais</Link>
            </article>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className="cx-container">
          <div className={styles.sectionHead}>
            <h2>Um sistema, todos os processos da unidade</h2>
            <p>Do primeiro contato ao acompanhamento clínico, tudo registrado e conectado.</p>
          </div>
          <div className={styles.grid3}>
            {BENEFICIOS.map((b) => (
              <article key={b.t} className={`cx-card ${styles.tile}`}>
                <div className={styles.tileIcon}>{b.icon}</div>
                <h3>{b.t}</h3>
                <p>{b.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <SpecialtiesSection specialties={especialidades ?? []} />


      <section id="exames" className={styles.section}>
        <div className="cx-container">
          <div className={styles.sectionHead}>
            <h2>Exames e check-ups</h2>
            <p>Serviços diagnósticos e programas preventivos organizados por perfil.</p>
          </div>
          <div className={styles.grid3}>
            {CHECKUPS.map((c) => (
              <article key={c.t} className={`cx-card ${styles.tile}`}>
                <div className={styles.tileIcon}>✚</div>
                <h3>{c.t}</h3>
                <p>{c.d}</p>
              </article>
            ))}
          </div>
          <div className={styles.grid4} style={{ marginTop: "1.2rem" }}>
            {EXAMES.map((e) => (
              <article key={e} className={`cx-card ${styles.tile}`}>
                <h3 style={{ fontSize: "0.98rem", marginBottom: 0 }}>{e}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <DoctorSpace />

      <UnitsSection units={unidades ?? []} />

      <section id="faq" className={styles.section}>
        <div className="cx-container">
          <div className={styles.sectionHead}>
            <h2>Perguntas frequentes</h2>
            <p>As dúvidas mais comuns de pacientes e equipes.</p>
          </div>
          {FAQ.map((f) => (
            <details key={f.q} className={`cx-card ${styles.faqItem}`}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <PresentialCare />

      <HomeFooter />
    </>
  );
}




