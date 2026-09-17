"use client";

import { useActionState, useMemo, useState } from "react";
import { criarConsulta } from "@/lib/actions";
import styles from "./FormCard.module.css";

type Opcao = { id: string; nome: string };
type Horario = {
  especialidade_id: string;
  unidade_id: string;
  data_hora: string;
  vagas: number;
};
const estado0 = {} as { ok?: string; erro?: string };

export default function ConsultaForm({
  pacientes,
  especialidades,
  unidades,
  horarios,
  pacienteFixo,
}: {
  pacientes?: Opcao[];
  especialidades: Opcao[];
  unidades: Opcao[];
  horarios: Horario[];
  pacienteFixo?: string;
}) {
  const [state, action, pending] = useActionState(criarConsulta, estado0);
  const [especialidade, setEspecialidade] = useState("");
  const [unidade, setUnidade] = useState("");

  const unidadesDisponiveis = useMemo(() => {
    const ids = new Set(
      horarios
        .filter((h) => !especialidade || h.especialidade_id === especialidade)
        .map((h) => h.unidade_id)
    );
    return unidades.filter((item) => ids.has(item.id));
  }, [especialidade, horarios, unidades]);

  const horariosDisponiveis = useMemo(
    () =>
      horarios.filter(
        (h) => h.especialidade_id === especialidade && h.unidade_id === unidade
      ),
    [especialidade, horarios, unidade]
  );

  return (
    <form action={action} className={styles.form}>
      {state?.erro && <div className={`cx-alert cx-alert-error ${styles.full}`}>{state.erro}</div>}
      {state?.ok && <div className={`cx-alert cx-alert-ok ${styles.full}`}>{state.ok}</div>}

      {pacienteFixo ? (
        <input type="hidden" name="paciente_id" value={pacienteFixo} />
      ) : (
        <div className="cx-field">
          <label>Paciente *</label>
          <select name="paciente_id" required defaultValue="">
            <option value="" disabled>Selecione</option>
            {(pacientes ?? []).map((p) => (
              <option key={p.id} value={p.id}>{p.nome}</option>
            ))}
          </select>
        </div>
      )}

      <div className="cx-field">
        <label>Especialidade *</label>
        <select
          name="especialidade_id"
          required
          value={especialidade}
          onChange={(event) => {
            setEspecialidade(event.target.value);
            setUnidade("");
          }}
        >
          <option value="">Selecione a especialidade</option>
          {especialidades.map((e) => <option key={e.id} value={e.id}>{e.nome}</option>)}
        </select>
      </div>

      <div className="cx-field">
        <label>Unidade *</label>
        <select
          name="unidade_id"
          required
          value={unidade}
          onChange={(event) => setUnidade(event.target.value)}
          disabled={!especialidade}
        >
          <option value="">Selecione a unidade</option>
          {unidadesDisponiveis.map((u) => <option key={u.id} value={u.id}>{u.nome}</option>)}
        </select>
      </div>

      <div className="cx-field">
        <label>Horário disponível *</label>
        <select name="data_hora" required defaultValue="" key={`${especialidade}:${unidade}`} disabled={!unidade}>
          <option value="">Selecione o horário</option>
          {horariosDisponiveis.map((h) => (
            <option key={h.data_hora} value={h.data_hora}>
              {new Intl.DateTimeFormat("pt-BR", {
                dateStyle: "short",
                timeStyle: "short",
              }).format(new Date(h.data_hora))}
              {h.vagas > 1 ? ` · ${h.vagas} vagas` : ""}
            </option>
          ))}
        </select>
      </div>

      <p className={styles.full} style={{ color: "var(--cx-muted)", margin: 0 }}>
        Você escolhe a especialidade e o horário. O sistema seleciona automaticamente um médico disponível.
      </p>

      <div className={`cx-field ${styles.full}`}>
        <label>Motivo / queixa</label>
        <input name="motivo" placeholder="Ex.: consulta de rotina" />
      </div>

      <div className={styles.footer}>
        <button className="cx-btn cx-btn-primary" disabled={pending}>
          {pending ? "Agendando..." : "Agendar consulta"}
        </button>
      </div>
    </form>
  );
}
