"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { Opportunity, OpportunityStatus, OpportunityType } from "@/lib/types/database";

const TYPE_LABELS: Record<OpportunityType, string> = {
  internship: "Internship",
  competition: "Competition",
  job: "Job",
  scholarship: "Scholarship",
};

const opportunityTypeSchema = z.enum(["internship", "competition", "job", "scholarship"]);
const opportunityStatusSchema = z.enum(["draft", "published"]);

const optionalEmptyString = z.union([z.literal(""), z.string()]);

const opportunityFormSchema = z.object({
  title: z.string().min(2, "Title is required"),
  type: opportunityTypeSchema,
  description: optionalEmptyString.optional().transform((v) => (v === "" ? undefined : v)),
  organization: optionalEmptyString.optional().transform((v) => (v === "" ? undefined : v)),
  location: optionalEmptyString.optional().transform((v) => (v === "" ? undefined : v)),
  deadline: optionalEmptyString.optional().transform((v) => (v === "" ? undefined : v)),
  applicationLink: z.union([z.literal(""), z.string()]).optional().transform((v) => (v === "" ? undefined : v)),
  requirements: optionalEmptyString.optional().transform((v) => (v === "" ? undefined : v)),
  bannerUrl: z.union([z.literal(""), z.string()]).optional().transform((v) => (v === "" ? undefined : v)),
  status: opportunityStatusSchema,
  featured: z.boolean().default(false),
});

type OpportunityFormValues = z.infer<typeof opportunityFormSchema>;

export function OpportunityForm({ opportunity }: { opportunity?: Opportunity }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<OpportunityFormValues>({
    resolver: zodResolver(opportunityFormSchema),
    defaultValues: {
      title: opportunity?.title ?? "",
      type: (opportunity?.type ?? "internship") as OpportunityType,
      description: opportunity?.description ?? "",
      organization: opportunity?.organization ?? "",
      location: opportunity?.location ?? "",
      deadline: opportunity?.application_deadline ?? "",
      applicationLink: opportunity?.application_link ?? "",
      requirements: opportunity?.requirements ?? "",
      bannerUrl: opportunity?.banner_image_url ?? "",
      status: (opportunity?.status ?? "draft") as OpportunityStatus,
      featured: opportunity?.featured ?? false,
    },
  });

  const onSubmit = (values: OpportunityFormValues) => {
    setError(null);
    startTransition(async () => {
      const supabase = createClient();
      const payload = {
        title: values.title,
        type: values.type,
        description: values.description ?? null,
        organization: values.organization ?? null,
        location: values.location ?? null,
        application_deadline: values.deadline ?? null,
        application_link: values.applicationLink ?? null,
        requirements: values.requirements ?? null,
        banner_image_url: values.bannerUrl ?? null,
        status: values.status as OpportunityStatus,
        featured: values.featured,
      };

      const { error: writeError } = opportunity
        ? await supabase.from("opportunities").update(payload).eq("id", opportunity.id)
        : await supabase.from("opportunities").insert(payload);

      if (writeError) {
        setError(writeError.message);
        return;
      }

      reset();
      router.push("/admin/opportunities");
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

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="title">Title *</Label>
          <Input id="title" required placeholder="Opportunity title" {...register("title")} />
          {errors.title && (
            <p className="mt-1 text-xs text-red-400" role="status" aria-live="polite" aria-atomic="true">
              {errors.title.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="type">Type *</Label>
          <Select id="type" defaultValue={opportunity?.type ?? "internship"} {...register("type")}>
            {Object.entries(TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register("description")} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="organization">Organization</Label>
          <Input id="organization" {...register("organization")} />
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="e.g. Nairobi, Remote"
            {...register("location")}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="deadline">Application Deadline</Label>
          <Input id="deadline" type="date" {...register("deadline")} />
        </div>
        <div>
          <Label htmlFor="applicationLink">Application Link</Label>
          <Input
            id="applicationLink"
            placeholder="https://…"
            {...register("applicationLink")}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="requirements">Requirements</Label>
        <Textarea
          id="requirements"
          placeholder="List requirements or qualifications…"
          {...register("requirements")}
        />
      </div>

      <div>
        <Label htmlFor="bannerUrl">Banner Image URL (optional)</Label>
        <Input id="bannerUrl" placeholder="https://example.com/image.jpg" {...register("bannerUrl")} />
      </div>

      <div>
        <Label htmlFor="status">Status</Label>
        <Select id="status" defaultValue={opportunity?.status ?? "draft"} {...register("status")}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </Select>
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-300">
        <input
          type="checkbox"
          defaultChecked={opportunity?.featured ?? false}
          className="h-4 w-4 rounded border-slate-700 bg-slate-900"
          {...register("featured")}
        />
        Featured opportunity
      </label>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/opportunities")}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving…" : opportunity ? "Save Opportunity" : "Create Opportunity"}
        </Button>
      </div>
    </form>
  );
}
