import Link from "next/link";
import styles from "./HomeFooter.module.css";

function Arrow() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>;
}

export default function HomeFooter() {
  return (
    <footer className={styles.footer}>
      <div className="cx-container">
        <div className={styles.intro}>
          <div>
            <span className={styles.eyebrow}>Cuidado em cada etapa</span>
            <h2>Seu próximo passo é cuidar de você.</h2>
            <p>Encontre uma unidade e agende seu atendimento com facilidade.</p>
          </div>
          <Link href="/agendamento-online" className={styles.schedule}>Agendar consulta <Arrow /></Link>
        </div>
        <div className={styles.columns}>
          <div className={styles.brand}>
            <Link href="/" className={styles.brandLink} aria-label="ClinicaFlow — página inicial">
              <img src="/fotos/logo-transparente.png" alt="ClinicaFlow" width="180" height="72" />
            </Link>
            <p>Tecnologia que aproxima.<br />Cuidado que acompanha.</p>
            <span className={styles.brandCaption}>Consultas, exames e saúde em um só lugar.</span>
            <Link href="/sobre" className={styles.aboutLink}>Conheça a ClinicaFlow <Arrow /></Link>
          </div>
          <nav aria-labelledby="footer-patients">
            <h2 id="footer-patients">Para você</h2>
            <ul>
              <li><Link href="/procurar-clinica">Encontre uma clínica</Link></li>
              <li><a href="/#especialidades">Especialidades</a></li>
              <li><a href="/#exames">Exames e check-ups</a></li>
              <li><a href="/#faq">Perguntas frequentes</a></li>
            </ul>
          </nav>
          <nav aria-labelledby="footer-access">
            <h2 id="footer-access">Acessos e serviços</h2>
            <ul>
              <li><Link href="/portal-paciente">Portal do paciente</Link></li>
              <li><Link href="/portal-medico">Portal do médico</Link></li>
              <li><Link href="/login">Sistema da clínica</Link></li>
              <li><a href="/#unidades">Nossas unidades</a></li>
              <li><a href="/#contato">Atendimento presencial</a></li>
            </ul>
          </nav>
          <div className={styles.contact}>
            <div className={styles.contactDetails}>
              <h2>Fale com a gente</h2>
              <span className={styles.contactLabel}>Central de atendimento</span>
              <a href="tel:+551148472314" className={styles.phone}>(11) 4847-2314</a>
              <a href="tel:+5511941979206" className={styles.secondaryPhone}>(11) 94197-9206</a>
              <div className={styles.hours}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
                <p>Segunda a sexta, 9h às 20h<br />Sábado, 9h às 14h</p>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.information}>
          <div className={styles.locationDetails}>
          <div className={styles.location}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg>
            <address>Avenida Paulista · São Paulo – SP<br /><span className={styles.demoLabel}>Localização ilustrativa para teste</span></address>
          </div>
          <p className={styles.notice}>Consulte a unidade para horários, valores e formas de pagamento.</p>
          </div>
          <div className={styles.map}>
            <iframe
              title="Mapa de localização de teste — Avenida Paulista, São Paulo"
              src="https://www.google.com/maps?q=Avenida+Paulista,+Sao+Paulo,+Brasil&z=15&output=embed"
              width="480"
              height="130"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <a href="https://www.google.com/maps?q=Avenida+Paulista,+Sao+Paulo,+Brasil" target="_blank" rel="noopener noreferrer">Abrir mapa <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <div className={styles.bottom}>
          <p>© {new Date().getFullYear()} ClinicaFlow. Todos os direitos reservados.</p>
          <a href="#">Voltar ao topo <span aria-hidden="true">↑</span></a>
        </div>
      </div>
    </footer>
  );
}
