"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { EventStatus, OsaiEvent } from "@/lib/types/database";

const LOCATION_PRESETS = [
  "Nairobi, Kenya",
  "Malindi, Kenya",
  "Cape Town, South Africa",
  "Pretoria, South Africa",
];

const CATEGORY_PRESETS = ["Workshop", "Field Trip", "Stargazing", "Conference", "Launch Viewing", "Social"];

function toDatetimeLocal(iso: string | null | undefined) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const eventStatusSchema = z.enum(["draft", "published", "cancelled", "completed"]);

const eventFormSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().optional().or(z.literal("")).transform((v) => (v === "" ? undefined : v)),
  startAt: z.string().min(1, "Select a start date/time"),
  endAt: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v === "" ? undefined : v)),
  location: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v === "" ? undefined : v)),
  category: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v === "" ? undefined : v)),
  status: eventStatusSchema,
  featured: z.boolean().default(false),
  bannerUrl: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v === "" ? undefined : v)),
  // react-hook-form returns a FileList for file inputs; we’ll handle it in onSubmit.
  bannerFile: z.any().optional(),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

export function EventForm({ event }: { event?: OsaiEvent }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: event?.title ?? "",
      description: event?.description ?? "",
      location: event?.location ?? "",
      startAt: toDatetimeLocal(event?.start_at),
      endAt: toDatetimeLocal(event?.end_at),
      category: event?.category ?? "",
      bannerUrl: event?.banner_image_url ?? "",
      status: (event?.status ?? "draft") as EventStatus,
      featured: event?.featured ?? false,
      bannerFile: undefined,
    },
  });

  const onSubmit = (values: EventFormValues) => {
    setError(null);
    startTransition(async () => {
      const supabase = createClient();

      const bannerFileList = values.bannerFile as FileList | undefined;
      const bannerFile = bannerFileList?.length ? bannerFileList[0] : null;

      let finalBannerUrl = values.bannerUrl ?? null;
      if (bannerFile) {
        const path = `${Date.now()}-${bannerFile.name}`;
        const { error: uploadError } = await supabase.storage.from("event-banners").upload(path, bannerFile);
        if (uploadError) {
          setError(uploadError.message);
          return;
        }
        finalBannerUrl = supabase.storage.from("event-banners").getPublicUrl(path).data.publicUrl;
      }

      const payload = {
        title: values.title,
        description: values.description ?? null,
        location: values.location ?? null,
        start_at: new Date(values.startAt).toISOString(),
        end_at: values.endAt ? new Date(values.endAt).toISOString() : null,
        category: values.category ?? null,
        banner_image_url: finalBannerUrl,
        status: values.status as EventStatus,
        featured: values.featured,
      };

      const { error: writeError } = event
        ? await supabase.from("events").update(payload).eq("id", event.id)
        : await supabase.from("events").insert(payload);

      if (writeError) {
        setError(writeError.message);
        return;
      }

      reset();
      router.push("/admin/events");
      router.refresh();
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="glass-panel max-w-2xl space-y-5 p-6">
      {error && (
        <p
          className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {error}
        </p>
      )}

      <div>
        <Label htmlFor="title">Title *</Label>
        <Input id="title" required placeholder="Event title" {...register("title")} />
        {errors.title && (
          <p className="mt-1 text-xs text-red-400" role="status" aria-live="polite" aria-atomic="true">
            {errors.title.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register("description")} />
        {errors.description && (
          <p className="mt-1 text-xs text-red-400" role="status" aria-live="polite" aria-atomic="true">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="startAt">Start Date &amp; Time *</Label>
          <Input
            id="startAt"
            type="datetime-local"
            required
            {...register("startAt")}
          />
          {errors.startAt && (
            <p className="mt-1 text-xs text-red-400" role="status" aria-live="polite" aria-atomic="true">
              {errors.startAt.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="endAt">End Date &amp; Time</Label>
          <Input id="endAt" type="datetime-local" {...register("endAt")} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            list="location-presets"
            placeholder="e.g. Nairobi, Kenya"
            {...register("location")}
          />
          <datalist id="location-presets">
            {LOCATION_PRESETS.map((loc) => (
              <option key={loc} value={loc} />
            ))}
          </datalist>
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            list="category-presets"
            {...register("category")}
          />
          <datalist id="category-presets">
            {CATEGORY_PRESETS.map((cat) => (
              <option key={cat} value={cat} />
            ))}
          </datalist>
        </div>
      </div>

      <div>
        <Label htmlFor="status">Status</Label>
        <Select id="status" defaultValue={event?.status ?? "draft"} {...register("status")}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </Select>
        {errors.status && (
          <p className="mt-1 text-xs text-red-400" role="status" aria-live="polite" aria-atomic="true">
            {errors.status.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="bannerFile">Event Banner (file)</Label>
        <Input
          id="bannerFile"
          type="file"
          accept="image/*"
          {...register("bannerFile")}
        />
      </div>

      <div>
        <Label htmlFor="bannerUrl">Or Image URL</Label>
        <Input
          id="bannerUrl"
          placeholder="https://example.com/image.jpg"
          {...register("bannerUrl")}
        />
        <p className="mt-1 text-xs text-slate-500">An uploaded file takes priority if both are provided.</p>
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-300">
        <input
          type="checkbox"
          defaultChecked={event?.featured ?? false}
          className="h-4 w-4 rounded border-slate-700 bg-slate-900"
          {...register("featured")}
        />
        Featured event
      </label>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/events")}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving…" : event ? "Save Event" : "Create Event"}
        </Button>
      </div>
    </form>
  );
}
