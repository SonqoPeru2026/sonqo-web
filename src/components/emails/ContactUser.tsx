import { Heading, Section, Text } from "@react-email/components";
import { EmailLayout, Button, brand, SITE } from "./EmailLayout";

export interface ContactUserProps {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

const HERO_SRC =
  "https://res.cloudinary.com/dpoihx1r5/image/upload/v1782301008/Hero_Image_frskni.png";

// Email de confirmación que recibe la persona que escribió por el formulario.
export function ContactUser({ name, email, phone, message }: ContactUserProps) {
  return (
    <EmailLayout
      preview="Hemos recibido tu mensaje · Sonqo Perú"
      heroSrc={HERO_SRC}
      heroAlt="Niños abrigados con casacas térmicas de Sonqo"
      footer="brand"
      footerNote="Estás recibiendo este correo porque nos contactaste a través de nuestro sitio web."
    >
      <Heading style={{ color: brand.burgundy, fontSize: "26px", fontWeight: 700, margin: "0 0 12px" }}>
        Hemos recibido tu información
      </Heading>
      <Text style={{ color: brand.body, fontSize: "15px", lineHeight: "24px", margin: "0 0 24px" }}>
        Gracias por escribir a Sonqo, {name}. Tu mensaje ya está con nuestro equipo y te responderemos
        muy pronto. Cada conversación nos ayuda a abrigar a más niños de las comunidades altoandinas
        de todo el Perú con casacas térmicas de calidad.
      </Text>
      <Text style={{ color: brand.body, fontSize: "15px", lineHeight: "24px", margin: "0 0 28px" }}>
        Mientras tanto, puedes conocer más sobre nuestro impacto visitando nuestro sitio web.
      </Text>

      {/* Tarjeta resumen */}
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
          Resumen de tu mensaje
        </Text>
        <Field label="Nombre" value={name} />
        <Field label="Correo" value={email} />
        {phone ? <Field label="Teléfono" value={phone} /> : null}
        <Field label="Mensaje" value={`"${message}"`} last />
      </Section>

      <Section style={{ margin: "0 0 28px" }}>
        <Button href={SITE} label="Visitar sitio web" variant="primary" />
      </Section>

      <Text style={{ textAlign: "center", color: brand.body, fontSize: "14px", margin: "0 0 2px" }}>
        Con gratitud,
      </Text>
      <Text
        style={{ textAlign: "center", color: brand.primary, fontSize: "15px", fontWeight: 700, margin: 0 }}
      >
        El equipo de Sonqo Perú
      </Text>
    </EmailLayout>
  );
}

function Field({ label, value, last }: { label: string; value: string; last?: boolean }) {
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
              color: brand.ink,
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

// Datos de ejemplo para el preview de react-email (localhost:3000).
ContactUser.PreviewProps = {
  name: "Juan Pérez",
  email: "juan.perez@example.com",
  phone: "+51 999 888 777",
  message:
    "Me gustaría obtener más detalles sobre cómo puedo colaborar con sus proyectos en Cusco.",
} satisfies ContactUserProps;

export default ContactUser;
