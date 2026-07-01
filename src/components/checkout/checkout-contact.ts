import { makeCheckoutContactSchema } from "@/lib/validation/checkout-contact";

export interface CheckoutContact {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export const CONTACT_CHANGE_EVENT = "checkout:contact-change";
export const CONTACT_INVALID_EVENT = "checkout:contact-invalid";

declare global {
  interface Window {
    __checkoutContact?: CheckoutContact;
  }
}

export function readContact(): CheckoutContact {
  return window.__checkoutContact ?? { firstName: "", lastName: "", email: "", phone: "" };
}

export function isContactValid(contact: CheckoutContact): boolean {
  return makeCheckoutContactSchema().safeParse(contact).success;
}
