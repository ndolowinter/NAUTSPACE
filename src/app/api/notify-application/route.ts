import { NextResponse } from "next/server";
import { renderEmailTemplate } from "@/lib/email/template";
import { APPLICATION_TRACK_LABELS } from "@/lib/applicationTracks";

interface NotifyPayload {
  track: string;
  coverNote?: string | null;
  applicantEmail?: string | null;
  resumeUrl?: string | null;
}

// Best-effort email notification the application is already saved in
// Supabase by the time this runs, so a failure here (missing API key,
// Resend outage, etc.) must never surface as a submission failure to the
// applicant. Always resolve 200; only the `sent` flag varies.
export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_INBOX_EMAIL;

  if (!apiKey || !to) {
    return NextResponse.json({ sent: false, reason: "not-configured" });
  }

  let body: NotifyPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ sent: false, reason: "invalid-payload" }, { status: 400 });
  }

  const trackLabel = APPLICATION_TRACK_LABELS[body.track as keyof typeof APPLICATION_TRACK_LABELS] ?? body.track;

  const bodyHtml = `
    <p style="margin:0 0 12px;"><strong>Track:</strong> ${trackLabel}</p>
    <p style="margin:0 0 12px;"><strong>Applicant email:</strong> ${body.applicantEmail ?? "unknown"}</p>
    <p style="margin:0 0 12px;"><strong>Cover note:</strong> ${body.coverNote?.trim() || "(none)"}</p>
    ${
      body.resumeUrl
        ? `<p style="margin:0;"><a href="${body.resumeUrl}" style="color:#22d3ee;">View resume (link expires in 7 days)</a></p>`
        : `<p style="margin:0;">Resume: (not attached)</p>`
    }
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL ?? "NautSpace International Careers <onboarding@resend.dev>",
        to,
        subject: `New application ${trackLabel}`,
        html: renderEmailTemplate({ heading: "New Internship Application", bodyHtml }),
      }),
    });

    return NextResponse.json({ sent: res.ok });
  } catch {
    return NextResponse.json({ sent: false, reason: "send-failed" });
  }
}
