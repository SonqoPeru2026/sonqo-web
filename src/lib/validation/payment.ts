import { z } from "zod";
import { makeCheckoutContactSchema } from "./checkout-contact";

// Payload que envía el Card Payment Brick (cliente) a /api/create-payment.
// El monto NO se valida acá: el server lo recalcula con resolveAmount (lib/donation).
// El contacto (firstName/lastName/email/phone) reusa makeCheckoutContactSchema —
// misma fuente que valida en vivo en Checkout.astro antes de dejar pagar.
export const paymentSchema = z
  .object({
    token: z.string().min(1),
    paymentMethodId: z.string().min(1),
    issuerId: z.string().optional(),
    installments: z.number().int().min(1).max(24),
    payer: z.object({
      email: z.email().max(150),
      identification: z
        .object({
          type: z.string().max(10),
          number: z.string().max(20),
        })
        .optional(),
    }),
    // Selector de donación (uno de los dos). El server decide el monto real.
    packageId: z.string().max(20).optional(),
    amount: z.number().optional(),
    // Consentimiento obligatorio: debe llegar en true o el pago se rechaza.
    consent: z.literal(true),
  })
  .extend(makeCheckoutContactSchema().omit({ email: true }).shape);

export type PaymentInput = z.infer<typeof paymentSchema>;
