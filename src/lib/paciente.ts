import { createClient } from "@/lib/supabase/server";

export async function getPacienteDoUsuario(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("pacientes")
    .select("id, nome_completo, celular, email, cidade, data_nascimento")
    .eq("user_id", userId)
    .maybeSingle();
  return data;
}
