"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const defaultFrom = process.env.EMAIL_FROM || "noreply@entaprenua.com";
const defaultFromName = process.env.EMAIL_FROM_NAME || "Store Team";

export async function sendEmail(opts: {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  fromName?: string;
  replyTo?: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  tags?: Array<{ name: string; value: string }>;
  headers?: Record<string, string>;
  attachments?: Array<{
    filename: string;
    content: string;
    content_type?: string;
  }>;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY not configured, returning dry-run");
    return { data: { id: "dry-run" }, error: null };
  }

  const senderEmail = opts.from || defaultFrom;
  const senderName = opts.fromName || defaultFromName;
  const from = senderName ? `${senderName} <${senderEmail}>` : senderEmail;

  return resend.emails.send({
    from,
    to: Array.isArray(opts.to) ? opts.to : [opts.to],
    subject: opts.subject,
    html: opts.html,
    text: opts.text,
    replyTo: opts.replyTo,
    cc: opts.cc,
    bcc: opts.bcc,
    tags: opts.tags,
    headers: opts.headers,
    attachments: opts.attachments
      ? opts.attachments.map((a) => ({
          filename: a.filename,
          content: a.content,
          content_type: a.content_type,
        }))
      : undefined,
  });
}
