import AppShell from "@/components/AppShell";
import { requireRole } from "@/lib/auth";
import { NAV_BY_ROLE } from "@/lib/nav";

export default async function PacienteLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole(["paciente"]);
  return (
    <AppShell role="paciente" nome={user.nome} email={user.email} nav={NAV_BY_ROLE.paciente}
      titulo="Área do paciente" descricao="Seus agendamentos, histórico e informações de saúde.">
      {children}
    </AppShell>
  );
}
