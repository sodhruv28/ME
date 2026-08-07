import { Resend } from "resend";
import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/site";

const resend = new Resend(process.env.RESEND_API_KEY);
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 3;
const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME = 100;
const MAX_EMAIL = 254;
const MAX_SUBJECT = 150;
const MAX_MESSAGE = 5000;

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function sanitizeHeader(value: unknown) {
  return String(value ?? "")
    .replace(/[\r\n\u0000]+/g, " ")
    .trim();
}

function asTrimmedString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function getClientIp(req: Request) {
  const forwardedFor = req.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() || "unknown";
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const bucket = rateLimitBuckets.get(ip);

  if (!bucket || bucket.resetAt <= now) {
    rateLimitBuckets.set(ip, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return false;
  }

  bucket.count += 1;
  return bucket.count > RATE_LIMIT_MAX_REQUESTS;
}

function pruneRateLimitBuckets() {
  const now = Date.now();
  for (const [ip, bucket] of rateLimitBuckets) {
    if (bucket.resetAt <= now) {
      rateLimitBuckets.delete(ip);
    }
  }
}

export async function POST(req: Request) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "Contact form is temporarily unavailable." },
        { status: 503 },
      );
    }

    pruneRateLimitBuckets();

    const ip = getClientIp(req);
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again shortly." },
        { status: 429 },
      );
    }

    const body = await req.json();
    const name = asTrimmedString(body.name);
    const email = asTrimmedString(body.email);
    const subject = asTrimmedString(body.subject);
    const message = asTrimmedString(body.message);
    const honeypot = asTrimmedString(body.company);

    // Bots often fill hidden fields; treat as success without sending.
    if (honeypot) {
      return NextResponse.json({ success: true });
    }

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 },
      );
    }

    if (
      name.length > MAX_NAME ||
      email.length > MAX_EMAIL ||
      subject.length > MAX_SUBJECT ||
      message.length > MAX_MESSAGE
    ) {
      return NextResponse.json(
        { error: "One or more fields are too long." },
        { status: 400 },
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message);
    const headerSubject = sanitizeHeader(subject) || `New Inquiry: ${name}`;
    const textSubject = sanitizeHeader(subject) || "No Subject Provided";

    const { data, error } = await resend.emails.send({
      from: `${siteConfig.name} <contact@sodhruv.me>`,
      to: [siteConfig.email],
      subject: headerSubject,
      replyTo: email,
      text: `From: ${sanitizeHeader(name)} (${sanitizeHeader(email)})\nSubject: ${textSubject}\n\n${message}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #3b82f6; margin-top: 0;">New Portfolio Message</h2>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p><strong>From:</strong> ${safeName} (${safeEmail})</p>
          <p><strong>Subject:</strong> ${safeSubject}</p>
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <p style="margin-top: 0; color: #64748b; font-size: 12px; text-transform: uppercase; font-weight: bold;">Message</p>
            <p style="white-space: pre-wrap; color: #1e293b; line-height: 1.6;">${safeMessage}</p>
          </div>
          <footer style="margin-top: 30px; font-size: 11px; color: #94a3b8; text-align: center;">
            Sent from sodhruv.me portfolio
          </footer>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json(
        { error: "Failed to send message. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
