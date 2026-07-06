import { defineType, defineField } from "sanity";

export default defineType({
  name: "heroSlide",
  title: "Slide del inicio",
  type: "document",
  fields: [
    defineField({
      name: "orden",
      title: "Orden",
      description: "Posición en el carrusel (1 = primero).",
      type: "number",
      validation: (rule) => rule.required().integer().min(1),
    }),
    defineField({
      name: "imagen",
      title: "Imagen (desktop)",
      description: "Foto horizontal grande. Ideal: 2560px de ancho o más.",
      type: "image",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "imagenMobile",
      title: "Imagen (celular) — opcional",
      description: "Versión vertical para celulares. Si se deja vacía, se usa la de desktop.",
      type: "image",
    }),
    defineField({
      name: "titulo",
      title: "Título",
      description:
        'Admite resaltado en rojo con <span class="text-primary">palabra</span>.',
      type: "localeString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "texto",
      title: "Texto",
      type: "localeText",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "alt",
      title: "Descripción de la imagen (accesibilidad)",
      description: "Qué se ve en la foto. Lo leen lectores de pantalla y Google.",
      type: "localeString",
      validation: (rule) => rule.required(),
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
    select: { title: "titulo.es", subtitle: "orden", media: "imagen" },
    prepare: ({ title, subtitle, media }) => ({
      title: (title ?? "(sin título)").replace(/<[^>]+>/g, ""),
      subtitle: `Slide ${subtitle ?? "?"}`,
      media,
    }),
  },
});
