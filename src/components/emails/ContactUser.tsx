import { Heading, Section, Text } from "@react-email/components";
import { EmailLayout, Button, brand, SITE } from "./EmailLayout";

const HERO_SRC =
  "https://res.cloudinary.com/dpoihx1r5/image/upload/v1782301008/Hero_Image_frskni.png";

// Email de confirmación que recibe la persona que escribió por el formulario.
// SEGURIDAD: el destinatario lo escribe el visitante, así que este email NO repite
// nada que él controle (nombre, mensaje). Si lo hiciera, cualquiera podría usar el
// dominio de Sonqo para enviar texto arbitrario (phishing/spam) a terceros.
export function ContactUser() {
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
        Gracias por escribir a Sonqo. Tu mensaje ya está con nuestro equipo y te responderemos
        muy pronto. Cada conversación nos ayuda a abrigar a más niños de las comunidades altoandinas
        de todo el Perú con casacas térmicas de calidad.
      </Text>
      <Text style={{ color: brand.body, fontSize: "15px", lineHeight: "24px", margin: "0 0 28px" }}>
        Mientras tanto, puedes conocer más sobre nuestro impacto visitando nuestro sitio web.
      </Text>

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

export default ContactUser;
