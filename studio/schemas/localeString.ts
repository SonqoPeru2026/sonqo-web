import { defineType, defineField } from "sanity";

export const localeString = defineType({
  name: "localeString",
  title: "Texto bilingüe",
  type: "object",
  fields: [
    defineField({
      name: "es",
      title: "Español",
      type: "string",
      validation: (rule) => rule.required().error("Falta el texto en español"),
    }),
    defineField({
      name: "en",
      title: "English",
      type: "string",
      validation: (rule) => rule.required().error("Falta el texto en inglés"),
    }),
  ],
});

// Variante para textos largos (párrafos): textarea en vez de input.
export const localeText = defineType({
  name: "localeText",
  title: "Párrafo bilingüe",
  type: "object",
  fields: [
    defineField({
      name: "es",
      title: "Español",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().error("Falta el texto en español"),
    }),
    defineField({
      name: "en",
      title: "English",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().error("Falta el texto en inglés"),
    }),
  ],
});
