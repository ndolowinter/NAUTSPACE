import { NextResponse } from "next/server";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { isSuperuserEmail } from "@/lib/types/database";

// Stub for the monthly Mpesa (Safaricom Daraja) membership charge. The real
// Daraja STK-push call, callback URL, and credentials are set up separately
// later this route validates the caller and records the request shape now
// so the dashboard's "Pay with Mpesa" button already works end-to-end once
// MPESA_CONSUMER_KEY / MPESA_CONSUMER_SECRET / MPESA_SHORTCODE are supplied.
export async function POST() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: "Sign in to pay your membership fee." }, { status: 401 });
  }

  if (isSuperuserEmail(user.email)) {
    return NextResponse.json({
      message: "This admin account has a lifetime membership and does not require payment.",
    });
  }

  const configured = Boolean(
    process.env.MPESA_CONSUMER_KEY && process.env.MPESA_CONSUMER_SECRET && process.env.MPESA_SHORTCODE
  );

  if (!configured) {
    return NextResponse.json({
      message: "Mpesa payments are launching soon we'll email you as soon as they're live.",
      configured: false,
    });
  }

  // Placeholder for when Daraja credentials exist: authenticate with Daraja,
  // trigger STK push to the member's phone, then record the checkout request
  // id via the service-role client (trusted server-only write, same pattern
  // documented in lib/supabase/server.ts) so the callback can later match it
  // back to this membership row.
  const serviceRole = createServiceRoleClient();
  await serviceRole
    .from("memberships")
    .update({ mpesa_checkout_request_id: null })
    .eq("user_id", user.id);

  return NextResponse.json({ message: "Mpesa payment initiated check your phone." });
}
