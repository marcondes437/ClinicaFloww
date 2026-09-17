import Panel from "@/components/Panel";
import StatCards from "@/components/StatCards";
import ConsultasTable, { type ConsultaRow } from "@/components/ConsultasTable";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { CONSULTA_SELECT } from "@/lib/queries";
import { getProfissionalDoUsuario } from "@/lib/profissional";
import { fimDoDia, inicioDoDia } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AgendaMedico() {
  const user = await requireRole(["medico"]);
  const profissional = await getProfissionalDoUsuario(user.id);
  const supabase = await createClient();

  const base = () => supabase.from("consultas").select(CONSULTA_SELECT).order("data_hora");
  const hojeQuery = profissional
    ? base().eq("profissional_id", profissional.id).gte("data_hora", inicioDoDia()).lte("data_hora", fimDoDia())
    : base().gte("data_hora", inicioDoDia()).lte("data_hora", fimDoDia());

  const { data: hoje } = await hojeQuery;
  const { data: proximas } = profissional
    ? await base().eq("profissional_id", profissional.id).gt("data_hora", fimDoDia()).limit(30)
    : await base().gt("data_hora", fimDoDia()).limit(30);

  return (
    <>
      {!profissional && (
        <div className="cx-alert cx-alert-error">
          Seu usuário ainda não está vinculado a um cadastro de profissional. Peça ao administrador para
          preencher o campo <strong>user_id</strong> do seu registro em Profissionais.
        </div>
      )}

      <StatCards
        stats={[
          { label: "Atendimentos hoje", value: hoje?.length ?? 0 },
          { label: "Próximos agendados", value: proximas?.length ?? 0 },
          { label: "Profissional", value: profissional?.nome ?? user.nome },
        ]}
      />

      <Panel titulo="Minha agenda de hoje" descricao="Atualize o status conforme o atendimento avança.">
        <ConsultasTable consultas={(hoje ?? []) as unknown as ConsultaRow[]} podeAlterarStatus linkPaciente="/medico/pacientes" />
      </Panel>

      <Panel titulo="Próximos atendimentos">
        <ConsultasTable consultas={(proximas ?? []) as unknown as ConsultaRow[]} linkPaciente="/medico/pacientes" />
      </Panel>
    </>
  );
}
