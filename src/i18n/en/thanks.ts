export default {
  approvedTitle: "Thank you for your donation!",
  approvedText:
    "Your support is on its way to warm a child from the high-Andean communities of Peru. We sent the confirmation to your email.",
  rejectedTitle: "The payment didn't go through",
  rejectedText:
    "We couldn't process your payment. No charge was made. You can try again whenever you want.",
  // Rejection reason by MercadoPago code (status_detail). Fallback: rejectedText.
  rejectReasons: {
    cc_rejected_insufficient_amount: "Your card doesn't have enough funds. No charge was made.",
    insufficient_amount: "Your card doesn't have enough funds. No charge was made.",
    cc_rejected_bad_filled_card_number: "Check your card number and try again.",
    cc_rejected_bad_filled_security_code: "Check your card's security code (CVV).",
    cc_rejected_bad_filled_date: "Check your card's expiration date.",
    cc_rejected_bad_filled_other: "Check your card details and try again.",
    cc_rejected_call_for_authorize: "Call your bank to authorize the payment, then try again.",
    cc_rejected_card_disabled: "Your card is disabled. Contact your bank to activate it.",
    cc_rejected_card_type_not_allowed: "Your bank doesn't allow this card type for the payment.",
    cc_rejected_duplicated_payment: "We just registered an identical payment. Please wait a few minutes.",
    cc_rejected_high_risk: "Your payment was declined for security reasons. Try another card or method.",
    cc_rejected_invalid_installments: "The number of installments isn't valid for this card.",
    cc_rejected_max_attempts: "You reached the maximum number of attempts. Try another card.",
    cc_rejected_other_reason: "Your bank declined the payment. Try another card or contact them.",
    rejected_by_bank: "Your bank declined the payment. Try another card or contact them.",
  },
  backHome: "Back to home",
  retry: "Try donating again",
} as const;
