// Contenido de la página /privacy. Misma estructura que terms.ts.
export default {
  eyebrow: "Legal",
  title: "Política de Privacidad",
  subtitle:
    "Qué datos recolectamos, para qué los usamos y qué derechos tienes. Conforme a la Ley N.° 29733 y su Reglamento (D.S. 003-2013-JUS).",
  updatedLabel: "Última actualización",
  lastUpdated: "2 de julio de 2026",
  tocLabel: "Contenido",
  sections: [
    {
      id: "responsable",
      heading: "Responsable del tratamiento",
      paragraphs: [
        "Los datos personales que nos facilites quedarán incorporados en un banco de datos cuyo titular es Sonqo Perú. Para cualquier asunto relacionado con tus datos, escríbenos a contacto@sonqoperu.com.",
        "Tratamos tus datos con apego a los principios y requisitos de la Ley N.° 29733, Ley de Protección de Datos Personales, su Reglamento aprobado por D.S. 003-2013-JUS y las normas que las modifiquen o sustituyan.",
      ],
    },
    {
      id: "datos",
      heading: "Datos que recolectamos",
      paragraphs: ["Recolectamos únicamente los datos que nos proporcionas en nuestros formularios:"],
      list: [
        {
          term: "Formulario de contacto",
          desc: "nombre, correo electrónico, teléfono (opcional) y el mensaje que nos envías.",
        },
        {
          term: "Formulario de infografía",
          desc: "nombre, correo electrónico y teléfono, que almacenamos para enviarte el material y contactarte.",
        },
        {
          term: "Donaciones",
          desc: "nombre, apellido, correo electrónico, teléfono (opcional) y número de documento. Los datos de tu tarjeta los procesa y tokeniza directamente MercadoPago; Sonqo nunca ve ni almacena el número de tu tarjeta.",
        },
      ],
    },
    {
      id: "finalidades",
      heading: "Finalidades",
      paragraphs: [
        "Usamos tus datos para responder tus consultas, enviarte la infografía solicitada, procesar tus donaciones y remitirte los comprobantes o comunicaciones relacionadas con ellas.",
      ],
    },
    {
      id: "consentimiento",
      heading: "Base legal y consentimiento",
      paragraphs: [
        "La base legal para tratar tus datos es tu consentimiento, que otorgas de forma expresa al marcar la casilla de aceptación y enviar cada formulario.",
        "Puedes revocar tu consentimiento en cualquier momento escribiéndonos a contacto@sonqoperu.com, sin que ello afecte la licitud del tratamiento previo a la revocación.",
      ],
    },
    {
      id: "terceros",
      heading: "Encargados y terceros",
      paragraphs: [
        "Para operar el sitio nos apoyamos en proveedores de confianza que tratan datos por cuenta de Sonqo y bajo nuestras instrucciones, con fines de alojamiento del sitio, almacenamiento de datos, envío de correos y procesamiento de pagos. Estos proveedores solo acceden a la información necesaria y bajo deber de confidencialidad.",
        "No vendemos ni cedemos tus datos a terceros con fines comerciales, salvo obligación legal.",
      ],
    },
    {
      id: "transferencia",
      heading: "Transferencia internacional",
      paragraphs: [
        "Algunos de estos proveedores alojan la información en servidores ubicados fuera del Perú. Al usar el sitio y enviar tus datos, consientes dicha transferencia internacional, que se realiza con proveedores que aplican estándares adecuados de seguridad.",
      ],
    },
    {
      id: "conservacion",
      heading: "Conservación",
      paragraphs: [
        "Conservamos tus datos mientras sean necesarios para las finalidades descritas o mientras lo exija la ley. Luego se eliminan o anonimizan de forma segura.",
      ],
    },
    {
      id: "derechos",
      heading: "Tus derechos",
      paragraphs: [
        "Como titular de tus datos, tienes derecho a acceder a ellos, rectificarlos, cancelarlos u oponerte a su tratamiento (derechos ARCO), así como a revocar tu consentimiento. Para ejercerlos, escríbenos a contacto@sonqoperu.com; atenderemos tu solicitud en los plazos que establece la ley.",
        "Si consideras que no atendimos adecuadamente tu solicitud, puedes presentar un reclamo ante la Autoridad Nacional de Protección de Datos Personales del Ministerio de Justicia y Derechos Humanos.",
      ],
    },
    {
      id: "cookies",
      heading: "Cookies y analítica",
      paragraphs: [
        "Usamos cookies estrictamente necesarias para el funcionamiento del sitio. Si en el futuro incorporamos cookies de analítica o medición, lo indicaremos y, cuando corresponda, solicitaremos tu consentimiento.",
        "Puedes desactivar o eliminar las cookies desde la configuración de tu navegador; ten en cuenta que algunas funciones del sitio podrían dejar de operar correctamente.",
      ],
    },
    {
      id: "seguridad",
      heading: "Seguridad",
      paragraphs: [
        "Aplicamos medidas razonables para proteger tus datos, como conexión cifrada (HTTPS), controles de acceso en nuestra base de datos y tokenización de los pagos. Ningún sistema es totalmente infalible, por lo que no podemos garantizar seguridad absoluta.",
      ],
    },
    {
      id: "menores",
      heading: "Menores de edad",
      paragraphs: [
        "El sitio está dirigido a personas mayores de 18 años y no recolectamos conscientemente datos de niños menores de 14 años. Si tienes entre 14 y 18 años, debes usar el sitio bajo la supervisión de tu padre, madre o tutor. Si tenemos conocimiento de que un menor nos facilitó datos sin autorización, los eliminaremos.",
      ],
    },
    {
      id: "cambios",
      heading: "Cambios en esta política",
      paragraphs: [
        "Podemos actualizar esta Política de Privacidad. La versión vigente es la publicada en esta página; te recomendamos revisarla periódicamente.",
      ],
    },
    {
      id: "contacto",
      heading: "Contacto",
      paragraphs: [
        "Ante cualquier duda sobre esta política o el tratamiento de tus datos, escríbenos a contacto@sonqoperu.com.",
      ],
    },
  ],
  help: {
    title: "¿Quieres ejercer tus derechos?",
    text: "Escríbenos para acceder, rectificar o eliminar tus datos.",
    cta: "Escribir a Sonqo",
    email: "contacto@sonqoperu.com",
  },
} as const;
