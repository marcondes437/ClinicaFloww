import Link from "next/link";
import ConsultaTicket from "@/components/paciente/ConsultaTicket";
import HistoricoTimeline from "@/components/paciente/HistoricoTimeline";
import Panel from "@/components/Panel";
import { type ConsultaRow } from "@/components/ConsultasTable";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { CONSULTA_SELECT } from "@/lib/queries";
import { getPacienteDoUsuario } from "@/lib/paciente";
import styles from "./painel.module.css";

export const dynamic = "force-dynamic";

export default async function PainelPaciente() {
  const user = await requireRole(["paciente"]);
  const paciente = await getPacienteDoUsuario(user.id);
  const supabase = await createClient();

  const agora = new Date().toISOString();
  const { data: proximas } = paciente
    ? await supabase.from("consultas").select(CONSULTA_SELECT).eq("paciente_id", paciente.id).gte("data_hora", agora).order("data_hora")
    : { data: [] };
  const { data: anteriores } = paciente
    ? await supabase.from("consultas").select(CONSULTA_SELECT).eq("paciente_id", paciente.id).lt("data_hora", agora).order("data_hora", { ascending: false }).limit(10)
    : { data: [] };

  const proximasLista = (proximas ?? []) as unknown as ConsultaRow[];
  const anterioresLista = (anteriores ?? []) as unknown as ConsultaRow[];
  const realizadas = anterioresLista.filter((c) => c.status === "concluida").length;

  return (
    <>
      <ConsultaTicket consulta={proximasLista[0] ?? null} />

      <div className={styles.resumo}>
        <span>{realizadas} atendimento{realizadas === 1 ? "" : "s"} realizado{realizadas === 1 ? "" : "s"}</span>
        <span className={styles.ponto} aria-hidden="true">·</span>
        <span>Cadastro: {paciente?.nome_completo ?? user.nome}</span>
        {proximasLista.length > 1 && (
          <>
            <span className={styles.ponto} aria-hidden="true">·</span>
            <span>+{proximasLista.length - 1} outra{proximasLista.length - 1 === 1 ? "" : "s"} consulta{proximasLista.length - 1 === 1 ? "" : "s"} marcada{proximasLista.length - 1 === 1 ? "" : "s"}</span>
          </>
        )}
      </div>

      <Panel
        titulo="Histórico"
        descricao="Suas consultas anteriores, mais recentes primeiro."
        acao={<Link href="/paciente/agendar" className="cx-btn cx-btn-ghost">Agendar outra</Link>}
      >
        <HistoricoTimeline consultas={anterioresLista} />
      </Panel>
    </>
  );
}

