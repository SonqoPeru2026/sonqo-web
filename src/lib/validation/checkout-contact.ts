import { z } from "zod";

// Mensajes de error por campo. Localizan el mismo schema (ES/EN) sin duplicarlo.
export interface CheckoutContactMessages {
  firstName: string;
  lastName: string;
  email: string;
}

export const DEFAULT_CHECKOUT_CONTACT_MESSAGES: CheckoutContactMessages = {
  firstName: "Nombre inválido",
  lastName: "Apellido inválido",
  email: "Correo inválido",
};

// Única definición de las reglas del contacto de checkout. La consumen:
// - el cliente (Checkout.astro: validación en vivo + gate antes de dejar pagar)
// - el server (lib/validation/payment.ts: extiende el schema del Brick con esto)
export function makeCheckoutContactSchema(m: CheckoutContactMessages = DEFAULT_CHECKOUT_CONTACT_MESSAGES) {
  return z.object({
    firstName: z.string().trim().min(1, m.firstName).max(100, m.firstName),
    lastName: z.string().trim().min(1, m.lastName).max(100, m.lastName),
    email: z.email(m.email).max(150, m.email),
    phone: z.string().trim().max(20).optional(),
  });
}

export type CheckoutContactInput = z.infer<ReturnType<typeof makeCheckoutContactSchema>>;
