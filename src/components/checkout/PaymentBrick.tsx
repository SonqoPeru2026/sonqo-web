import { useEffect, useRef, useState } from "react";
import { initMercadoPago, CardPayment } from "@mercadopago/sdk-react";
import type { CheckoutContact } from "./checkout-contact";
import { CONTACT_CHANGE_EVENT, CONTACT_INVALID_EVENT, readContact, isContactValid } from "./checkout-contact";

interface Props {
  publicKey: string;
  amount: number;
  packageId?: string;
  thanksHref: string;
}

let mpInitialized = false;

// Isla de pago: renderiza el Card Brick de MercadoPago (tokeniza la tarjeta en el navegador)
// y envía solo el token a /api/create-payment. La tarjeta nunca toca nuestro server.
// El nombre/email/teléfono viven en el <form> de Astro (fuera de esta isla React), así que
// se leen del DOM vía checkout-contact.ts en vez de pasarse como props (que serían estáticas
// del render del servidor).
export default function PaymentBrick({ publicKey, amount, packageId, thanksHref }: Props) {
  const submitting = useRef(false);
  const [emailAtMount, setEmailAtMount] = useState<string>(() => readContact().email);

  useEffect(() => {
    if (publicKey && !mpInitialized) {
      initMercadoPago(publicKey);
      mpInitialized = true;
    }
  }, [publicKey]);

  useEffect(() => {
    if (emailAtMount) return;
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<CheckoutContact>).detail;
      if (detail?.email) setEmailAtMount(detail.email);
    };
    document.addEventListener(CONTACT_CHANGE_EVENT, onChange);
    return () => document.removeEventListener(CONTACT_CHANGE_EVENT, onChange);
  }, [emailAtMount]);

  if (!publicKey) {
    return (
      <p className="rounded-xl bg-mist p-4 text-center font-body text-sm text-ink-500">
        El pago con tarjeta estará disponible muy pronto.
      </p>
    );
  }

  return (
    <CardPayment
      key={emailAtMount || "no-email"}
      initialization={{ amount, payer: emailAtMount ? { email: emailAtMount } : undefined }}
      onSubmit={async (formData) => {
        // formData: tipo del SDK (token, payment_method_id, issuer_id, installments, payer).
        if (submitting.current) return; // ya hay un pago en curso → ignorar
        const contact = readContact();
        if (!isContactValid(contact)) {
          // No se cobra nada: el token ya se generó pero nunca llega a create-payment.
          // Checkout.astro escucha esto para pintar los errores y hacer scroll al form.
          document.dispatchEvent(new CustomEvent(CONTACT_INVALID_EVENT));
          return;
        }
        submitting.current = true;
        try {
          const res = await fetch("/api/create-payment", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              token: formData.token,
              paymentMethodId: formData.payment_method_id,
              issuerId: formData.issuer_id,
              installments: Number(formData.installments),
              payer: formData.payer,
              packageId,
              amount,
              firstName: contact.firstName,
              lastName: contact.lastName,
              phone: contact.phone || undefined,
              consent: contact.consent,
            }),
          });
          const data = (await res.json()) as { status?: string };
          const status = res.ok ? (data.status ?? "error") : "error";
          window.location.href = `${thanksHref}?status=${status}`;
        } catch {
          submitting.current = false; // falló la red: permitir reintento
          window.location.href = `${thanksHref}?status=error`;
        }
      }}
      customization={{
        paymentMethods: { minInstallments: 1, maxInstallments: 1 },
        visual: {
          style: {
            theme: "default",
            customVariables: {
              baseColor: "#e4003f",
              baseColorFirstVariant: "#c70036",
              baseColorSecondVariant: "#b0002f",
              formBackgroundColor: "#ffffff",
              inputBackgroundColor: "#ffffff",
              textPrimaryColor: "#291717",
              textSecondaryColor: "#605e5e",
              outlinePrimaryColor: "#e4003f",
              buttonTextColor: "#ffffff",
              borderRadiusSmall: "8px",
              borderRadiusMedium: "10px",
              borderRadiusLarge: "16px",
              fontSizeMedium: "15px",
            },
          },
        },
      }}
    />
  );
}
