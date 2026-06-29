import { z } from "zod";

// Mensajes de error por campo. Permiten localizar el mismo schema (ES/EN) sin duplicarlo.
export interface ContactMessages {
  name: string;
  email: string;
  phone: string;
  message: string;
  terms: string;
}

// Mensajes por defecto (server). El cliente pasa los suyos desde i18n.
export const DEFAULT_CONTACT_MESSAGES: ContactMessages = {
  name: "Nombre inválido",
  email: "Correo inválido",
  phone: "Teléfono inválido",
  message: "Mensaje inválido",
  terms: "Debes aceptar los términos",
};

// Única definición de las reglas. La consumen el cliente (validación en vivo) y el server.
export function makeContactSchema(m: ContactMessages = DEFAULT_CONTACT_MESSAGES) {
  return z.object({
    name: z.string().trim().min(2, m.name).max(100, m.name),
    email: z.email(m.email).max(150, m.email),
    phone: z.string().trim().max(20).optional(),
    message: z.string().trim().min(10, m.message).max(2000, m.message),
    terms: z.boolean().refine((v) => v === true, { message: m.terms }),
  });
}

export type ContactInput = z.infer<ReturnType<typeof makeContactSchema>>;
