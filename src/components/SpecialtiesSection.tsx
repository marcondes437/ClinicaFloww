"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./SpecialtiesSection.module.css";

type Specialty = { id: string; nome: string; descricao: string | null };
const images: Record<string, string> = {
  cardiologia: "/fotos/cardiologi.jpg",
  "clinica geral": "/fotos/clinicageral.jpg",
  dermatologia: "/fotos/especialidade-dermatologia.png",
  enfermagem: "/fotos/enfermagem.jpg",
  ginecologia: "/fotos/ginecologia.jpg",
  nutricao: "/fotos/nutrição.png",
  odontologia: "/fotos/especialidade-odontologia.jpg",
  ortopedia: "/fotos/especialidade-ortopedia.png",
  pediatria: "/fotos/especialidade-pediatria.png",
};
const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

export default function SpecialtiesSection({ specialties }: { specialties: Specialty[] }) {
  const [search, setSearch] = useState("");
  const filtered = specialties.filter(specialty => normalize(specialty.nome).includes(normalize(search)));
  return <section id="especialidades" className={styles.section} aria-labelledby="specialties-title">
    <div className="cx-container">
      <div className={styles.heading}>
        <div><span className={styles.eyebrow}><span aria-hidden="true" />Nossas especialidades</span><h2 id="specialties-title">Cada pessoa é única.<br /><span>O cuidado também.</span></h2></div>
        <p>Encontre a especialidade que você procura e dê o próximo passo no cuidado com a sua saúde.</p>
      </div>
      {specialties.length > 0 && <div className={styles.toolbar}>
        <p role="status">{filtered.length} {filtered.length === 1 ? "especialidade disponível" : "especialidades disponíveis"}</p>
        <div className={styles.search}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4.5 4.5" /></svg>
          <input type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Qual especialidade você procura?" aria-label="Buscar especialidade pelo nome" />
        </div>
      </div>}
      <div className={styles.grid}>
        {filtered.map(specialty => <article className={styles.card} key={specialty.id}>
          <div className={styles.photo}>
            <img src={images[normalize(specialty.nome)] ?? "/fotos/clinicageral.jpg"} alt={`Imagem ilustrativa de atendimento em ${specialty.nome}`} loading="lazy" />
            <span className={styles.photoLabel}>Cuidado especializado</span>
          </div>
          <div className={styles.body}>
            <div className={styles.title}><h3>{specialty.nome}</h3><span className={styles.icon} aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 4h6v5h5v6h-5v5H9v-5H4V9h5Z" /></svg></span></div>
            <p>{specialty.descricao || "Conheça as opções de atendimento e encontre o cuidado para a sua rotina."}</p>
            <Link href="/agendamento-online" aria-label={`Buscar atendimento em ${specialty.nome}`} className={styles.link}>Buscar atendimento<span className={styles.arrow} aria-hidden="true">↗</span></Link>
          </div>
        </article>)}
      </div>
      {filtered.length === 0 && <div className={styles.empty}><h3>{specialties.length ? "Não encontramos essa especialidade" : "Novas especialidades em breve"}</h3><p>{specialties.length ? "Tente outro nome ou confira todas as opções disponíveis." : "Entre em contato com uma unidade para conhecer as opções de atendimento."}</p>{specialties.length > 0 ? <button type="button" onClick={() => setSearch("")}>Ver todas as especialidades</button> : <Link href="/#unidades">Conhecer unidades →</Link>}</div>}
      <div className={styles.help}><span>Precisa de mais informações sobre o atendimento?</span><Link href="/#unidades">Fale com uma unidade <span aria-hidden="true">→</span></Link></div>
    </div>
  </section>;
}
