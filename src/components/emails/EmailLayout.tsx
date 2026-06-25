import {
  Body,
  Button as REButton,
  Container,
  Font,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { ReactNode } from "react";

export const brand = {
  primary: "#e4003f",
  primaryDark: "#b0002f",
  burgundy: "#540545",
  ink: "#291717",
  body: "#605e5e",
  bodySoft: "#605e5e",
  label: "#605e5e",
  cardBg: "#f6f2f2",
  cardBorder: "rgba(41,23,23,0.10)",
  page: "#fafaf8",
  white: "#ffffff",
};

export const SITE = "https://sonqoperu.com";

// Assets hospedados en Cloudinary (PNG: los clientes de correo bloquean SVG).
export const LOGO_SRC = "https://res.cloudinary.com/dpoihx1r5/image/upload/v1782300696/sonqo-logo_vpdniy.png";

const ICONS = {
  globe: "https://res.cloudinary.com/dpoihx1r5/image/upload/v1782301022/global_j8lxak.png",
  mail: "https://res.cloudinary.com/dpoihx1r5/image/upload/v1782301022/Link_ve9oer.png",
  share: "https://res.cloudinary.com/dpoihx1r5/image/upload/v1782301021/shared_szm8cr.png",
};

export const HEART_SRC =
  "https://res.cloudinary.com/dpoihx1r5/image/upload/v1782301061/Grupo_1_cfiti7.png";

export interface EmailLayoutProps {
  preview: string;
  heroSrc?: string;
  heroAlt?: string;
  header?: ReactNode;
  footer?: "light" | "brand";
  footerNote?: string;
  children: ReactNode;
}

export function EmailLayout({
  preview,
  heroSrc,
  heroAlt,
  header,
  footer = "light",
  footerNote,
  children,
}: EmailLayoutProps) {
  return (
    <Html lang="es">
      <Head>
        <Font
          fontFamily="Ubuntu"
          fallbackFontFamily="Arial"
          webFont={{
            url: "https://fonts.gstatic.com/s/ubuntu/v20/4iCs6KVjbNBYlgoKfw72.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>{preview}</Preview>
      <Body
        style={{ backgroundColor: brand.page, fontFamily: "Ubuntu, Arial, sans-serif", margin: 0 }}
      >
        <Container style={{ maxWidth: "600px", margin: "0 auto", backgroundColor: brand.white }}>
          {/* Header (personalizable o logo por defecto) */}
          {header ?? (
            <Section
              style={{
                padding: "28px",
                textAlign: "center",
                borderBottom: `1px solid ${brand.cardBorder}`,
              }}
            >
              {LOGO_SRC ? (
                <Img src={LOGO_SRC} alt="Sonqo Perú" height="34" style={{ margin: "0 auto" }} />
              ) : (
                <Wordmark color={brand.primary} />
              )}
            </Section>
          )}

          {/* Hero opcional */}
          {heroSrc ? (
            <Img
              src={heroSrc}
              alt={heroAlt ?? ""}
              width="600"
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          ) : null}

          {/* Contenido */}
          <Section style={{ padding: "40px 32px" }}>{children}</Section>

          {/* Footer */}
          {footer === "brand" ? (
            <BrandFooter note={footerNote} />
          ) : (
            <LightFooter note={footerNote} />
          )}
        </Container>
      </Body>
    </Html>
  );
}

// Header editorial para correos internos: línea de acento + logo + estado + badge.
export function InternalHeader({ badge }: { badge: string }) {
  return (
    <Section style={{ padding: 0, textAlign: "center" }}>
      <div style={{ height: "3px", width: "64px", backgroundColor: brand.primary, margin: "0 auto" }} />
      <div
        style={{
          padding: "28px 28px 26px",
          textAlign: "center",
          borderBottom: `1px solid ${brand.cardBorder}`,
        }}
      >
        <Img src={LOGO_SRC} alt="Sonqo Perú" height="36" style={{ margin: "0 auto 14px" }} />
        <Text
          style={{
            margin: 0,
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: brand.body,
          }}
        >
          Aviso interno
        </Text>
        <Text style={{ textAlign: "center", margin: "16px 0 0" }}>
          <span
            style={{
              display: "inline-block",
              border: `1px solid ${brand.primary}`,
              color: brand.primary,
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "1px",
              textTransform: "uppercase",
              padding: "6px 14px",
              borderRadius: "9999px",
            }}
          >
            {badge}
          </span>
        </Text>
      </div>
    </Section>
  );
}

function Wordmark({ color }: { color: string }) {
  return (
    <Text style={{ margin: 0, fontSize: "26px", fontWeight: 700, letterSpacing: "-0.5px", color }}>
      sonqo
      <span style={{ fontSize: "11px", letterSpacing: "2px", verticalAlign: "top" }}> PERÚ</span>
    </Text>
  );
}

const footerLinks = (
  <Text style={{ margin: "0 0 6px", fontSize: "12px" }}>
    <Link href={`${SITE}/privacidad.pdf`} style={{ color: "inherit" }}>
      Privacidad
    </Link>
    <span style={{ opacity: 0.5 }}> · </span>
    <Link href={`${SITE}/terminos.pdf`} style={{ color: "inherit" }}>
      Términos
    </Link>
    <span style={{ opacity: 0.5 }}> · </span>
    <Link href={`${SITE}/#contacto`} style={{ color: "inherit" }}>
      Contacto
    </Link>
  </Text>
);

function SocialIcon({ src, href }: { src: string; href: string }) {
  return (
    <Link href={href} style={{ display: "inline-block", margin: "0 8px" }}>
      <Img src={src} alt="" width="20" height="20" style={{ display: "inline-block" }} />
    </Link>
  );
}

function LightFooter({ note }: { note?: string }) {
  return (
    <Section
      style={{
        padding: "28px 32px",
        textAlign: "center",
        borderTop: `1px solid ${brand.cardBorder}`,
      }}
    >
      <Text style={{ margin: "0 0 16px", textAlign: "center" }}>
        <SocialIcon src={ICONS.globe} href={SITE} />
        <SocialIcon src={ICONS.mail} href={`${SITE}/#contacto`} />
        <SocialIcon src={ICONS.share} href={SITE} />
      </Text>
      <Text style={{ margin: "0 0 8px", fontSize: "13px", fontWeight: 700, color: brand.ink }}>
        © {new Date().getFullYear()} Sonqo Perú. Desde el corazón del Perú.
      </Text>
      <div style={{ color: brand.primary }}>{footerLinks}</div>
      {note ? (
        <Text style={{ margin: "12px 0 0", fontSize: "12px", color: brand.bodySoft }}>{note}</Text>
      ) : null}
    </Section>
  );
}

function BrandFooter({ note }: { note?: string }) {
  return (
    <Section style={{ backgroundColor: brand.primary, padding: "32px", textAlign: "center" }}>
      <Wordmark color={brand.white} />
      <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: "13px", margin: "12px 0 8px" }}>
        © {new Date().getFullYear()} Sonqo Perú. Desde el corazón del Perú.
      </Text>
      <div style={{ color: brand.white }}>{footerLinks}</div>
      {note ? (
        <Text style={{ margin: "12px 0 0", fontSize: "12px", color: "rgba(255,255,255,0.75)" }}>
          {note}
        </Text>
      ) : null}
    </Section>
  );
}

// Botón reutilizable (email-safe). variant primary (relleno) | outline.
export function Button({
  href,
  label,
  variant = "primary",
  iconSrc,
}: {
  href: string;
  label: string;
  variant?: "primary" | "outline" | "ink" | "outlineInk";
  iconSrc?: string;
}) {
  const base = {
    display: "block",
    width: "100%",
    boxSizing: "border-box" as const,
    textAlign: "center" as const,
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: 700,
    padding: "13px 24px",
    textDecoration: "none",
    letterSpacing: "0.8px",
  };
  const variants = {
    primary: { ...base, backgroundColor: brand.primary, color: brand.white },
    ink: { ...base, backgroundColor: brand.ink, color: brand.white },
    outline: {
      ...base,
      backgroundColor: brand.white,
      color: brand.primary,
      border: `1.5px solid ${brand.primary}`,
    },
    outlineInk: {
      ...base,
      backgroundColor: brand.white,
      color: brand.ink,
      border: `1.5px solid ${brand.cardBorder}`,
    },
  };
  const style = variants[variant];
  return (
    <REButton href={href} style={style}>
      {iconSrc ? (
        <Img
          src={iconSrc}
          alt=""
          width="16"
          height="16"
          style={{ display: "inline-block", verticalAlign: "middle", marginRight: "8px" }}
        />
      ) : null}
      {label}
    </REButton>
  );
}

export { Hr, Section, Text };
