import { z } from "zod";
import { EMAIL } from "@/lib/contact";

/**
 * Quote / career enquiry validation, shared by the browser form and
 * POST /api/quote so the two cannot drift.
 *
 * Delivery (see deliverQuote):
 *   1. Honeypot filled → pretend success, send nothing.
 *   2. FORMSPREE_ENDPOINT or NEXT_PUBLIC_FORMSPREE_ENDPOINT set → POST the
 *      validated JSON to that Formspree form. Formspree, not this app, chooses
 *      the inbox. The payload does not set a recipient address.
 *   3. Neither variable set → "unconfigured". The browser may open a mailto:
 *      draft to sales@granitopia.com; that is not confirmed delivery.
 */

export const QUOTE_FIELDS = [
  "name",
  "email",
  "country",
  "phone",
  "stone",
  "role",
  "message",
] as const;

export type QuoteField = (typeof QUOTE_FIELDS)[number];

export const QUOTE_ERROR_KEYS = [
  "required",
  "invalidEmail",
  "tooLong",
  "tooShort",
  "invalidPhone",
] as const;

export type QuoteErrorKey = (typeof QUOTE_ERROR_KEYS)[number];

const phonePattern = /^$|^[0-9+().\-\s]{6,40}$/;

export const quoteSchema = z.object({
  name: z.string().trim().min(1, "required").max(120, "tooLong"),
  email: z
    .string()
    .trim()
    .min(1, "required")
    .max(200, "tooLong")
    .email("invalidEmail"),
  country: z.string().trim().min(2, "required").max(80, "tooLong"),
  phone: z
    .string()
    .trim()
    .max(40, "tooLong")
    .regex(phonePattern, "invalidPhone"),
  stone: z.string().trim().max(160, "tooLong"),
  role: z.string().trim().max(160, "tooLong"),
  message: z.string().trim().min(10, "tooShort").max(4000, "tooLong"),
  companyWebsite: z.string().max(200).optional().default(""),
});

export type QuotePayload = z.infer<typeof quoteSchema>;

export function isQuoteErrorKey(value: string): value is QuoteErrorKey {
  return (QUOTE_ERROR_KEYS as readonly string[]).includes(value);
}

export function fieldErrors(
  error: z.ZodError,
): Partial<Record<QuoteField, QuoteErrorKey>> {
  const fields: Partial<Record<QuoteField, QuoteErrorKey>> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key !== "string") continue;
    if (!(QUOTE_FIELDS as readonly string[]).includes(key)) continue;
    const field = key as QuoteField;
    if (fields[field]) continue;
    if (isQuoteErrorKey(issue.message)) fields[field] = issue.message;
  }
  return fields;
}

/** One line, so a role title cannot inject extra mailto or subject lines. */
export function oneLine(value: string, max = 160): string {
  return value.replace(/[\r\n]+/g, " ").trim().slice(0, max);
}

export function quoteSubject(input: Pick<QuotePayload, "role">): string {
  const role = oneLine(input.role);
  return role
    ? `Career application — ${role} — Granitopia`
    : "Quote request — Granitopia";
}

/** Draft only. Opening this URL does not deliver mail. */
export function openMailtoDraft(input: QuotePayload) {
  if (typeof window === "undefined") return;
  window.location.assign(mailtoHref(input));
}

export function mailtoHref(input: QuotePayload): string {
  const body = [
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Country: ${input.country}`,
    `Phone: ${input.phone || "-"}`,
    `Stone: ${input.stone || "-"}`,
    `Role: ${input.role || "-"}`,
    "",
    input.message,
  ].join("\n");
  return `mailto:${EMAIL}?subject=${encodeURIComponent(quoteSubject(input))}&body=${encodeURIComponent(body)}`;
}

export function formspreeEndpoint(): string | undefined {
  const value =
    process.env.FORMSPREE_ENDPOINT || process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export type QuoteDelivery =
  | { delivery: "sent" }
  | { delivery: "unconfigured" }
  | { delivery: "failed" };

export async function deliverQuote(
  input: QuotePayload,
  fetchImpl: typeof fetch = fetch,
): Promise<QuoteDelivery> {
  if (input.companyWebsite.trim()) return { delivery: "sent" };

  const endpoint = formspreeEndpoint();
  if (!endpoint) return { delivery: "unconfigured" };

  try {
    const res = await fetchImpl(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: input.name,
        email: input.email,
        country: input.country,
        phone: input.phone,
        stone: input.stone,
        role: input.role,
        message: input.message,
        _replyto: input.email,
        _subject: quoteSubject(input),
      }),
    });
    return res.ok ? { delivery: "sent" } : { delivery: "failed" };
  } catch {
    return { delivery: "failed" };
  }
}
