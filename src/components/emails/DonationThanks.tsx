import { Heading, Section, Text } from "@react-email/components";
import { EmailLayout, Button, brand, SITE } from "./EmailLayout";
import { packageName } from "@/lib/donation";

export interface DonationThanksProps {
  firstName: string;
  packageId: string | null;
  amount: number;
  approvedAt: string;
  last4?: string | null;
  paymentId: string;
}

const HERO_SRC =
  "https://res.cloudinary.com/dpoihx1r5/image/upload/v1782301008/Hero_Image_frskni.png";

function formatApprovedAt(approvedAt: string): string {
  return new Intl.DateTimeFormat("es-PE", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "America/Lima",
  }).format(new Date(approvedAt));
}

// Email que recibe el donante tras un pago aprobado (disparado desde mp-webhook.ts).
export function DonationThanks({
  firstName,
  packageId,
  amount,
  approvedAt,
  last4,
  paymentId,
}: DonationThanksProps) {
  return (
    <EmailLayout
      preview="Gracias por tu donación a Sonqo Perú"
      heroSrc={HERO_SRC}
      heroAlt="Niños abrigados con casacas térmicas de Sonqo"
      footer="brand"
      footerNote="Recibes este correo porque hiciste una donación a Sonqo Perú."
    >
      <Heading style={{ color: brand.burgundy, fontSize: "26px", fontWeight: 700, margin: "0 0 12px" }}>
        Gracias por transformar el frío en esperanza.
      </Heading>
      <Text style={{ color: brand.body, fontSize: "15px", lineHeight: "24px", margin: "0 0 24px" }}>
        Hola {firstName}, tu generosidad acaba de tejer un hilo de resiliencia en los Andes.
        Queremos agradecerte de todo corazón por tu donación. Gracias a ti, una familia más
        estará protegida del inclemente frío de esta temporada.
      </Text>
      <Text style={{ color: brand.body, fontSize: "15px", lineHeight: "24px", margin: "0 0 28px" }}>
        Este no es solo un aporte; es un abrazo cálido que llega a las comunidades que más lo
        necesitan.
      </Text>

      <Section
        style={{
          backgroundColor: brand.cardBg,
          border: `1px solid ${brand.cardBorder}`,
          borderRadius: "12px",
          padding: "24px",
          margin: "0 0 28px",
        }}
      >
        <Text style={{ margin: "0 0 12px", fontSize: "12px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: brand.body }}>
          Resumen de tu donación
        </Text>
        <Field label="Paquete" value={packageName(packageId)} />
        <Field label="Monto" value={`S/ ${amount.toFixed(2)}`} highlight />
        <Field label="Fecha" value={formatApprovedAt(approvedAt)} />
        {last4 ? <Field label="Método" value={`Tarjeta terminada en **** ${last4}`} /> : null}
        <Field label="Transacción" value={`#${paymentId}`} last />
      </Section>

      <Section style={{ margin: "0 0 28px" }}>
        <Button href={SITE} label="Ver mi impacto" variant="primary" />
      </Section>

      <Text style={{ textAlign: "center", color: brand.body, fontSize: "14px", margin: "0 0 2px" }}>
        Con gratitud,
      </Text>
      <Text style={{ textAlign: "center", color: brand.primary, fontSize: "15px", fontWeight: 700, margin: 0 }}>
        El equipo de Sonqo Perú
      </Text>
    </EmailLayout>
  );
}

function Field({
  label,
  value,
  last,
  highlight,
}: {
  label: string;
  value: string;
  last?: boolean;
  highlight?: boolean;
}) {
  return (
    <table
      width="100%"
      cellPadding="0"
      cellSpacing="0"
      style={{
        paddingBottom: last ? 0 : "12px",
        marginBottom: last ? 0 : "12px",
        borderBottom: last ? "none" : `1px solid ${brand.cardBorder}`,
      }}
    >
      <tbody>
        <tr>
          <td style={{ fontSize: "14px", color: brand.label, margin: 0, padding: 0 }}>
            {label}
          </td>
          <td
            style={{
              fontSize: "14px",
              fontWeight: 700,
              color: highlight ? brand.primary : brand.ink,
              margin: 0,
              padding: 0,
              textAlign: "right",
            }}
          >
            {value}
          </td>
        </tr>
      </tbody>
    </table>
  );
}

DonationThanks.PreviewProps = {
  firstName: "María",
  packageId: "corazon",
  amount: 150,
  approvedAt: "2026-10-24T15:00:00.000Z",
  last4: "4589",
  paymentId: "8923123456",
} satisfies DonationThanksProps;

export default DonationThanks;
