export default {
  approvedTitle: "¡Gracias por tu donación!",
  approvedText:
    "Tu aporte ya está en camino para abrigar a un niño de las comunidades altoandinas del Perú. Te enviamos la confirmación a tu correo.",
  rejectedTitle: "El pago no se completó",
  rejectedText:
    "No pudimos procesar tu pago. No se realizó ningún cargo. Puedes intentarlo de nuevo cuando quieras.",
  // Motivo del rechazo por código de MercadoPago (status_detail). Fallback: rejectedText.
  rejectReasons: {
    cc_rejected_insufficient_amount: "Tu tarjeta no tiene fondos suficientes. No se realizó ningún cargo.",
    insufficient_amount: "Tu tarjeta no tiene fondos suficientes. No se realizó ningún cargo.",
    cc_rejected_bad_filled_card_number: "Revisa el número de tarjeta e inténtalo de nuevo.",
    cc_rejected_bad_filled_security_code: "Revisa el código de seguridad (CVV) de tu tarjeta.",
    cc_rejected_bad_filled_date: "Revisa la fecha de vencimiento de tu tarjeta.",
    cc_rejected_bad_filled_other: "Revisa los datos de tu tarjeta e inténtalo de nuevo.",
    cc_rejected_call_for_authorize: "Llama a tu banco para autorizar el pago y vuelve a intentarlo.",
    cc_rejected_card_disabled: "Tu tarjeta está inhabilitada. Contacta a tu banco para activarla.",
    cc_rejected_card_type_not_allowed: "Tu banco no permite este tipo de tarjeta para el pago.",
    cc_rejected_duplicated_payment: "Ya registramos un pago igual hace un momento. Espera unos minutos.",
    cc_rejected_high_risk: "Tu pago fue rechazado por seguridad. Prueba con otra tarjeta o medio de pago.",
    cc_rejected_invalid_installments: "El número de cuotas no es válido para esta tarjeta.",
    cc_rejected_max_attempts: "Alcanzaste el máximo de intentos. Prueba con otra tarjeta.",
    cc_rejected_other_reason: "Tu banco rechazó el pago. Prueba con otra tarjeta o contáctalo.",
    rejected_by_bank: "Tu banco rechazó el pago. Prueba con otra tarjeta o contáctalo.",
  },
  backHome: "Volver al inicio",
  retry: "Reintentar donación",
} as const;
