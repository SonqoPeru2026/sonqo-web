// Puente entre el widget de Turnstile (fuera de la isla React) y PaymentBrick.tsx.
// Mismo patrón que checkout-contact.ts: window global + eventos custom.
// El tipo completo de window.turnstile vive en lib/turnstile-client.ts (única fuente).
declare global {
  interface Window {
    __checkoutTurnstileToken?: string;
    __onTurnstileSuccess?: (token: string) => void;
    __onTurnstileExpired?: () => void;
  }
}

// Disparado cuando el donante intenta pagar sin completar el desafío de Turnstile.
// Checkout.astro lo escucha para mostrar el error y hacer scroll (mismo patrón que
// CONTACT_INVALID_EVENT).
export const TURNSTILE_INVALID_EVENT = "checkout:turnstile-invalid";

export function readTurnstileToken(): string | undefined {
  return window.__checkoutTurnstileToken;
}

export function resetTurnstile(): void {
  window.__checkoutTurnstileToken = undefined;
  window.turnstile?.reset();
}
