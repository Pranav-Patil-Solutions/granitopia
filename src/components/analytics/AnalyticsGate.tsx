"use client";

import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/next";
import { CONSENT_EVENT, getConsent } from "@/lib/consent";

/** Loads Vercel Analytics only after the user has accepted cookies (GDPR). */
export function AnalyticsGate() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const update = () => setEnabled(getConsent() === "accepted");
    update();
    window.addEventListener(CONSENT_EVENT, update);
    return () => window.removeEventListener(CONSENT_EVENT, update);
  }, []);

  return enabled ? <Analytics /> : null;
}
