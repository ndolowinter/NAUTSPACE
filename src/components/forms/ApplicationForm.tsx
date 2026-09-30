"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import type { ApplicationTrack } from "@/lib/types/database";
import { APPLICATION_TRACK_LABELS } from "@/lib/applicationTracks";

const applicationSchema = z.object({
  track: z.custom<ApplicationTrack>((v) => typeof v === "string" && v in APPLICATION_TRACK_LABELS),
  coverNote: z.string().max(2000).optional(),
  resume: z
    .custom<FileList>()
    .refine((files) => files && files.length === 1, "Attach your resume")
    .refine((files) => {
      const file = files[0];
      return file !== undefined && file.size <= 8 * 1024 * 1024;
    }, "Resume must be under 8MB")
    .refine((files) => {
      const file = files[0];
      return file !== undefined && file.type === "application/pdf";
    }, "Resume must be a PDF"),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

export function ApplicationForm({
  tracks,
  trackFieldLabel = "Track",
  resumeLabel = "Resume (PDF, max 8MB)",
}: {
  tracks: ApplicationTrack[];
  trackFieldLabel?: string;
  resumeLabel?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error" | "signed-out">("idle");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ApplicationFormValues>({ resolver: zodResolver(applicationSchema) });

  const onSubmit = (values: ApplicationFormValues) => {
    startTransition(async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setStatus("signed-out");
          return;
        }

        const file = values.resume[0];
        if (!file) {
          setStatus("error");
          return;
        }
        const path = `${user.id}/${Date.now()}-${file.name}`;

        const { error: uploadError } = await supabase.storage
          .from("resumes")
          .upload(path, file, { contentType: "application/pdf" });

        if (uploadError) {
          setStatus("error");
          return;
        }

        // The "resumes" bucket is private store the object path, not a public
        // URL. Reviewers generate a short-lived signed URL on read via
        // supabase.storage.from("resumes").createSignedUrl(resume_url, expiresIn).
        const { error } = await supabase.from("applications").insert({
          applicant_id: user.id,
          track: values.track,
          cover_note: values.coverNote ?? null,
          resume_url: path,
        });

        if (error) {
          setStatus("error");
          return;
        }

        // Best-effort email notification to the careers inbox a 7-day
        // signed link since the bucket is private. Never blocks the
        // already-successful submission if this fails or isn't configured.
        try {
          const { data: signedUrlData } = await supabase.storage
            .from("resumes")
            .createSignedUrl(path, 60 * 60 * 24 * 7);

          await fetch("/api/notify-application", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              track: values.track,
              coverNote: values.coverNote,
              applicantEmail: user.email,
              resumeUrl: signedUrlData?.signedUrl ?? null,
            }),
          });
        } catch {
          // Notification is a nice-to-have the application itself already saved.
        }

        setStatus("success");
        reset();
      } catch {
        // createClient() throws synchronously if Supabase env vars aren't configured.
        setStatus("error");
      }
    });
  };

  if (status === "success") {
    return (
      <div className="glass-panel flex flex-col items-center gap-3 p-10 text-center">
        <p className="font-semibold text-slate-100">Application submitted</p>
        <p className="text-sm text-slate-400">
          Our team reviews submissions on a rolling basis. You&apos;ll hear from us via email.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="glass-panel space-y-5 p-6">
      {status === "signed-out" && (
        <p
          className="rounded-md border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-300"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          Create a student/researcher account first applications are linked to your NautSpace International profile.
        </p>
      )}
      {status === "error" && (
        <p
          className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          Something went wrong submitting your application. Please try again.
        </p>
      )}

      <div>
        <Label htmlFor="track">{trackFieldLabel}</Label>
        <Select id="track" {...register("track")}>
          <option value="">Select a track…</option>
          {tracks.map((value) => (
            <option key={value} value={value}>
              {APPLICATION_TRACK_LABELS[value]}
            </option>
          ))}
        </Select>
        {errors.track && (
          <p className="mt-1 text-xs text-red-400" role="status" aria-live="polite" aria-atomic="true">
            Select a track
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="resume">{resumeLabel}</Label>
        <div className="flex items-center gap-3">
          <Input id="resume" type="file" accept="application/pdf" {...register("resume")} />
        </div>
        {errors.resume && (
          <p className="mt-1 text-xs text-red-400" role="status" aria-live="polite" aria-atomic="true">
            {errors.resume.message as string}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="coverNote">Cover Note (optional)</Label>
        <Textarea
          id="coverNote"
          placeholder="Tell us why this track fits you…"
          {...register("coverNote")}
        />
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Submitting…" : "Submit Application"}
      </Button>
    </form>
  );
}
