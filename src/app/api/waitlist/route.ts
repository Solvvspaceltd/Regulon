/**
 * Early-access sign-up.
 *
 * Validates the request, then forwards it to the webhook in
 * WAITLIST_WEBHOOK_URL (for example a Power Automate flow, Zapier hook or
 * your CRM's intake endpoint). If no webhook is configured it returns 503,
 * and the form tells the visitor sign-up isn't open yet, so the site never
 * claims to have saved an address it hasn't.
 */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const AUDIENCES = new Set(["family", "organisation"]);

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const { email, audience, company } = (body ?? {}) as Record<string, unknown>;

  // Honeypot: real visitors never fill this field.
  if (typeof company === "string" && company.length > 0) {
    return Response.json({ ok: true });
  }

  if (typeof email !== "string" || email.length > 254 || !EMAIL.test(email.trim())) {
    return Response.json({ error: "invalid_email" }, { status: 422 });
  }
  if (typeof audience !== "string" || !AUDIENCES.has(audience)) {
    return Response.json({ error: "invalid_audience" }, { status: 422 });
  }

  const webhook = process.env.WAITLIST_WEBHOOK_URL;
  if (!webhook) {
    return Response.json({ error: "not_configured" }, { status: 503 });
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        audience,
        source: "regulon-site",
        at: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
  } catch (err) {
    console.error("[waitlist] forwarding failed", err);
    return Response.json({ error: "upstream_failed" }, { status: 502 });
  }

  return Response.json({ ok: true });
}
