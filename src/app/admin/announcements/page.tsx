"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const AUDIENCES: { value: string; label: string }[] = [
  { value: "all", label: "All Members" },
  { value: "student", label: "Students" },
  { value: "researcher", label: "Researchers" },
  { value: "partner", label: "Partners" },
  { value: "government", label: "Government (panel)" },
  { value: "executive", label: "Executive (panel)" },
];

const audienceSchema = z.enum(["all", "student", "researcher", "partner", "government", "executive"]);

const announcementSchema = z.object({
  audience: audienceSchema.default("all"),
  subject: z.string().min(2, "Subject is required"),
  body: z.string().min(10, "Message is too short"),
});

export default function AnnouncementsPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof announcementSchema>>({
    resolver: zodResolver(announcementSchema),
    defaultValues: { audience: "all", subject: "", body: "" },
  });

  const onSubmit = (values: z.infer<typeof announcementSchema>) => {
    setMessage(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/broadcast", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subject: values.subject, body: values.body, audience: values.audience }),
        });
        const data = await res.json();
        setMessage(data.message);
        if (res.ok) {
          reset();
        }
      } catch {
        setMessage("Something went wrong sending the announcement.");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-50">Announcements</h1>
        <p className="mt-1 text-sm text-slate-500">
          Send a branded email to all members or a specific role/panel.
        </p>
      </div>

      <Card className="max-w-2xl border-slate-800 bg-black/30">
        <CardHeader>
          <CardTitle>Compose</CardTitle>
          <CardDescription>Uses the standard NautSpace International email template.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {message && (
              <p
                className="rounded-md border border-slate-700 bg-slate-900/60 p-3 text-sm text-slate-300"
                role="status"
                aria-live="polite"
                aria-atomic="true"
              >
                {message}
              </p>
            )}
            <div>
              <Label htmlFor="audience">Audience</Label>
              <Select id="audience" defaultValue="all" {...register("audience")}>
                {AUDIENCES.map((a) => (
                  <option key={a.value} value={a.value}>
                    {a.label}
                  </option>
                ))}
              </Select>
              {errors.audience && (
                <p className="mt-1 text-xs text-red-400" role="status" aria-live="polite" aria-atomic="true">
                  {errors.audience.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" required {...register("subject")} />
              {errors.subject && (
                <p className="mt-1 text-xs text-red-400" role="status" aria-live="polite" aria-atomic="true">
                  {errors.subject.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="body">Message</Label>
              <Textarea
                id="body"
                required
                rows={8}
                placeholder="Write your announcement separate paragraphs with a blank line."
                {...register("body")}
              />
              {errors.body && (
                <p className="mt-1 text-xs text-red-400" role="status" aria-live="polite" aria-atomic="true">
                  {errors.body.message}
                </p>
              )}
            </div>
            <Button type="submit" disabled={isPending} className="gap-1.5">
              {isPending ? "Sending…" : "Send Announcement"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
