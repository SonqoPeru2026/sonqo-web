import { Resend } from "resend";
import { RESEND_API_KEY } from "astro:env/server";

// Cliente Resend único. API key solo server (nunca al cliente).
export const resend = new Resend(RESEND_API_KEY);
