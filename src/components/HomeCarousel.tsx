"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./HomeCarousel.module.css";

const SLIDES = [
  { image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=2000&q=88", alt: "Interior iluminado de um hospital moderno", eyebrow: "Bem-vindo à ClinicaFlow", title: "Cuidar de você é o que nos move.", text: "Consultas, exames e um atendimento próximo. Encontre o cuidado que combina com cada momento da sua vida." },
  { image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=2000&q=88", alt: "Corredor de hospital com iluminação natural", eyebrow: "Cuidado para toda a família", title: "Presença e carinho em cada fase.", text: "Da infância à vida adulta, encontre especialidades para acompanhar quem você ama." },
  { image: "https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=2000&q=88", alt: "Profissional de saúde preparando atendimento", eyebrow: "Atenção em cada detalhe", title: "Você merece ser ouvido e bem cuidado.", text: "Conheça nossas especialidades e encontre um atendimento pensado para as suas necessidades." },
  { image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=2000&q=88", alt: "Médica analisando informações de uma paciente", eyebrow: "Um passo de cada vez", title: "Mais atenção à sua saúde, todos os dias.", text: "Organize suas consultas e exames com facilidade e mantenha o cuidado presente na sua rotina." },
  { image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=2000&q=88", alt: "Alimentos coloridos e saudáveis sobre uma mesa", eyebrow: "Bem-estar na sua rotina", title: "Boas escolhas começam com cuidado.", text: "Encontre acompanhamento especializado para cuidar da alimentação e do seu bem-estar." },
  { image: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=2000&q=88", alt: "Equipe médica reunida em um ambiente hospitalar", eyebrow: "Conectados ao seu cuidado", title: "Mais facilidade para seguir em frente.", text: "Escolha sua especialidade, encontre uma unidade e dê o próximo passo no seu atendimento." },
];

export function ClinicLogo({ light = false }: { light?: boolean }) {
  return <span className={`${styles.logo} ${light ? styles.logoLight : ""}`}><img src="/fotos/logo-transparente.png" alt="ClinicaFlow" /></span>;
}

export default function HomeCarousel() {
  const [active, setActive] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update(); media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (reducedMotion) return;
    const timer = window.setInterval(() => setActive(current => (current + 1) % SLIDES.length), 5000);
    return () => window.clearInterval(timer);
  }, [reducedMotion]);
  const slide = SLIDES[active];
  function select(index: number) { setActive((index + SLIDES.length) % SLIDES.length); }

  return <section className={styles.carousel} aria-label="Destaques da ClinicaFlow" aria-roledescription="carrossel">
    <div className={`cx-container ${styles.layout}`}>
      <div className={styles.content}>
        <div aria-live={reducedMotion ? "polite" : "off"} aria-atomic="true">
          <h1>{slide.title}</h1>
          <p className={styles.description}>{slide.text}</p>
        </div>
        <form action="/procurar-clinica" method="get" className={styles.heroSearch} role="search">
          <input name="busca" type="search" placeholder="Busque por especialidade ou profissional" aria-label="Buscar especialidade ou profissional" />
          <button type="submit" aria-label="Buscar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="10.5" cy="10.5" r="7" /><path d="m16 16 5 5" /></svg></button>
        </form>
        <div className={styles.actions}>
          <Link href="/agendamento-online" className={styles.primary}>Agendar consulta <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><rect x="4" y="5" width="16" height="16" rx="3" /><path d="M8 3v4m8-4v4M4 11h16m-12 5 2 2 5-5" /></svg></Link>
          <a href="#especialidades" className={styles.secondary}>Encontrar especialidade <span aria-hidden="true">→</span></a>
        </div>
      </div>
      <div className={styles.visual}>
        <div className={styles.imageFrame} role="img" aria-label={slide.alt} style={{ backgroundImage: `url("${slide.image}")` }} />
      </div>
      <div className={styles.controls}>
        <div className={styles.dots} aria-label="Selecionar destaque">{SLIDES.map((item, index) => <button type="button" key={item.title} onClick={() => select(index)} aria-label={`Destaque ${index + 1}: ${item.eyebrow}`} aria-current={index === active ? "true" : undefined}><span /></button>)}</div>
      </div>
    </div>
  </section>;
}
