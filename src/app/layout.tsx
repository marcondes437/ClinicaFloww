import type { Metadata } from "next";
import SiteAssistant from "@/components/SiteAssistant";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClinicxFlow — Gestão e atendimento em saúde",
  description:
    "Plataforma integrada para clínicas, consultórios e UBS: pacientes, agenda, prontuário, indicadores e gestão em um só lugar.",
  openGraph: {
    title: "ClinicxFlow — Gestão e atendimento em saúde",
    description:
      "Pacientes, agenda, prontuário eletrônico e indicadores integrados em uma única plataforma.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}<SiteAssistant aiEnabled={Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_MODEL)} /></body>
    </html>
  );
}
