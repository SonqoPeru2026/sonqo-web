// Contenido de la página /terms. La estructura (sections con paragraphs/list) la
// renderiza components/legal/LegalDoc.astro. en/terms.ts debe replicar esta forma.
export default {
  eyebrow: "Legal",
  title: "Términos y Condiciones",
  subtitle:
    "Las reglas para usar el sitio de Sonqo Perú y realizar donaciones. Léelas antes de aportar.",
  updatedLabel: "Última actualización",
  lastUpdated: "2 de julio de 2026",
  tocLabel: "Contenido",
  sections: [
    {
      id: "aceptacion",
      heading: "Aceptación",
      paragraphs: [
        "Al acceder a este sitio web y, en particular, al realizar una donación, aceptas estos Términos y Condiciones. Si no estás de acuerdo con ellos, te pedimos no utilizar el sitio ni realizar donaciones.",
      ],
    },
    {
      id: "definiciones",
      heading: "Definiciones",
      list: [
        { term: "Sonqo", desc: "la organización Sonqo Perú." },
        { term: "Usuario", desc: "cualquier persona que accede al sitio." },
        { term: "Donación", desc: "aporte económico voluntario realizado a favor de Sonqo." },
        { term: "Sitio", desc: "el sitio web sonqoperu.com y sus subdominios." },
      ],
    },
    {
      id: "objeto",
      heading: "Objeto",
      paragraphs: [
        "Sonqo es una organización sin fines de lucro dedicada a abrigar a niños de comunidades andinas del Perú mediante la entrega de casacas de calidad. El sitio informa sobre esta misión y permite realizar donaciones para apoyarla.",
      ],
    },
    {
      id: "donaciones",
      heading: "Donaciones",
      paragraphs: [
        "Las donaciones son voluntarias y se realizan en soles peruanos (PEN). Los pagos con tarjeta se procesan a través de MercadoPago; Sonqo no captura, almacena ni tiene acceso al número completo de tu tarjeta, ya que dicho dato lo tokeniza y gestiona directamente el procesador de pagos.",
      ],
    },
    {
      id: "no-reembolso",
      heading: "No reembolso",
      paragraphs: [
        "Al tratarse de aportes voluntarios a una causa social, las donaciones son definitivas y no reembolsables. La única excepción es un cobro duplicado o un error técnico comprobable: en ese caso, escríbenos a contacto@sonqoperu.com adjuntando el comprobante y evaluaremos la devolución del monto cobrado por error.",
      ],
    },
    {
      id: "uso-fondos",
      heading: "Uso de los fondos",
      paragraphs: [
        "Los fondos recaudados se destinan a la misión de Sonqo (adquisición y entrega de casacas y actividades relacionadas), según los criterios y prioridades que defina la organización. La donación no garantiza la asignación a un niño específico ni un resultado individualizado.",
      ],
    },
    {
      id: "propiedad-intelectual",
      heading: "Propiedad intelectual",
      paragraphs: [
        "El nombre, logotipo, marca, textos, imágenes y demás contenidos del sitio son propiedad de Sonqo o se usan con autorización. Queda prohibida su reproducción o uso sin consentimiento previo por escrito.",
      ],
    },
    {
      id: "uso-permitido",
      heading: "Uso permitido y prohibido",
      paragraphs: [
        "Te comprometes a usar el sitio de forma lícita. Está prohibido dañar o interrumpir su funcionamiento, extraer datos de forma automatizada sin permiso, suplantar a terceros o utilizar el sitio para fines fraudulentos o ilegales.",
      ],
    },
    {
      id: "responsabilidad",
      heading: "Limitación de responsabilidad",
      paragraphs: [
        'El sitio se ofrece "tal cual" y "según disponibilidad", sin garantías de operación ininterrumpida o libre de errores. En la máxima medida permitida por la ley, Sonqo no será responsable por daños indirectos, incidentales o derivados de fallas, caídas del servicio o de errores atribuibles a terceros.',
      ],
    },
    {
      id: "terceros",
      heading: "Enlaces y servicios de terceros",
      paragraphs: [
        "El sitio puede integrar o enlazar servicios de terceros (como MercadoPago o redes sociales) que se rigen por sus propios términos y políticas. Sonqo no controla ni se responsabiliza por dichos servicios.",
      ],
    },
    {
      id: "capacidad",
      heading: "Capacidad para donar",
      paragraphs: [
        "Para realizar una donación debes ser mayor de edad o contar con la autorización de tu padre, madre o tutor.",
      ],
    },
    {
      id: "modificaciones",
      heading: "Modificaciones",
      paragraphs: [
        "Sonqo puede actualizar estos Términos y Condiciones en cualquier momento. La versión vigente es la publicada en esta página; te recomendamos revisarla periódicamente.",
      ],
    },
    {
      id: "ley-aplicable",
      heading: "Ley aplicable y jurisdicción",
      paragraphs: [
        "Estos términos se rigen por las leyes de la República del Perú. Cualquier controversia se someterá a los jueces y tribunales de la ciudad de Cusco.",
      ],
    },
    {
      id: "contacto",
      heading: "Contacto",
      paragraphs: [
        "Para cualquier consulta sobre estos términos, escríbenos a contacto@sonqoperu.com — Sonqo Perú.",
      ],
    },
  ],
  help: {
    title: "¿Tienes dudas?",
    text: "Escríbenos y te respondemos lo antes posible.",
    cta: "Escribir a Sonqo",
    email: "contacto@sonqoperu.com",
  },
} as const;
