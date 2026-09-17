"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function str(fd: FormData, k: string) {
  const v = fd.get(k);
  return typeof v === "string" && v.trim() !== "" ? v.trim() : null;
}

export async function criarPaciente(_prev: unknown, formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("pacientes").insert({
    nome_completo: str(formData, "nome_completo") ?? "",
    cpf: str(formData, "cpf"),
    data_nascimento: str(formData, "data_nascimento"),
    telefone: str(formData, "telefone"),
    celular: str(formData, "celular"),
    email: str(formData, "email"),
    endereco: str(formData, "endereco"),
    cidade: str(formData, "cidade"),
    estado: str(formData, "estado"),
    cep: str(formData, "cep"),
    contato_emergencia: str(formData, "contato_emergencia"),
    observacoes: str(formData, "observacoes"),
  });

  if (error) return { erro: error.message };
  revalidatePath("/admin/pacientes");
  revalidatePath("/recepcao/pacientes");
  return { ok: "Paciente cadastrado com sucesso." };
}

export async function criarEspecialidade(_prev: unknown, formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("especialidades").insert({
    nome: str(formData, "nome") ?? "",
    descricao: str(formData, "descricao"),
  });
  if (error) return { erro: error.message };
  revalidatePath("/admin/especialidades");
  revalidatePath("/");
  return { ok: "Especialidade cadastrada." };
}

export async function criarUnidade(_prev: unknown, formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("unidades").insert({
    nome: str(formData, "nome") ?? "",
    endereco: str(formData, "endereco"),
    cidade: str(formData, "cidade"),
    estado: str(formData, "estado"),
    telefone: str(formData, "telefone"),
    email: str(formData, "email"),
    horario_funcionamento: str(formData, "horario_funcionamento"),
  });
  if (error) return { erro: error.message };
  revalidatePath("/admin/unidades");
  revalidatePath("/");
  return { ok: "Unidade cadastrada." };
}

export async function criarProfissional(_prev: unknown, formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("profissionais").insert({
    nome: str(formData, "nome") ?? "",
    registro_profissional: str(formData, "registro_profissional"),
    especialidade_id: str(formData, "especialidade_id"),
    unidade_id: str(formData, "unidade_id"),
    telefone: str(formData, "telefone"),
    email: str(formData, "email"),
    descricao: str(formData, "descricao"),
  });
  if (error) return { erro: error.message };
  revalidatePath("/admin/profissionais");
  revalidatePath("/");
  return { ok: "Profissional cadastrado." };
}

export async function criarConsulta(_prev: unknown, formData: FormData) {
  const supabase = await createClient();
  const dataHora = str(formData, "data_hora");
  const especialidadeId = str(formData, "especialidade_id");
  const unidadeId = str(formData, "unidade_id");
  if (!dataHora || !especialidadeId || !unidadeId) {
    return { erro: "Selecione especialidade, unidade e um horário disponível." };
  }

  const pacienteId = str(formData, "paciente_id");
  if (!pacienteId) return { erro: "Selecione o paciente." };

  const { data, error } = await supabase.rpc("agendar_consulta_automaticamente", {
    _paciente_id: pacienteId,
    _especialidade_id: especialidadeId,
    _unidade_id: unidadeId,
    _data_hora: dataHora,
    _motivo: str(formData, "motivo"),
  });

  if (error) {
    const indisponivel = error.message.toLowerCase().includes("indisponível");
    return {
      erro: indisponivel
        ? "Esse horário acabou de ser reservado. Atualize a página e escolha outro."
        : "Não foi possível agendar a consulta. Confira os dados e tente novamente.",
    };
  }

  const profissional = data?.[0]?.nome_profissional;
  revalidatePath("/admin/agenda");
  revalidatePath("/recepcao/agenda");
  revalidatePath("/medico");
  revalidatePath("/paciente");
  revalidatePath("/paciente/agendar");
  return {
    ok: profissional
      ? `Consulta agendada. Profissional responsável: ${profissional}.`
      : "Consulta agendada. O profissional responsável já aparece no seu painel.",
  };
}

export async function criarDisponibilidade(_prev: unknown, formData: FormData) {
  const supabase = await createClient();
  const profissionalId = str(formData, "profissional_id");
  const dataHoraLocal = str(formData, "data_hora");

  if (!profissionalId || !dataHoraLocal) {
    return { erro: "Selecione o profissional e a data com horário." };
  }

  const { data: profissional, error: profissionalError } = await supabase
    .from("profissionais")
    .select("especialidade_id, unidade_id")
    .eq("id", profissionalId)
    .eq("status", "ativo")
    .maybeSingle();

  if (profissionalError || !profissional?.especialidade_id || !profissional.unidade_id) {
    return { erro: "O profissional precisa ter especialidade e unidade cadastradas." };
  }

  const dataHora = /(?:Z|[+-]\d{2}:\d{2})$/.test(dataHoraLocal)
    ? new Date(dataHoraLocal)
    : new Date(`${dataHoraLocal}:00-03:00`);

  if (Number.isNaN(dataHora.getTime()) || dataHora <= new Date()) {
    return { erro: "Informe um horário futuro válido." };
  }

  const { error } = await supabase.from("agenda_medica").insert({
    profissional_id: profissionalId,
    especialidade_id: profissional.especialidade_id,
    unidade_id: profissional.unidade_id,
    data_hora: dataHora.toISOString(),
  });

  if (error?.code === "23505") return { erro: "Esse horário já está na agenda do profissional." };
  if (error) return { erro: "Não foi possível liberar o horário." };

  revalidatePath("/admin/agenda");
  revalidatePath("/recepcao/agenda");
  revalidatePath("/paciente/agendar");
  return { ok: "Horário disponibilizado para agendamento." };
}

export async function alterarStatusConsulta(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;
  const status = formData.get("status") as string;

  if (!id || !status) return;
  const { error } = await supabase.from("consultas").update({ status }).eq("id", id);
  if (error) console.error("Falha ao atualizar status da consulta:", error.message);

  revalidatePath("/admin/agenda");
  revalidatePath("/recepcao/agenda");
  revalidatePath("/medico");
  revalidatePath("/enfermagem");
  revalidatePath("/paciente");
}

export async function registrarEvolucao(_prev: unknown, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("evolucoes").insert({
    paciente_id: formData.get("paciente_id") as string,
    consulta_id: (formData.get("consulta_id") as string) || null,
    descricao: (formData.get("descricao") as string) ?? "",
    autor_id: user?.id ?? null,
  });

  if (error) return { erro: error.message };
  revalidatePath(`/admin/pacientes/${formData.get("paciente_id")}`);
  revalidatePath("/medico");
  return { ok: "Evolução registrada." };
}
