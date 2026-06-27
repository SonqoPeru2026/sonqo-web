import { useEffect } from "react";
import { initMercadoPago, CardPayment } from "@mercadopago/sdk-react";

interface Props {
  publicKey: string;
  amount: number;
  packageId?: string;
  thanksHref: string;
}

let mpInitialized = false;

// Isla de pago: renderiza el Card Brick de MercadoPago (tokeniza la tarjeta en el navegador)
// y envía solo el token a /api/create-payment. La tarjeta nunca toca nuestro server.
export default function PaymentBrick({ publicKey, amount, packageId, thanksHref }: Props) {
  useEffect(() => {
    if (publicKey && !mpInitialized) {
      initMercadoPago(publicKey);
      mpInitialized = true;
    }
  }, [publicKey]);

  if (!publicKey) {
    return (
      <p className="rounded-xl bg-mist p-4 text-center font-body text-sm text-ink-500">
        El pago con tarjeta estará disponible muy pronto.
      </p>
    );
  }

  return (
    <CardPayment
      initialization={{ amount }}
      onSubmit={async (formData) => {
        // formData: tipo del SDK (token, payment_method_id, issuer_id, installments, payer).
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
            }),
          });
          const data = (await res.json()) as { status?: string };
          const status = res.ok ? (data.status ?? "error") : "error";
          window.location.href = `${thanksHref}?status=${status}`;
        } catch {
          window.location.href = `${thanksHref}?status=error`;
        }
      }}
      customization={{
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
