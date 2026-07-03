// Lightweight cookie-consent store (GDPR): analytics only load after "accepted".
export const CONSENT_KEY = "granitopia-consent";
export const CONSENT_EVENT = "granitopia-consentchange";

export type Consent = "accepted" | "declined" | null;

export function getConsent(): Consent {
  if (typeof window === "undefined") return null;
  return (window.localStorage.getItem(CONSENT_KEY) as Consent) ?? null;
}

export function setConsent(value: Exclude<Consent, null>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CONSENT_KEY, value);
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}
