import { Heading, Section, Text } from "@react-email/components";
import { EmailLayout, Button, brand, SITE } from "./EmailLayout";

export interface LeadUserProps {
  name: string;
}

const HERO_SRC =
  "https://res.cloudinary.com/dpoihx1r5/image/upload/v1782301008/Hero_Image_frskni.png";

// PDF de la infografía. Colócalo en public/ y ajusta la URL cuando esté en producción.
const PDF_URL = `${SITE}/infografia-sonqo.pdf`;

const items = [
  "El origen del nombre Sonqo",
  "Nuestra misión y valores",
  "Cómo tu apoyo abriga a un niño",
  "Nuestro impacto en cifras",
];

// Email que recibe la persona que descargó la infografía.
export function LeadUser({ name }: LeadUserProps) {
  return (
    <EmailLayout
      preview="Tu infografía de Sonqo está lista"
      heroSrc={HERO_SRC}
      heroAlt="Niños abrigados con casacas térmicas de Sonqo"
      footer="light"
      footerNote="Recibes este correo porque pediste la infografía en nuestro sitio."
    >
      <Heading style={{ color: brand.burgundy, fontSize: "26px", fontWeight: 700, margin: "0 0 12px" }}>
        Tu infografía está lista
      </Heading>
      <Text style={{ color: brand.body, fontSize: "15px", lineHeight: "24px", margin: "0 0 24px" }}>
        Hola {name}, gracias por tu interés en Sonqo. Descarga la infografía y conoce el origen de
        nuestro nombre, nuestra misión y cómo abrigamos a los niños de las comunidades de Cusco y
        Huancavelica con casacas térmicas de calidad.
      </Text>

      <Section style={{ margin: "0 0 28px" }}>
        <Button href={PDF_URL} label="Descargar infografía" variant="primary" />
      </Section>

      <Section
        style={{
          backgroundColor: brand.cardBg,
          borderRadius: "12px",
          padding: "24px",
          margin: "0 0 28px",
        }}
      >
        <Text style={{ margin: "0 0 12px", fontSize: "12px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: brand.body }}>
          Esto encontrarás dentro
        </Text>
        {items.map((item) => (
          <Text key={item} style={{ margin: "0 0 8px", fontSize: "15px", color: brand.ink }}>
            {item}
          </Text>
        ))}
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

LeadUser.PreviewProps = { name: "María" } satisfies LeadUserProps;

export default LeadUser;
