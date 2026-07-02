import { Heading, Text } from "@react-email/components";
import { EmailLayout, Button, brand, InternalHeader, ConsentNotice } from "./EmailLayout";

export interface ContactInternalProps {
  name: string;
  email: string;
  phone?: string;
  message: string;
  receivedAt: string;
  consentIp?: string | null;
}

export function ContactInternal({ name, email, phone, message, receivedAt, consentIp }: ContactInternalProps) {
  return (
    <EmailLayout
      preview={`Nuevo mensaje de contacto de ${name}`}
      header={<InternalHeader badge="Requiere seguimiento" />}
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

      {/* Datos de contacto en card */}
      <table width="100%" cellPadding="0" cellSpacing="0" style={{ margin: "0 0 28px" }}>
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
                    <td style={{ padding: 0 }}>
                      <Label>Teléfono directo</Label>
                      <Text style={{ margin: 0, fontSize: "16px", fontWeight: 700, lineHeight: "22px" }}>
                        {phone ? (
                          <a href={`tel:${phone.replace(/\s+/g, "")}`} style={{ color: brand.ink, textDecoration: "none" }}>
                            {phone}
                          </a>
                        ) : (
                          <span style={{ color: brand.body }}>No proporcionado</span>
                        )}
                      </Text>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Mensaje en card */}
      <table width="100%" cellPadding="0" cellSpacing="0" style={{ margin: "0 0 28px" }}>
        <tbody>
          <tr>
            <td
              style={{
                backgroundColor: brand.cardBg,
                borderRadius: "12px",
                padding: "24px",
              }}
            >
              <Label style={{ textAlign: "center", marginBottom: "12px" }}>Mensaje</Label>
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
                &ldquo;{message}&rdquo;
              </Text>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Constancia de consentimiento (prueba legal) */}
      <ConsentNotice text="Aceptó la Política de Privacidad" at={receivedAt} ip={consentIp} />

      {/* Acciones */}
      <table width="100%" cellPadding="0" cellSpacing="0" style={{ margin: "0 0 28px" }}>
        <tbody>
          <tr>
            <td style={{ padding: "0 4px 0 0", width: "50%" }}>
              <Button
                href={`mailto:${email}?subject=${encodeURIComponent("Re: tu mensaje a Sonqo Perú")}`}
                label="Responder"
                variant="primary"
              />
            </td>
            {phone ? (
              <td style={{ padding: "0 0 0 4px", width: "50%" }}>
                <Button href={`tel:${phone.replace(/\s+/g, "")}`} label="Llamar" variant="outlineInk" />
              </td>
            ) : null}
          </tr>
        </tbody>
      </table>
    </EmailLayout>
  );
}

function Label({ children, style }: { children: string; style?: React.CSSProperties }) {
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

ContactInternal.PreviewProps = {
  name: "Elena Vargas Mamani",
  email: "elena.vargas@ejemplo.com",
  phone: "+51 987 654 321",
  message:
    "Represento a una agencia de turismo sostenible en Cusco. Nos encantaría organizar una jornada con nuestros guías para apoyar en la distribución de casacas térmicas en las comunidades de altura. ¿Podríamos agendar una reunión?",
  receivedAt: "24 de junio de 2026, 14:30 PE",
  consentIp: "190.234.12.45",
} satisfies ContactInternalProps;

export default ContactInternal;
