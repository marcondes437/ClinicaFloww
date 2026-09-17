import type { Metadata } from "next";
import ServicesWidget from "@/components/ServicesWidget";
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
      <body>{children}<ServicesWidget /></body>
    </html>
  );
}
