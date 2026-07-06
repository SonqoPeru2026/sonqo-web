import { defineType, defineField } from "sanity";

export default defineType({
  name: "galleryPhoto",
  title: "Foto de galería",
  type: "document",
  fields: [
    defineField({
      name: "orden",
      title: "Orden",
      description: "Posición en el mosaico (1 = primera).",
      type: "number",
      validation: (rule) => rule.required().integer().min(1),
    }),
    defineField({
      name: "imagen",
      title: "Foto",
      type: "image",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "size",
      title: "Tamaño en el mosaico",
      description: "Cuánto espacio ocupa la card. «Normal» = 1 celda.",
      type: "string",
      options: {
        list: [
          { title: "Normal", value: "normal" },
          { title: "Ancha (2 columnas)", value: "wide" },
          { title: "Alta (2 filas)", value: "tall" },
          { title: "Grande (2×2)", value: "big" },
        ],
        layout: "radio",
      },
      initialValue: "normal",
    }),
    defineField({
      name: "caption",
      title: "Leyenda — opcional",
      description: "Frase corta que aparece al pasar el mouse.",
      type: "localeString",
    }),
    defineField({
      name: "location",
      title: "Lugar — opcional",
      description: "Ej: «Comunidades altoandinas del Perú». Se muestra igual en ambos idiomas.",
      type: "string",
    }),
    defineField({
      name: "fotosAlbum",
      title: "Fotos del álbum — opcional",
      description:
        "Si agregas fotos aquí, la card se vuelve un álbum: la foto principal es la portada y estas se ven en el visor.",
      type: "array",
      of: [{ type: "image" }],
    }),
  ],
  orderings: [
    {
      title: "Por orden",
      name: "porOrden",
      by: [{ field: "orden", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "caption.es", subtitle: "orden", media: "imagen" },
    prepare: ({ title, subtitle, media }) => ({
      title: title ?? "(sin leyenda)",
      subtitle: `Foto ${subtitle ?? "?"}`,
      media,
    }),
  },
});
