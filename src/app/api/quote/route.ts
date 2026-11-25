import { deliverQuote, fieldErrors, quoteSchema } from "@/lib/quote";

const MAX_BODY = 20_000;

export async function POST(request: Request) {
  const declared = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declared) && declared > MAX_BODY) {
    return Response.json({ ok: false, error: "invalid" }, { status: 413 });
  }

  let body: unknown;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY) {
      return Response.json({ ok: false, error: "invalid" }, { status: 413 });
    }
    body = JSON.parse(text);
  } catch {
    return Response.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const parsed = quoteSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: "invalid", fields: fieldErrors(parsed.error) },
      { status: 400 },
    );
  }

  const result = await deliverQuote(parsed.data);
  if (result.delivery === "sent") {
    return Response.json({ ok: true, delivery: "sent" });
  }
  if (result.delivery === "unconfigured") {
    return Response.json(
      { ok: false, delivery: "unconfigured" },
      { status: 503 },
    );
  }
  return Response.json({ ok: false, delivery: "failed" }, { status: 502 });
}
