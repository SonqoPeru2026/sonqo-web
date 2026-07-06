import { defineType, defineField } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Configuración del sitio",
  type: "document",
  groups: [
    { name: "cifras", title: "Cifras de impacto (Inicio)", default: true },
    { name: "campana", title: "Campaña (barra de recaudación)" },
    { name: "imagenes", title: "Imágenes" },
  ],
  fields: [
    defineField({
      name: "ninosAtendidos",
      title: "Niños abrigados",
      description: "Sección «Cada cifra es un niño abrigado» (Inicio).",
      type: "number",
      group: "cifras",
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: "comunidades",
      title: "Comunidades alcanzadas",
      description: "Sección «Cada cifra es un niño abrigado» (Inicio).",
      type: "number",
      group: "cifras",
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: "solesRecaudados",
      title: "Soles recaudados (acumulado)",
      description: "Cifra histórica mostrada en «Cada cifra es un niño abrigado». No es la barra en vivo.",
      type: "number",
      group: "cifras",
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: "metaRecaudada",
      title: "Meta de recaudación (S/)",
      description: "Objetivo de la barra «Recaudación».",
      type: "number",
      group: "campana",
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: "metaNinos",
      title: "Meta de niños abrigados",
      description: "Objetivo de la barra «Niños abrigados».",
      type: "number",
      group: "campana",
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: "imagenDonateHero",
      title: "Imagen de portada de /donate",
      description:
        "Foto de fondo de la página Donar. Ideal: 1920px de ancho o más. Si se deja vacía, se usa la foto actual del sitio.",
      type: "image",
      group: "imagenes",
    }),
  ],
  preview: { prepare: () => ({ title: "Configuración del sitio" }) },
});
