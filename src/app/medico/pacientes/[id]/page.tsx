import { notFound } from "next/navigation";
import Panel from "@/components/Panel";
import ConsultasTable, { type ConsultaRow } from "@/components/ConsultasTable";
import EvolucaoForm from "@/components/EvolucaoForm";
import { createClient } from "@/lib/supabase/server";
import { CONSULTA_SELECT } from "@/lib/queries";
import { dataCurta, dataHora } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ProntuarioMedico({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: paciente } = await supabase.from("pacientes").select("*").eq("id", id).maybeSingle();
  if (!paciente) notFound();

  const [{ data: consultas }, { data: evolucoes }] = await Promise.all([
    supabase.from("consultas").select(CONSULTA_SELECT).eq("paciente_id", id).order("data_hora", { ascending: false }),
    supabase.from("evolucoes").select("id, descricao, created_at").eq("paciente_id", id).order("created_at", { ascending: false }),
  ]);

  return (
    <>
      <Panel titulo={paciente.nome_completo} descricao={`Nascimento: ${dataCurta(paciente.data_nascimento)} · Celular: ${paciente.celular ?? "—"}`}>
        <p style={{ margin: 0, color: "var(--cx-muted)" }}>{paciente.observacoes ?? "Sem observações registradas."}</p>
      </Panel>

      <Panel titulo="Atendimentos">
        <ConsultasTable consultas={(consultas ?? []) as unknown as ConsultaRow[]} podeAlterarStatus />
      </Panel>

      <Panel titulo="Evolução clínica">
        {(evolucoes ?? []).map((e) => (
          <article key={e.id} style={{ borderLeft: "3px solid var(--cx-teal-300)", paddingLeft: "0.9rem", marginBottom: "1rem" }}>
            <div style={{ fontSize: "0.8rem", color: "var(--cx-muted)" }}>{dataHora(e.created_at)}</div>
            <p style={{ margin: "0.2rem 0 0" }}>{e.descricao}</p>
          </article>
        ))}
        {!evolucoes?.length && <p style={{ color: "var(--cx-muted)" }}>Nenhuma evolução registrada.</p>}
        <EvolucaoForm pacienteId={id} />
      </Panel>
    </>
  );
}
