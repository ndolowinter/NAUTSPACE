import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { renderEmailTemplate, textToParagraphs } from "@/lib/email/template";
import { EXECUTIVE_ROLES, type UserRole } from "@/lib/types/database";

interface BroadcastPayload {
  subject: string;
  body: string;
  audience: "all" | UserRole;
}

// Middleware only gates page rendering for /executive/*, not /api/* routes,
// so this route re-checks the caller's role itself before sending anything.
export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: "Not signed in." }, { status: 401 });
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();

  if (!profile || !EXECUTIVE_ROLES.includes(profile.role)) {
    return NextResponse.json({ message: "Not authorized." }, { status: 403 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ message: "Email sending isn't configured yet." }, { status: 503 });
  }

  let payload: BroadcastPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  if (!payload.subject?.trim() || !payload.body?.trim()) {
    return NextResponse.json({ message: "Subject and message are required." }, { status: 400 });
  }

  const query = supabase.from("profiles").select("email");
  const { data: recipients } =
    payload.audience === "all" ? await query : await query.eq("role", payload.audience);

  const emails = [...new Set((recipients ?? []).map((r) => r.email).filter(Boolean))];

  const html = renderEmailTemplate({ heading: payload.subject, bodyHtml: textToParagraphs(payload.body) });

  const results = await Promise.allSettled(
    emails.map((to) =>
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL ?? "NautSpace International <onboarding@resend.dev>",
          to,
          subject: payload.subject,
          html,
        }),
      })
    )
  );

  const sent = results.filter((r) => r.status === "fulfilled" && r.value.ok).length;

  return NextResponse.json({
    message: `Sent to ${sent} of ${emails.length} recipient(s).`,
    sent,
    total: emails.length,
  });
}
