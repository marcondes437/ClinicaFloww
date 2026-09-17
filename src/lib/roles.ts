export type AppRole =
  | "admin"
  | "gestor"
  | "medico"
  | "enfermeiro"
  | "recepcionista"
  | "paciente";

export const ROLE_ROUTES: Record<AppRole, string> = {
  admin: "/admin",
  gestor: "/gestor",
  medico: "/medico",
  enfermeiro: "/enfermagem",
  recepcionista: "/recepcao",
  paciente: "/paciente",
};

export const HOME_BY_ROLE = ROLE_ROUTES;

const ROLE_PRIORITY: AppRole[] = [
  "admin",
  "gestor",
  "medico",
  "enfermeiro",
  "recepcionista",
  "paciente",
];

export function normalizeRoles(values: unknown[]): AppRole[] {
  const roles = values.filter((value): value is AppRole =>
    ROLE_PRIORITY.includes(value as AppRole)
  );

  return roles.length > 0
    ? [...new Set(roles)].sort(
        (a, b) => ROLE_PRIORITY.indexOf(a) - ROLE_PRIORITY.indexOf(b)
      )
    : ["paciente"];
}

export function getPrimaryRole(roles: AppRole[]): AppRole {
  return normalizeRoles(roles)[0];
}

export const ROLE_LABEL: Record<AppRole, string> = {
  admin: "Administrador",
  gestor: "Gestor",
  medico: "Médico(a)",
  enfermeiro: "Enfermagem",
  recepcionista: "Recepção",
  paciente: "Paciente",
};

export const STATUS_CONSULTA_LABEL: Record<string, string> = {
  agendada: "Agendada",
  confirmada: "Confirmada",
  em_atendimento: "Em atendimento",
  concluida: "Concluída",
  cancelada: "Cancelada",
  faltou: "Faltou",
};
