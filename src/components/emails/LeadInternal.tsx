import { Column, Heading, Link, Row, Text } from "@react-email/components";
import { EmailLayout, Button, brand, InternalHeader } from "./EmailLayout";

export interface LeadInternalProps {
  name: string;
  email: string;
  phone: string;
  source?: string;
  receivedAt: string;
}

// Notificación al equipo cuando alguien descarga la infografía (nuevo lead).
export function LeadInternal({ name, email, phone, source, receivedAt }: LeadInternalProps) {
  return (
    <EmailLayout
      preview={`Nuevo lead de infografía: ${name}`}
      header={<InternalHeader badge="Nuevo lead" />}
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
        Descarga de infografía
      </Text>
      <Heading
        style={{ textAlign: "center", margin: "0 0 8px", fontSize: "30px", fontWeight: 700, color: brand.ink }}
      >
        {name}
      </Heading>
      <Text style={{ textAlign: "center", margin: "0 0 32px", fontSize: "13px", color: brand.body }}>
        {receivedAt} · vía formulario de infografía
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
            <Link href={`tel:${phone.replace(/\s+/g, "")}`} style={{ color: brand.ink }}>
              {phone}
            </Link>
          </Text>
        </Column>
      </Row>

      <div style={{ marginTop: "20px" }}>
        <Label>Cómo nos conoció</Label>
        <Text style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: brand.ink }}>
          {source ?? "No especificado"}
        </Text>
      </div>

      <div style={{ height: "32px" }} />

      <Button
        href={`mailto:${email}?subject=${encodeURIComponent("Gracias por tu interés en Sonqo Perú")}`}
        label="Escribir al lead"
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

LeadInternal.PreviewProps = {
  name: "María Quispe",
  email: "maria.quispe@ejemplo.com",
  phone: "+51 999 888 777",
  source: "Instagram",
  receivedAt: "25 de junio de 2026, 09:15 PE",
} satisfies LeadInternalProps;

export default LeadInternal;
