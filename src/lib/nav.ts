import type { NavItem } from "@/components/AppShell";
import type { AppRole } from "@/lib/roles";

export const NAV_BY_ROLE: Record<AppRole, NavItem[]> = {
  admin: [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/pacientes", label: "Pacientes" },
    { href: "/admin/profissionais", label: "Profissionais" },
    { href: "/admin/especialidades", label: "Especialidades" },
    { href: "/admin/unidades", label: "Unidades" },
    { href: "/admin/agenda", label: "Agenda e consultas" },
  ],
  gestor: [
    { href: "/gestor", label: "Indicadores" },
    { href: "/gestor/agenda", label: "Agenda" },
  ],
  medico: [
    { href: "/medico", label: "Minha agenda" },
    { href: "/medico/pacientes", label: "Meus pacientes" },
  ],
  enfermeiro: [
    { href: "/enfermagem", label: "Atendimentos" },
  ],
  recepcionista: [
    { href: "/recepcao", label: "Painel do dia" },
    { href: "/recepcao/pacientes", label: "Pacientes" },
    { href: "/recepcao/agenda", label: "Agendamentos" },
  ],
  paciente: [
    { href: "/paciente", label: "Meu painel" },
    { href: "/paciente/agendar", label: "Agendar consulta" },
    { href: "/paciente/historico", label: "Meu histórico" },
  ],
};
