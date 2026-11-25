"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  useForm,
  type FieldErrors,
  type Resolver,
  type UseFormRegister,
} from "react-hook-form";
import { useTranslations } from "next-intl";
import {
  isQuoteErrorKey,
  openMailtoDraft,
  quoteSchema,
  QUOTE_FIELDS,
  type QuoteErrorKey,
  type QuoteField,
  type QuotePayload,
} from "@/lib/quote";

/**
 * One field spec, looped for every control: associated label, described error,
 * required state, and the shared input class. Textarea and the optional role
 * row use the same ids and error text.
 *
 * `noValidate` turns off the browser bubble so the localized errors below are
 * the only ones. The same Zod schema runs here and again in POST /api/quote.
 */

const resolver: Resolver<QuotePayload> = async (values) => {
  const result = quoteSchema.safeParse(values);
  if (result.success) return { values: result.data, errors: {} };
  const errors: Record<string, { type: string; message: string }> = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0];
    if (typeof key !== "string" || errors[key] || key === "companyWebsite") {
      continue;
    }
    errors[key] = { type: issue.code, message: issue.message };
  }
  return { values: {}, errors: errors as FieldErrors<QuotePayload> };
};

const inputCls =
  "w-full rounded-sm border border-line bg-paper px-4 py-3 text-ink outline-none transition-colors focus:border-copper aria-[invalid=true]:border-red-600";
const labelCls = "mb-1 block text-xs uppercase tracking-widest text-ink-soft";
const errCls = "mt-1 text-xs text-red-600";

export function QuoteForm({
  defaultStone,
  defaultRole,
}: {
  defaultStone?: string;
  defaultRole?: string;
}) {
  const t = useTranslations("Contact");
  const baseId = useId();
  const statusRef = useRef<HTMLParagraphElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    setFocus,
    formState: { errors, isSubmitting, submitCount },
  } = useForm<QuotePayload>({
    defaultValues: {
      name: "",
      email: "",
      country: "",
      phone: "",
      stone: defaultStone ?? "",
      role: defaultRole ?? "",
      message: defaultRole
        ? t("form.rolePrefill", { role: defaultRole })
        : "",
      companyWebsite: "",
    },
    resolver,
  });
  const [status, setStatus] = useState<"idle" | "success" | "error" | "mailto">(
    "idle",
  );

  useEffect(() => {
    if (status === "success" || status === "mailto") {
      doneRef.current?.focus();
    } else if (status === "error") {
      statusRef.current?.focus();
    }
  }, [status]);

  function messageFor(key: string | undefined) {
    if (key && isQuoteErrorKey(key)) return t(`form.${key}`);
    return t("form.required");
  }

  function focusFirst(formErrors: FieldErrors<QuotePayload>) {
    for (const field of QUOTE_FIELDS) {
      if (formErrors[field]) {
        setFocus(field);
        return;
      }
    }
  }

  async function onSubmit(data: QuotePayload) {
    if (data.companyWebsite.trim()) {
      setStatus("success");
      return;
    }

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });
      const payload = (await res.json().catch(() => null)) as {
        ok?: boolean;
        delivery?: string;
        fields?: Partial<Record<QuoteField, QuoteErrorKey>>;
      } | null;

      if (payload?.delivery === "unconfigured") {
        openMailtoDraft(data);
        setStatus("mailto");
        reset();
        return;
      }
      if (res.ok && payload?.ok) {
        setStatus("success");
        reset();
        return;
      }
      if (res.status === 400 && payload?.fields) {
        const nextErrors: FieldErrors<QuotePayload> = {};
        let first: QuoteField | null = null;
        for (const field of QUOTE_FIELDS) {
          const key = payload.fields[field];
          if (!key) continue;
          setError(field, { type: "server", message: key });
          nextErrors[field] = { type: "server", message: key };
          first ??= field;
        }
        if (first) setFocus(first);
        else focusFirst(nextErrors);
        return;
      }
      setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success" || status === "mailto") {
    return (
      <div
        ref={doneRef}
        tabIndex={-1}
        role="status"
        className="rounded-sm border border-copper/40 bg-copper/5 p-6 text-ink outline-none"
      >
        {status === "mailto" ? t("form.mailtoFallback") : t("form.success")}
      </div>
    );
  }

  const errorCount = QUOTE_FIELDS.filter((field) => errors[field]).length;
  const summaryId = `${baseId}-summary`;

  return (
    <form
      onSubmit={handleSubmit(onSubmit, focusFirst)}
      className="space-y-4"
      noValidate
      aria-label={t("title")}
      aria-describedby={errorCount > 0 && submitCount > 0 ? summaryId : undefined}
    >
      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor={`${baseId}-company`}>Company website</label>
        <input
          id={`${baseId}-company`}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("companyWebsite")}
        />
      </div>

      {errorCount > 0 && submitCount > 0 && (
        <p id={summaryId} role="alert" className="text-sm text-red-600">
          {t("form.errorSummary", { count: errorCount })}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          name="name"
          label={t("form.name")}
          required
          autoComplete="name"
          baseId={baseId}
          register={register}
          error={errors.name?.message}
          messageFor={messageFor}
        />
        <Field
          name="email"
          label={t("form.email")}
          type="email"
          required
          autoComplete="email"
          baseId={baseId}
          register={register}
          error={errors.email?.message}
          messageFor={messageFor}
        />
        <Field
          name="country"
          label={t("form.country")}
          required
          autoComplete="country-name"
          baseId={baseId}
          register={register}
          error={errors.country?.message}
          messageFor={messageFor}
        />
        <Field
          name="phone"
          label={t("form.phone")}
          type="tel"
          autoComplete="tel"
          baseId={baseId}
          register={register}
          error={errors.phone?.message}
          messageFor={messageFor}
        />
      </div>

      <Field
        name="stone"
        label={t("form.stone")}
        baseId={baseId}
        register={register}
        error={errors.stone?.message}
        messageFor={messageFor}
      />

      {defaultRole ? (
        <Field
          name="role"
          label={t("form.role")}
          baseId={baseId}
          register={register}
          error={errors.role?.message}
          messageFor={messageFor}
        />
      ) : (
        <input type="hidden" {...register("role")} />
      )}

      <Field
        name="message"
        label={t("form.message")}
        required
        multiline
        baseId={baseId}
        register={register}
        error={errors.message?.message}
        messageFor={messageFor}
      />

      {status === "error" && (
        <p
          ref={statusRef}
          tabIndex={-1}
          role="alert"
          className="text-sm text-red-600 outline-none"
        >
          {t("form.error")}
        </p>
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

function Field({
  name,
  label,
  type = "text",
  required = false,
  autoComplete,
  multiline = false,
  baseId,
  register,
  error,
  messageFor,
}: {
  name: QuoteField;
  label: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  multiline?: boolean;
  baseId: string;
  register: UseFormRegister<QuotePayload>;
  error?: string;
  messageFor: (key: string | undefined) => string;
}) {
  const id = `${baseId}-${name}`;
  const errId = `${baseId}-${name}-error`;
  const shared = {
    id,
    className: inputCls,
    autoComplete,
    required,
    "aria-required": required || undefined,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errId : undefined,
    ...register(name),
  };

  return (
    <div>
      <label htmlFor={id} className={labelCls}>
        {label}
      </label>
      {multiline ? (
        <textarea rows={5} {...shared} />
      ) : (
        <input type={type} {...shared} />
      )}
      {error ? (
        <p id={errId} className={errCls}>
          {messageFor(error)}
        </p>
      ) : null}
    </div>
  );
}
