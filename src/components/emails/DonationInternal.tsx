import { Heading, Text } from "@react-email/components";
import { EmailLayout, Button, brand, InternalHeader, ConsentNotice } from "./EmailLayout";
import { packageName } from "@/lib/donation";

export interface DonationInternalProps {
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  amount: number;
  packageId: string | null;
  last4: string | null;
  paymentId: string;
  approvedAt: string;
  consentAccepted: boolean;
  consentAt: string | null;
  consentIp: string | null;
}

function formatApprovedAt(approvedAt: string): string {
  return (
    new Intl.DateTimeFormat("es-PE", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "America/Lima",
    }).format(new Date(approvedAt)) + " PE"
  );
}

export function DonationInternal({
  firstName,
  lastName,
  email,
  phone,
  amount,
  packageId,
  last4,
  paymentId,
  approvedAt,
  consentAccepted,
  consentAt,
  consentIp,
}: DonationInternalProps) {
  const fullName = `${firstName} ${lastName}`.trim();

  return (
    <EmailLayout
      preview={`Nueva donación: ${fullName} — S/ ${amount.toFixed(2)}`}
      header={<InternalHeader badge="Nueva donación" />}
      footer="brand"
      footerNote="Correo automático del portal de Sonqo Perú. Información confidencial para uso interno del equipo."
    >
      <Text
        style={{
          textAlign: "center",
          margin: "0 0 10px",
          fontSize: "12px",
          fontWeight: 700,
          letterSpacing: "1.5px",
          textTransform: "uppercase",
          color: brand.primary,
        }}
      >
        {packageName(packageId)}
      </Text>
      <Heading
        style={{ textAlign: "center", margin: "0 0 8px", fontSize: "30px", fontWeight: 700, color: brand.ink }}
      >
        {fullName || "Donante"}
      </Heading>
      <Text style={{ textAlign: "center", margin: "0 0 4px", fontSize: "28px", fontWeight: 700, color: brand.primary }}>
        S/ {amount.toFixed(2)}
      </Text>
      <Text style={{ textAlign: "center", margin: "0 0 32px", fontSize: "13px", color: brand.body }}>
        {approvedAt} · vía checkout (tarjeta)
      </Text>

      {/* Datos de contacto en card */}
      <table width="100%" cellPadding="0" cellSpacing="0" style={{ margin: "0 0 20px" }}>
        <tbody>
          <tr>
            <td
              style={{
                backgroundColor: brand.cardBg,
                borderRadius: "12px",
                padding: "24px",
              }}
            >
              <table width="100%" cellPadding="0" cellSpacing="0">
                <tbody>
                  <tr>
                    <td style={{ padding: "0 0 16px" }}>
                      <Label>Correo electrónico</Label>
                      <Text style={{ margin: 0, fontSize: "16px", fontWeight: 700, lineHeight: "22px" }}>
                        <a href={`mailto:${email}`} style={{ color: brand.ink, textDecoration: "none" }}>
                          {email}
                        </a>
                      </Text>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: "0 0 16px" }}>
                      <Label>Celular</Label>
                      <Text style={{ margin: 0, fontSize: "16px", fontWeight: 700, lineHeight: "22px" }}>
                        {phone ? (
                          <a href={`tel:${phone.replace(/\s+/g, "")}`} style={{ color: brand.ink, textDecoration: "none" }}>
                            {phone}
                          </a>
                        ) : (
                          "No especificado"
                        )}
                      </Text>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: "0 0 16px" }}>
                      <Label>Método de pago</Label>
                      <Text style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: brand.ink }}>
                        {last4 ? `Tarjeta **** ${last4}` : "Tarjeta"}
                      </Text>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: 0 }}>
                      <Label>ID de transacción</Label>
                      <Text style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: brand.ink }}>
                        #{paymentId}
                      </Text>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Constancia de consentimiento (prueba legal) */}
      {consentAccepted ? (
        <ConsentNotice
          text="Aceptó los Términos y Condiciones y la Política de Privacidad"
          at={consentAt ? formatApprovedAt(consentAt) : approvedAt}
          ip={consentIp}
        />
      ) : null}

      {/* Acción */}
      <table width="100%" cellPadding="0" cellSpacing="0" style={{ margin: "0 0 28px" }}>
        <tbody>
          <tr>
            <td>
              <Button
                href={`mailto:${email}?subject=${encodeURIComponent("Gracias por tu donación a Sonqo Perú")}`}
                label="Escribir al donante"
                variant="primary"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </EmailLayout>
  );
}

function Label({ children }: { children: string }) {
  return (
    <Text
      style={{
        margin: "0 0 6px",
        fontSize: "11px",
        fontWeight: 700,
        letterSpacing: "0.8px",
        textTransform: "uppercase",
        color: brand.body,
      }}
    >
      {children}
    </Text>
  );
}

DonationInternal.PreviewProps = {
  firstName: "María",
  lastName: "Quispe",
  email: "maria.quispe@ejemplo.com",
  phone: "+51 999 888 777",
  amount: 150,
  packageId: "corazon",
  last4: "4589",
  paymentId: "8923123456",
  approvedAt: "25 de junio de 2026, 09:15 PE",
  consentAccepted: true,
  consentAt: "2026-06-25T14:15:00.000Z",
  consentIp: "190.234.12.45",
} satisfies DonationInternalProps;

export default DonationInternal;
