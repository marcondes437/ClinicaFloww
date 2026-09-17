import Panel from "@/components/Panel";
import ConsultaForm from "@/components/ConsultaForm";
import DisponibilidadeForm from "@/components/DisponibilidadeForm";
import ConsultasTable, { type ConsultaRow } from "@/components/ConsultasTable";
import { createClient } from "@/lib/supabase/server";
import { CONSULTA_SELECT, getOpcoes } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AgendaAdmin({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const supabase = await createClient();
  const opcoes = await getOpcoes();

  let query = supabase.from("consultas").select(CONSULTA_SELECT).order("data_hora", { ascending: false }).limit(100);
  if (status) query = query.eq("status", status);
  const { data: consultas } = await query;

  return (
    <>
      <Panel
        titulo="Agenda e consultas"
        descricao="Filtre por status e atualize a situação de cada atendimento."
        acao={
          <form style={{ display: "flex", gap: "0.5rem" }}>
            <select name="status" defaultValue={status ?? ""} style={{ padding: "0.5rem", borderRadius: 10, border: "1px solid var(--cx-line)" }}>
              <option value="">Todos os status</option>
              <option value="agendada">Agendada</option>
              <option value="confirmada">Confirmada</option>
              <option value="em_atendimento">Em atendimento</option>
              <option value="concluida">Concluída</option>
              <option value="cancelada">Cancelada</option>
              <option value="faltou">Faltou</option>
            </select>
            <button className="cx-btn cx-btn-ghost">Filtrar</button>
          </form>
        }
      >
        <ConsultasTable consultas={(consultas ?? []) as unknown as ConsultaRow[]} podeAlterarStatus linkPaciente="/admin/pacientes" />
      </Panel>

      <Panel titulo="Novo agendamento">
        <ConsultaForm
          pacientes={opcoes.pacientes}
          especialidades={opcoes.especialidades}
          unidades={opcoes.unidades}
          horarios={opcoes.horarios}
        />
      </Panel>

      <Panel titulo="Disponibilidade médica" descricao="Libere horários da agenda de cada profissional.">
        <DisponibilidadeForm profissionais={opcoes.profissionais} />
      </Panel>
    </>
  );
}
