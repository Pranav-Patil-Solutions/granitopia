"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { EMAIL } from "@/lib/contact";

interface FormData {
  name: string;
  email: string;
  country: string;
  phone?: string;
  stone?: string;
  message: string;
  _gotcha?: string; // honeypot
}

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function QuoteForm({ defaultStone }: { defaultStone?: string }) {
  const t = useTranslations("Contact");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ defaultValues: { stone: defaultStone ?? "" } });
  const [status, setStatus] = useState<
    "idle" | "success" | "error" | "mailto"
  >("idle");

  // TODO(assets): set NEXT_PUBLIC_FORMSPREE_ENDPOINT to the real Formspree URL.
  const endpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;

  async function onSubmit(data: FormData) {
    if (data._gotcha) return; // bot caught by honeypot

    if (!endpoint) {
      // Fallback until Formspree is wired: open a pre-filled email.
      const body = encodeURIComponent(
        `Name: ${data.name}\nEmail: ${data.email}\nCountry: ${data.country}\nPhone: ${data.phone || "-"}\nStone: ${data.stone || "-"}\n\n${data.message}`,
      );
      window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(
        "Quote request — Granitopia",
      )}&body=${body}`;
      // Honest: opening the mail client is not confirmed delivery.
      setStatus("mailto");
      reset();
      return;
    }

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setStatus("success");
        reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success" || status === "mailto") {
    return (
      <div className="rounded-sm border border-copper/40 bg-copper/5 p-6 text-ink">
        {status === "mailto" ? t("form.mailtoFallback") : t("form.success")}
      </div>
    );
  }

  const inputCls =
    "w-full rounded-sm border border-line bg-paper px-4 py-3 text-ink outline-none transition-colors focus:border-copper";
  const labelCls =
    "mb-1 block text-xs uppercase tracking-widest text-ink-soft";
  const errCls = "mt-1 text-xs text-red-600";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* Honeypot (hidden from users) */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
        {...register("_gotcha")}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>{t("form.name")}</label>
          <input
            className={inputCls}
            aria-invalid={!!errors.name}
            {...register("name", { required: true })}
          />
          {errors.name && <p className={errCls}>{t("form.required")}</p>}
        </div>
        <div>
          <label className={labelCls}>{t("form.email")}</label>
          <input
            type="email"
            className={inputCls}
            aria-invalid={!!errors.email}
            {...register("email", { required: true, pattern: EMAIL_RE })}
          />
          {errors.email && (
            <p className={errCls}>
              {errors.email.type === "pattern"
                ? t("form.invalidEmail")
                : t("form.required")}
            </p>
          )}
        </div>
        <div>
          <label className={labelCls}>{t("form.country")}</label>
          <input
            className={inputCls}
            aria-invalid={!!errors.country}
            {...register("country", { required: true })}
          />
          {errors.country && <p className={errCls}>{t("form.required")}</p>}
        </div>
        <div>
          <label className={labelCls}>{t("form.phone")}</label>
          <input className={inputCls} {...register("phone")} />
        </div>
      </div>

      <div>
        <label className={labelCls}>{t("form.stone")}</label>
        <input className={inputCls} {...register("stone")} />
      </div>

      <div>
        <label className={labelCls}>{t("form.message")}</label>
        <textarea
          rows={5}
          className={inputCls}
          aria-invalid={!!errors.message}
          {...register("message", { required: true })}
        />
        {errors.message && <p className={errCls}>{t("form.required")}</p>}
      </div>

      {status === "error" && (
        <p className="text-sm text-red-600">{t("form.error")}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-full bg-copper px-8 py-3.5 text-sm font-medium uppercase tracking-widest text-white transition-transform hover:scale-105 disabled:opacity-60"
      >
        {isSubmitting ? t("form.sending") : t("form.submit")}
      </button>
    </form>
  );
}
