"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { useProfile } from "@/hooks/useProfile";

export function ProfileMenu({ userId }: { userId: string }) {
  const { profile, loading, refresh } = useProfile(userId);
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFirstName(profile?.full_name ?? "");
  }, [profile?.full_name]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const supabase = createClient();
      let avatarUrl = profile?.avatar_url ?? null;

      if (file) {
        const path = `${userId}/${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(path, file, { upsert: true });
        if (!uploadError) {
          avatarUrl = supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl;
        }
      }

      await supabase
        .from("profiles")
        .update({ full_name: firstName.trim() || null, avatar_url: avatarUrl })
        .eq("id", userId);

      await refresh();
      setFile(null);
      setOpen(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Your profile"
        className="flex items-center gap-2 rounded-md border border-slate-700 bg-slate-900/60 px-2.5 py-1.5 text-sm text-slate-200 transition-colors hover:border-cyan/50"
      >
        {profile?.avatar_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={profile.avatar_url} alt="" className="h-5 w-5 rounded-full object-cover" />
        )}
        {!loading && profile?.full_name ? (
          <span className="max-w-[96px] truncate">{profile.full_name}</span>
        ) : (
          <span>Profile</span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-md border border-slate-700 bg-slate-950 p-4 shadow-xl">
          <p className="mb-3 text-sm font-semibold text-slate-100">Edit Profile</p>
          <div className="mb-3">
            <Label htmlFor="profileFirstName">First Name</Label>
            <Input
              id="profileFirstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Your first name"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="profileAvatar">Photo</Label>
            <Input
              id="profileAvatar"
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </div>
          <Button size="sm" className="w-full" onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </div>
      )}
    </div>
  );
}
