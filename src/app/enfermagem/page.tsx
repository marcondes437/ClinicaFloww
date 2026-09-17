import Panel from "@/components/Panel";
import StatCards from "@/components/StatCards";
import ConsultasTable, { type ConsultaRow } from "@/components/ConsultasTable";
import { createClient } from "@/lib/supabase/server";
import { CONSULTA_SELECT } from "@/lib/queries";
import { fimDoDia, inicioDoDia } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function PainelEnfermagem() {
  const supabase = await createClient();
  const { data: hoje } = await supabase
    .from("consultas").select(CONSULTA_SELECT)
    .gte("data_hora", inicioDoDia()).lte("data_hora", fimDoDia()).order("data_hora");

  const emAtendimento = (hoje ?? []).filter((c) => c.status === "em_atendimento").length;

  return (
    <>
      <StatCards stats={[
        { label: "Atendimentos hoje", value: hoje?.length ?? 0 },
        { label: "Em atendimento", value: emAtendimento },
      ]} />
      <Panel titulo="Atendimentos do dia" descricao="Registre a evolução pela ficha do paciente.">
        <ConsultasTable consultas={(hoje ?? []) as unknown as ConsultaRow[]} podeAlterarStatus />
      </Panel>
    </>
  );
}
