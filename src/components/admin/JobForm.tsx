"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { jobSchema, setupOptions } from "@/lib/validations/forms";

export type JobFormValues = {
  _id?: string;
  title: string;
  slug: string;
  summary?: string;
  workSetup?: string;
  department?: string;
  location?: string;
  employmentType?: string;
  description?: string;
  responsibilities?: string[];
  requirements?: string[];
  status?: string;
  featured?: boolean;
};

const field = "focus-ring w-full rounded-xl border border-line bg-white px-4 py-3 text-sm";
const label = "grid gap-1.5 text-sm font-semibold text-ink";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const toLines = (value: FormDataEntryValue | null) =>
  String(value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

export function JobForm({ job }: { job?: JobFormValues }) {
  const router = useRouter();
  const [slug, setSlug] = useState(job?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(Boolean(job));
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const form = new FormData(event.currentTarget);
    const parsed = jobSchema.safeParse({
      title: form.get("title"),
      slug: form.get("slug"),
      summary: form.get("summary"),
      workSetup: form.get("workSetup"),
      department: form.get("department"),
      location: form.get("location"),
      employmentType: form.get("employmentType"),
      description: form.get("description"),
      responsibilities: toLines(form.get("responsibilities")),
      requirements: toLines(form.get("requirements")),
      status: form.get("status"),
      featured: form.get("featured") === "on"
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }

    setSaving(true);
    const response = await fetch(job?._id ? `/api/jobs/${job._id}` : "/api/jobs", {
      method: job?._id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data)
    }).catch(() => null);
    setSaving(false);

    if (!response?.ok) {
      const data = await response?.json().catch(() => null);
      setError(data?.error ?? "Could not save the job");
      return;
    }
    router.push("/admin/jobs");
    router.refresh();
  }

  async function onDelete() {
    if (!job?._id || !window.confirm(`Delete "${job.title}"? This cannot be undone.`)) return;
    const response = await fetch(`/api/jobs/${job._id}`, { method: "DELETE" }).catch(() => null);
    if (!response?.ok) {
      setError("Could not delete the job");
      return;
    }
    router.push("/admin/jobs");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 grid max-w-3xl gap-5 rounded-2xl border border-line bg-white p-6 sm:p-8">
      <label className={label}>
        Job title
        <input
          name="title"
          defaultValue={job?.title}
          className={field}
          onChange={(event) => {
            if (!slugEdited) setSlug(slugify(event.target.value));
          }}
        />
      </label>
      <label className={label}>
        Slug
        <input
          name="slug"
          value={slug}
          onChange={(event) => {
            setSlug(event.target.value);
            setSlugEdited(true);
          }}
          className={field}
        />
      </label>
      <label className={label}>
        Short summary (shown on the listing)
        <input name="summary" defaultValue={job?.summary} maxLength={300} className={field} />
      </label>
      <div className="grid gap-5 sm:grid-cols-3">
        <label className={label}>
          Work setup
          <select name="workSetup" defaultValue={job?.workSetup ?? "Remote"} className={field}>
            {setupOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <label className={label}>
          Status
          <select name="status" defaultValue={job?.status ?? "Draft"} className={field}>
            <option>Draft</option>
            <option>Active</option>
            <option>Closed</option>
          </select>
        </label>
        <label className={label}>
          Employment type
          <input name="employmentType" defaultValue={job?.employmentType ?? "Full-time"} className={field} />
        </label>
        <label className={label}>
          Department
          <input name="department" defaultValue={job?.department} className={field} />
        </label>
        <label className={label}>
          Location
          <input name="location" defaultValue={job?.location} className={field} />
        </label>
        <label className="flex items-end gap-3 pb-3 text-sm font-semibold text-ink">
          <input type="checkbox" name="featured" defaultChecked={job?.featured} className="h-5 w-5 accent-brand-violet" />
          Show first
        </label>
      </div>
      <label className={label}>
        Full description
        <textarea name="description" defaultValue={job?.description} rows={5} className={field} />
      </label>
      <label className={label}>
        Key responsibilities (one per line)
        <textarea name="responsibilities" defaultValue={job?.responsibilities?.join("\n")} rows={5} className={field} />
      </label>
      <label className={label}>
        What we&apos;re looking for (one per line)
        <textarea name="requirements" defaultValue={job?.requirements?.join("\n")} rows={5} className={field} />
      </label>

      {error ? (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <button disabled={saving} className="focus-ring rounded-full bg-brand-violet px-6 py-3 text-sm font-semibold text-white hover:bg-brand-blue disabled:opacity-60">
          {saving ? "Saving..." : "Save job"}
        </button>
        {job?._id ? (
          <button type="button" onClick={onDelete} className="focus-ring rounded-full border border-red-200 px-5 py-3 text-sm font-semibold text-red-700 hover:bg-red-50">
            Delete job
          </button>
        ) : null}
      </div>
    </form>
  );
}
