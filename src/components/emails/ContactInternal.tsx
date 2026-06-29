import { Column, Heading, Link, Row, Section, Text } from "@react-email/components";
import type { CSSProperties } from "react";
import { EmailLayout, Button, brand, InternalHeader } from "./EmailLayout";

export interface ContactInternalProps {
  name: string;
  email: string;
  phone?: string;
  message: string;
  receivedAt: string;
}

export function ContactInternal({ name, email, phone, message, receivedAt }: ContactInternalProps) {
  return (
    <EmailLayout
      preview={`Nuevo mensaje de contacto de ${name}`}
      header={<InternalHeader badge="Requiere seguimiento" />}
      footer="light"
      footerNote="Correo automático del portal de Sonqo Perú. Información confidencial para uso interno del equipo."
    >
      {/* Eyebrow + foco */}
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
        Nuevo contacto
      </Text>
      <Heading
        style={{ textAlign: "center", margin: "0 0 8px", fontSize: "30px", fontWeight: 700, color: brand.ink }}
      >
        {name}
      </Heading>
      <Text style={{ textAlign: "center", margin: "0 0 32px", fontSize: "13px", color: brand.body }}>
        {receivedAt} · vía formulario del sitio
      </Text>

      {/* Datos accionables (mismo color, alineados arriba) */}
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
          <Label>Teléfono directo</Label>
          <Text style={{ margin: 0, fontSize: "16px", fontWeight: 700, lineHeight: "22px" }}>
            {phone ? (
              <Link href={`tel:${phone.replace(/\s+/g, "")}`} style={{ color: brand.ink }}>
                {phone}
              </Link>
            ) : (
              <span style={{ color: brand.body }}>No proporcionado</span>
            )}
          </Text>
        </Column>
      </Row>

      {/* Mensaje */}
      <Label style={{ marginTop: "32px", textAlign: "center" }}>Mensaje adjunto</Label>
      <Section
        style={{
          backgroundColor: brand.cardBg,
          borderRadius: "10px",
          padding: "24px",
          margin: "8px 0 32px",
        }}
      >
        <Text
          style={{
            margin: 0,
            fontSize: "15px",
            lineHeight: "26px",
            fontStyle: "italic",
            textAlign: "center",
            color: brand.ink,
          }}
        >
          “{message}”
        </Text>
      </Section>

      {/* Acciones */}
      {phone ? (
        <Row>
          <Column style={{ width: "50%", paddingRight: "8px", verticalAlign: "top" }}>
            <Button
              href={`mailto:${email}?subject=${encodeURIComponent("Re: tu mensaje a Sonqo Perú")}`}
              label="Responder"
              variant="primary"
            />
          </Column>
          <Column style={{ width: "50%", paddingLeft: "8px", verticalAlign: "top" }}>
            <Button href={`tel:${phone.replace(/\s+/g, "")}`} label="Llamar" variant="outlineInk" />
          </Column>
        </Row>
      ) : (
        <Button
          href={`mailto:${email}?subject=${encodeURIComponent("Re: tu mensaje a Sonqo Perú")}`}
          label="Responder"
          variant="primary"
        />
      )}
    </EmailLayout>
  );
}

function Label({ children, style }: { children: string; style?: CSSProperties }) {
  return (
    <Text
      style={{
        margin: "0 0 6px",
        fontSize: "11px",
        fontWeight: 700,
        letterSpacing: "0.8px",
        textTransform: "uppercase",
        color: brand.body,
        ...style,
      }}
    >
      {children}
    </Text>
  );
}

// Datos de ejemplo para el preview de react-email (localhost:3000).
ContactInternal.PreviewProps = {
  name: "Elena Vargas Mamani",
  email: "elena.vargas@ejemplo.com",
  phone: "+51 987 654 321",
  message:
    "Represento a una agencia de turismo sostenible en Cusco. Nos encantaría organizar una jornada con nuestros guías para apoyar en la distribución de casacas térmicas en las comunidades de altura. ¿Podríamos agendar una reunión?",
  receivedAt: "24 de junio de 2026, 14:30 PE",
} satisfies ContactInternalProps;

export default ContactInternal;
