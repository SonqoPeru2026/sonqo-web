import { Column, Heading, Link, Row, Text } from "@react-email/components";
import { EmailLayout, Button, brand, InternalHeader } from "./EmailLayout";
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

// Notificación al equipo cuando se aprueba una donación (disparado desde mp-webhook.ts).
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
}: DonationInternalProps) {
  const fullName = `${firstName} ${lastName}`.trim();

  return (
    <EmailLayout
      preview={`Nueva donación: ${fullName} — S/ ${amount.toFixed(2)}`}
      header={<InternalHeader badge="Nueva donación" />}
      footer="light"
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

      <Row>
        <Column style={{ verticalAlign: "top", width: "50%", paddingRight: "16px" }}>
          <Label>Correo electrónico</Label>
          <Text style={{ margin: 0, fontSize: "16px", fontWeight: 700, lineHeight: "22px" }}>
            <Link href={`mailto:${email}`} style={{ color: brand.ink }}>
              {email}
            </Link>
          </Text>
        </Column>
        <Column style={{ verticalAlign: "top", width: "50%" }}>
          <Label>Celular</Label>
          <Text style={{ margin: 0, fontSize: "16px", fontWeight: 700, lineHeight: "22px" }}>
            {phone ? (
              <Link href={`tel:${phone.replace(/\s+/g, "")}`} style={{ color: brand.ink }}>
                {phone}
              </Link>
            ) : (
              "No especificado"
            )}
          </Text>
        </Column>
      </Row>

      <Row style={{ marginTop: "20px" }}>
        <Column style={{ verticalAlign: "top", width: "50%", paddingRight: "16px" }}>
          <Label>Método</Label>
          <Text style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: brand.ink }}>
            {last4 ? `Tarjeta **** ${last4}` : "Tarjeta"}
          </Text>
        </Column>
        <Column style={{ verticalAlign: "top", width: "50%" }}>
          <Label>Transacción</Label>
          <Text style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: brand.ink }}>
            #{paymentId}
          </Text>
        </Column>
      </Row>

      <div style={{ height: "32px" }} />

      <Button
        href={`mailto:${email}?subject=${encodeURIComponent("Gracias por tu donación a Sonqo Perú")}`}
        label="Escribir al donante"
        variant="primary"
      />
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
} satisfies DonationInternalProps;

export default DonationInternal;
