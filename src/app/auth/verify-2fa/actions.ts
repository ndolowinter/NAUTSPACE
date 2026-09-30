"use server";

import { cookies } from "next/headers";
import { authenticator } from "otplib";
import { createClient } from "@/lib/supabase/server";

interface VerifyResult {
  success: boolean;
  error?: string;
}

/**
 * Verifies a TOTP code against the caller's stored secret and, on success,
 * sets the short-lived cookie middleware.ts checks before admitting
 * requests to /executive/*.
 *
 * NOTE: `totp_secret_encrypted` should be encrypted at the application layer
 * (e.g. via Supabase Vault / a KMS envelope key) before being written to the
 * database in production. This reference implementation reads it directly.
 */
export async function verifyTotpCode(code: string): Promise<VerifyResult> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not signed in." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("totp_secret_encrypted, is_2fa_enabled")
    .eq("id", user.id)
    .single();

  if (!profile?.is_2fa_enabled || !profile.totp_secret_encrypted) {
    return { success: false, error: "2FA is not enabled on this account." };
  }

  const isValid = authenticator.verify({ token: code, secret: profile.totp_secret_encrypted });

  if (!isValid) {
    return { success: false, error: "Invalid or expired code." };
  }

  cookies().set("nautspace_2fa_verified", "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 8, // 8-hour executive session window
    path: "/",
  });

  return { success: true };
}
