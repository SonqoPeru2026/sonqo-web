import { z } from "zod";

// Mensajes de error por campo. Localizan el mismo schema (ES/EN) sin duplicarlo.
export interface LeadMessages {
  name: string;
  email: string;
  phone: string;
  consent: string;
}

export const DEFAULT_LEAD_MESSAGES: LeadMessages = {
  name: "Nombre inválido",
  email: "Correo inválido",
  phone: "Celular inválido",
  consent: "Debes aceptar para recibir la infografía",
};

// Única definición de reglas. La consumen el cliente (validación en vivo) y el server.
export function makeLeadSchema(m: LeadMessages = DEFAULT_LEAD_MESSAGES) {
  return z.object({
    name: z.string().trim().min(2, m.name).max(100, m.name),
    email: z.email(m.email).max(150, m.email),
    phone: z.string().trim().min(6, m.phone).max(20, m.phone),
    source: z.string().trim().max(60).optional(),
    consent: z.boolean().refine((v) => v === true, { message: m.consent }),
  });
}

export type LeadInput = z.infer<ReturnType<typeof makeLeadSchema>>;
