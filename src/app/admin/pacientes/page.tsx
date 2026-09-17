import Link from "next/link";
import Panel from "@/components/Panel";
import PacienteForm from "@/components/PacienteForm";
import { createClient } from "@/lib/supabase/server";
import { dataCurta } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function PacientesPage({
  searchParams,
}: {
  searchParams: Promise<{ busca?: string }>;
}) {
  const { busca } = await searchParams;
  const supabase = await createClient();

  let query = supabase.from("pacientes").select("*").order("nome_completo");
  if (busca) query = query.ilike("nome_completo", `%${busca}%`);
  const { data: pacientes } = await query;

  return (
    <>
      <Panel
        titulo="Pacientes"
        descricao="Lista completa com busca por nome."
        acao={
          <form style={{ display: "flex", gap: "0.5rem" }}>
            <input name="busca" defaultValue={busca ?? ""} placeholder="Buscar paciente..."
              style={{ padding: "0.55rem 0.8rem", border: "1px solid var(--cx-line)", borderRadius: 10 }} />
            <button className="cx-btn cx-btn-ghost">Buscar</button>
          </form>
        }
      >
        <table className="cx-table">
          <thead>
            <tr><th>Nome</th><th>CPF</th><th>Nascimento</th><th>Celular</th><th>Cidade</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {(pacientes ?? []).map((p) => (
              <tr key={p.id}>
                <td><strong>{p.nome_completo}</strong></td>
                <td>{p.cpf ?? "—"}</td>
                <td>{dataCurta(p.data_nascimento)}</td>
                <td>{p.celular ?? p.telefone ?? "—"}</td>
                <td>{p.cidade ?? "—"}</td>
                <td><span className={`cx-badge ${p.status === "ativo" ? "cx-badge-ok" : ""}`}>{p.status}</span></td>
                <td><Link href={`/admin/pacientes/${p.id}`} style={{ color: "var(--cx-teal-700)", fontWeight: 600 }}>Ver ficha</Link></td>
              </tr>
            ))}
            {!pacientes?.length && <tr><td colSpan={7}>Nenhum paciente encontrado.</td></tr>}
          </tbody>
        </table>
      </Panel>

      <Panel titulo="Cadastrar paciente" descricao="Os dados são gravados no banco imediatamente.">
        <PacienteForm />
      </Panel>
    </>
  );
}
