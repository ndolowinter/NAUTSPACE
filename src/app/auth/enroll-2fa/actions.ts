"use server";

import { cookies } from "next/headers";
import { authenticator } from "otplib";
import QRCode from "qrcode";
import { createClient } from "@/lib/supabase/server";

interface StartEnrollmentResult {
  success: boolean;
  error?: string;
  qrDataUrl?: string;
  manualKey?: string;
}

/**
 * Generates a fresh TOTP secret, writes it to the caller's profile, and
 * returns a scannable QR code. `is_2fa_enabled` stays false until
 * confirmEnrollment() verifies the user actually holds the secret (i.e. can
 * produce a valid code from it) otherwise a dropped enrollment flow would
 * silently lock the account out of /executive/*.
 */
export async function startTotpEnrollment(): Promise<StartEnrollmentResult> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not signed in." };
  }

  const secret = authenticator.generateSecret();
  const issuer = process.env.AUTH_TOTP_ISSUER ?? "NautSpace International";
  const otpauthUrl = authenticator.keyuri(user.email ?? user.id, issuer, secret);

  const { error } = await supabase
    .from("profiles")
    .update({ totp_secret_encrypted: secret })
    .eq("id", user.id);

  if (error) {
    return { success: false, error: "Could not start enrollment. Please try again." };
  }

  const qrDataUrl = await QRCode.toDataURL(otpauthUrl);

  return { success: true, qrDataUrl, manualKey: secret };
}

interface ConfirmEnrollmentResult {
  success: boolean;
  error?: string;
}

/** Verifies the user can produce a valid code from the pending secret, then flips 2FA on. */
export async function confirmTotpEnrollment(code: string): Promise<ConfirmEnrollmentResult> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not signed in." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("totp_secret_encrypted")
    .eq("id", user.id)
    .single();

  if (!profile?.totp_secret_encrypted) {
    return { success: false, error: "No enrollment in progress start over." };
  }

  const isValid = authenticator.verify({ token: code, secret: profile.totp_secret_encrypted });

  if (!isValid) {
    return { success: false, error: "Invalid or expired code." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ is_2fa_enabled: true })
    .eq("id", user.id);

  if (error) {
    return { success: false, error: "Could not enable 2FA. Please try again." };
  }

  cookies().set("nautspace_2fa_verified", "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 8,
    path: "/",
  });

  return { success: true };
}
