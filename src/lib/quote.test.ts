import { afterEach, describe, expect, it } from "vitest";
import {
  deliverQuote,
  fieldErrors,
  mailtoHref,
  quoteSchema,
  quoteSubject,
} from "./quote";

const valid = {
  name: "Amina Shah",
  email: "amina@example.com",
  country: "Germany",
  phone: "+49 151 000000",
  stone: "Millennium Cream",
  role: "",
  message: "I need 40 square metres, polished, for a lobby.",
  companyWebsite: "",
};

afterEach(() => {
  delete process.env.FORMSPREE_ENDPOINT;
  delete process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;
});

describe("quoteSchema", () => {
  it("accepts a complete enquiry", () => {
    expect(quoteSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a missing name, a bad email, and a short message", () => {
    const result = quoteSchema.safeParse({
      ...valid,
      name: "  ",
      email: "not-an-email",
      message: "too short",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(fieldErrors(result.error)).toMatchObject({
        name: "required",
        email: "invalidEmail",
        message: "tooShort",
      });
    }
  });

  it("allows an empty phone and rejects a fragment", () => {
    expect(quoteSchema.safeParse({ ...valid, phone: "" }).success).toBe(true);
    const bad = quoteSchema.safeParse({ ...valid, phone: "12" });
    expect(bad.success).toBe(false);
    if (!bad.success) expect(fieldErrors(bad.error).phone).toBe("invalidPhone");
  });
});

describe("delivery", () => {
  it("does not call the network when no Formspree endpoint is configured", async () => {
    let called = false;
    const result = await deliverQuote(valid, () => {
      called = true;
      return Promise.resolve(new Response());
    });
    expect(result).toEqual({ delivery: "unconfigured" });
    expect(called).toBe(false);
  });

  it("builds a mailto draft to sales and includes the role, without sending", () => {
    const href = mailtoHref({
      ...valid,
      role: "Export Sales Manager",
    });
    expect(href.startsWith("mailto:sales@granitopia.com?")).toBe(true);
    expect(decodeURIComponent(href)).toContain("Export Sales Manager");
    expect(quoteSubject({ role: "Export Sales Manager" })).toContain(
      "Career application",
    );
  });

  it("drops a honeypot submission before any request", async () => {
    process.env.FORMSPREE_ENDPOINT = "https://formspree.io/f/test";
    let called = false;
    const result = await deliverQuote(
      { ...valid, companyWebsite: "http://spam.test" },
      () => {
        called = true;
        return Promise.resolve(new Response());
      },
    );
    expect(result).toEqual({ delivery: "sent" });
    expect(called).toBe(false);
  });

  it("posts only validated fields to a configured endpoint", async () => {
    process.env.FORMSPREE_ENDPOINT = "https://formspree.io/f/test";
    const seen: { url?: string; body?: unknown } = {};
    const result = await deliverQuote(valid, (url, init) => {
      seen.url = String(url);
      seen.body = JSON.parse(String(init?.body));
      return Promise.resolve(new Response("{}", { status: 200 }));
    });
    expect(result).toEqual({ delivery: "sent" });
    expect(seen.url).toBe("https://formspree.io/f/test");
    expect(seen.body).toMatchObject({
      email: valid.email,
      stone: "Millennium Cream",
      _replyto: valid.email,
    });
    expect(seen.body).not.toHaveProperty("companyWebsite");
  });
});
