import Panel from "@/components/Panel";
import ConsultaForm from "@/components/ConsultaForm";
import { requireRole } from "@/lib/auth";
import { getOpcoes } from "@/lib/queries";
import { getPacienteDoUsuario } from "@/lib/paciente";

export const dynamic = "force-dynamic";

export default async function AgendarPage() {
  const user = await requireRole(["paciente"]);
  const paciente = await getPacienteDoUsuario(user.id);
  const opcoes = await getOpcoes();

  if (!paciente) {
    return (
      <Panel titulo="Agendar consulta">
        <div className="cx-alert cx-alert-error">
          Seu cadastro de paciente ainda não foi criado. Fale com a recepção da unidade.
        </div>
      </Panel>
    );
  }

  return (
    <Panel titulo="Agendar consulta" descricao="Escolha a especialidade e um horário. O médico será definido automaticamente.">
      <ConsultaForm
        pacienteFixo={paciente.id}
        especialidades={opcoes.especialidades}
        unidades={opcoes.unidades}
        horarios={opcoes.horarios}
      />
    </Panel>
  );
}
