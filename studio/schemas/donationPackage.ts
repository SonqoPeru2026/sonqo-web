import { defineType, defineField } from "sanity";

export default defineType({
  name: "donationPackage",
  title: "Paquete de donación",
  type: "document",
  fields: [
    defineField({
      name: "packageId",
      title: "Paquete",
      description: "A qué paquete corresponde. No se puede cambiar después de crear.",
      type: "string",
      options: {
        list: [
          { title: "Aliado Sonqo (S/33)", value: "aliado" },
          { title: "Niños Felices (S/165)", value: "ninos" },
          { title: "Corazón Solidario (S/330)", value: "corazon" },
          { title: "Comunidad Sonqo (S/660)", value: "comunidad" },
        ],
        layout: "radio",
      },
      readOnly: ({ document }) => Boolean(document?._createdAt),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "nombre",
      title: "Nombre visible",
      type: "localeString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "impacto",
      title: "Frase de impacto",
      description: "Ej: «Abrigas a 1 niño todo el invierno.»",
      type: "localeString",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "nombre.es", subtitle: "packageId" },
    prepare: ({ title, subtitle }) => ({
      title: title ?? "(sin nombre)",
      subtitle,
    }),
  },
});
