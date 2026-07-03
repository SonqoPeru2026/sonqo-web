export default {
  eyebrow: "Legal",
  title: "Privacy Policy",
  subtitle:
    "What data we collect, what we use it for, and the rights you have. In accordance with Peru's Law No. 29733 and its Regulation (D.S. 003-2013-JUS).",
  updatedLabel: "Last updated",
  lastUpdated: "July 2, 2026",
  tocLabel: "Contents",
  backLabel: "Back to home",
  sections: [
    {
      id: "responsable",
      heading: "Data controller",
      paragraphs: [
        "The personal data you provide will be incorporated into a database owned by Sonqo Perú. For any matter related to your data, write to contacto@sonqoperu.com.",
        "We process your data in accordance with the principles and requirements of Law No. 29733, the Personal Data Protection Law, its Regulation approved by D.S. 003-2013-JUS, and any rules that amend or replace them.",
      ],
    },
    {
      id: "datos",
      heading: "Data we collect",
      paragraphs: ["We only collect the data you provide through our forms:"],
      list: [
        {
          term: "Contact form",
          desc: "name, email, phone (optional) and the message you send us.",
        },
        {
          term: "Infographic form",
          desc: "name, email and phone, which we store to send you the material and to contact you.",
        },
        {
          term: "Donations",
          desc: "first name, last name, email, phone (optional) and document number. Your card data is processed and tokenized directly by MercadoPago; Sonqo never sees or stores your card number.",
        },
      ],
    },
    {
      id: "finalidades",
      heading: "Purposes",
      paragraphs: [
        "We use your data to respond to your inquiries, send you the requested infographic, process your donations, and send you receipts or communications related to them.",
      ],
    },
    {
      id: "consentimiento",
      heading: "Legal basis and consent",
      paragraphs: [
        "The legal basis for processing your data is your consent, which you grant expressly by checking the acceptance box and submitting each form.",
        "You may withdraw your consent at any time by writing to contacto@sonqoperu.com, without affecting the lawfulness of processing carried out before the withdrawal.",
      ],
    },
    {
      id: "terceros",
      heading: "Processors and third parties",
      paragraphs: [
        "To operate the site we rely on trusted providers that process data on Sonqo's behalf and under our instructions, for the purposes of site hosting, data storage, email delivery and payment processing. These providers only access the information they need and under a duty of confidentiality.",
        "We do not sell or share your data with third parties for commercial purposes, except where required by law.",
      ],
    },
    {
      id: "transferencia",
      heading: "International transfer",
      paragraphs: [
        "Some of these providers host information on servers located outside Peru. By using the site and submitting your data, you consent to such international transfer, which is carried out with providers that apply adequate security standards.",
      ],
    },
    {
      id: "conservacion",
      heading: "Retention",
      paragraphs: [
        "We keep your data for as long as it is necessary for the purposes described or as required by law. Afterwards it is securely deleted or anonymized.",
      ],
    },
    {
      id: "derechos",
      heading: "Your rights",
      paragraphs: [
        "As the owner of your data, you have the right to access, rectify, cancel or object to its processing (ARCO rights), as well as to withdraw your consent. To exercise them, write to contacto@sonqoperu.com; we will handle your request within the timeframes set by law.",
        "If you believe your request was not handled properly, you may file a complaint with the National Authority for Personal Data Protection of the Ministry of Justice and Human Rights.",
      ],
    },
    {
      id: "cookies",
      heading: "Cookies and analytics",
      paragraphs: [
        "We use strictly necessary cookies for the site to function. If in the future we add analytics or measurement cookies, we will indicate it and, where applicable, request your consent.",
        "You can disable or delete cookies from your browser settings; note that some site features may stop working correctly.",
      ],
    },
    {
      id: "seguridad",
      heading: "Security",
      paragraphs: [
        "We apply reasonable measures to protect your data, such as encrypted connection (HTTPS), access controls on our database, and payment tokenization. No system is entirely infallible, so we cannot guarantee absolute security.",
      ],
    },
    {
      id: "menores",
      heading: "Minors",
      paragraphs: [
        "The site is directed to people over 18 and we do not knowingly collect data from children under 14. If you are between 14 and 18, you must use the site under the supervision of your parent or guardian. If we become aware that a minor provided us with data without authorization, we will delete it.",
      ],
    },
    {
      id: "cambios",
      heading: "Changes to this policy",
      paragraphs: [
        "We may update this Privacy Policy. The version in force is the one published on this page; we recommend reviewing it periodically.",
      ],
    },
    {
      id: "contacto",
      heading: "Contact",
      paragraphs: [
        "For any question about this policy or the processing of your data, write to contacto@sonqoperu.com.",
      ],
    },
  ],
  help: {
    title: "Want to exercise your rights?",
    text: "Write to us to access, rectify or delete your data.",
    cta: "Email Sonqo",
    email: "contacto@sonqoperu.com",
  },
} as const;
