import { Heading, Text } from "@react-email/components";
import { EmailLayout, Button, brand, InternalHeader, ConsentNotice } from "./EmailLayout";

export interface LeadInternalProps {
  name: string;
  email: string;
  phone: string;
  source?: string;
  receivedAt: string;
  consentIp?: string | null;
}

export function LeadInternal({ name, email, phone, source, receivedAt, consentIp }: LeadInternalProps) {
  return (
    <EmailLayout
      preview={`Nuevo lead de infografía: ${name}`}
      header={<InternalHeader badge="Nuevo lead" />}
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
                    <td style={{ padding: "0 0 16px" }}>
                      <Label>Celular</Label>
                      <Text style={{ margin: 0, fontSize: "16px", fontWeight: 700, lineHeight: "22px" }}>
                        <a href={`tel:${phone.replace(/\s+/g, "")}`} style={{ color: brand.ink, textDecoration: "none" }}>
                          {phone}
                        </a>
                      </Text>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: 0 }}>
                      <Label>Cómo nos conoció</Label>
                      <Text style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: brand.ink }}>
                        {source ?? "No especificado"}
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
      <ConsentNotice
        text="Aceptó recibir la infografía y la Política de Privacidad"
        at={receivedAt}
        ip={consentIp}
      />

      {/* Acción */}
      <table width="100%" cellPadding="0" cellSpacing="0" style={{ margin: "0 0 28px" }}>
        <tbody>
          <tr>
            <td>
              <Button
                href={`mailto:${email}?subject=${encodeURIComponent("Gracias por tu interés en Sonqo Perú")}`}
                label="Escribir al lead"
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

LeadInternal.PreviewProps = {
  name: "María Quispe",
  email: "maria.quispe@ejemplo.com",
  phone: "+51 999 888 777",
  source: "Instagram",
  receivedAt: "25 de junio de 2026, 09:15 PE",
  consentIp: "190.234.12.45",
} satisfies LeadInternalProps;

export default LeadInternal;
