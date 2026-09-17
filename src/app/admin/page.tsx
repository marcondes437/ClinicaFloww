import Panel from "@/components/Panel";
import StatCards from "@/components/StatCards";
import ConsultasTable, { type ConsultaRow } from "@/components/ConsultasTable";
import { getIndicadores, CONSULTA_SELECT } from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";
import { moeda, inicioDoDia, fimDoDia } from "@/lib/format";
import GraficoConsultas from "@/components/GraficoConsultas";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const indicadores = await getIndicadores();

  const { data: hoje } = await supabase
    .from("consultas")
    .select(CONSULTA_SELECT)
    .gte("data_hora", inicioDoDia())
    .lte("data_hora", fimDoDia())
    .order("data_hora");

  const { data: porEspecialidade } = await supabase
    .from("consultas")
    .select("especialidades(nome)");

  const contagem = new Map<string, number>();
  (porEspecialidade ?? []).forEach((c) => {
    const nome = (c.especialidades as unknown as { nome: string } | null)?.nome ?? "Sem especialidade";
    contagem.set(nome, (contagem.get(nome) ?? 0) + 1);
  });
  const dadosGrafico = [...contagem.entries()].map(([nome, total]) => ({ nome, total }));

  return (
    <>
      <StatCards
        stats={[
          { label: "Pacientes ativos", value: indicadores.pacientes },
          { label: "Consultas hoje", value: indicadores.consultasHoje },
          { label: "Agendadas", value: indicadores.agendadas },
          { label: "Concluídas", value: indicadores.concluidas },
          { label: "Canceladas", value: indicadores.canceladas },
          { label: "Profissionais", value: indicadores.profissionais },
          { label: "Unidades", value: indicadores.unidades },
          { label: "Faturamento", value: moeda(indicadores.faturamento), hint: "consultas concluídas" },
        ]}
      />

      <Panel titulo="Consultas por especialidade" descricao="Dados carregados do banco em tempo real.">
        <GraficoConsultas dados={dadosGrafico} />
      </Panel>

      <Panel titulo="Agenda de hoje" descricao="Todos os atendimentos programados para o dia.">
        <ConsultasTable
          consultas={(hoje ?? []) as unknown as ConsultaRow[]}
          podeAlterarStatus
          linkPaciente="/admin/pacientes"
        />
      </Panel>
    </>
  );
}
