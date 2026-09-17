import Link from "next/link";
import styles from "./HomeFooter.module.css";

const mapUrl = "https://www.google.com/maps?q=Av.+S%C3%A3o+Paulo,+154,+Mogi+das+Cruzes,+SP";

export default function HomeFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.columns}>
          <div className={styles.brand}>
            <Link href="/" className={styles.brandLink} aria-label="ClinicaFlow — página inicial">
              <img src="/fotos/logo-transparente.png" alt="ClinicaFlow" width="174" height="80" />
            </Link>
            <p>Saúde, tecnologia e inovação com um atendimento personalizado que você merece.</p>
            <strong>CLINICXFLOW - SISTEMA DE SERVIÇOS MÉDICOS</strong>
          </div>
          <section className={styles.contact} aria-labelledby="footer-contact">
            <h2 id="footer-contact">Contato</h2>
            <div className={styles.phones}>
              <a href="tel:+551148472314">Telefone: (11) 4847-2314</a>
              <a href="tel:+551147982522">(11) 4798-2522</a>
              <a href="tel:+551126027500">(11) 2602-7500</a>
              <a href="https://wa.me/5511941979206" target="_blank" rel="noopener noreferrer">WhatsApp: (11) 94197-9206</a>
            </div>
          </section>
          <section className={styles.location} aria-labelledby="footer-location">
            <h2 id="footer-location">Localização</h2>
            <address>Av. São Paulo, 154 - Jardim Armenia,<br />Mogi das Cruzes - SP, 08780-570</address>
            <h2 className={styles.hoursTitle}>Horário de Atendimento</h2>
            <p>Segunda a Sexta: 9h00 às 20h00<br />Sábado: 9h00 às 14h00</p>
          </section>
          <div className={styles.map}>
            <iframe title="Localização da ClinicaFlow — Mogi das Cruzes" src={`${mapUrl}&output=embed`} width="375" height="310" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
            <a href={mapUrl} target="_blank" rel="noopener noreferrer">Abrir no Maps <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <p className={styles.copyright}>© {new Date().getFullYear()} ClinicaFlow. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
