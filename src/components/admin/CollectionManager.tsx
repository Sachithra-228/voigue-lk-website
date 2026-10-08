"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ImageIcon } from "lucide-react";
import type { ZodTypeAny } from "zod";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { Modal } from "@/components/ui/Modal";
import { momentCategoryOptions, momentSchema, postSchema, voiceSchema } from "@/lib/validations/forms";

type Item = { _id: string } & Record<string, unknown>;
type Kind = "voices" | "moments" | "posts";

type Field =
  | { name: string; label: string; type: "text" | "textarea" | "number"; rows?: number; hint?: string }
  | { name: string; label: string; type: "select"; options: readonly string[] }
  | { name: string; label: string; type: "image"; shape?: "portrait" | "landscape" }
  | { name: string; label: string; type: "checkbox" };

type Config = {
  endpoint: string;
  noun: string;
  schema: ZodTypeAny;
  fields: Field[];
  title: (item: Item) => string;
  subtitle: (item: Item) => string;
  image: (item: Item) => string;
  onLabel: string;
  offLabel: string;
  emptyText: string;
};

const text = (value: unknown) => (typeof value === "string" ? value : "");

const configs: Record<Kind, Config> = {
  voices: {
    endpoint: "/api/voices",
    noun: "employee voice",
    schema: voiceSchema,
    fields: [
      { name: "name", label: "Name", type: "text" },
      { name: "role", label: "Role", type: "text" },
      { name: "quote", label: "Testimonial (shown in quotation marks)", type: "textarea", rows: 4 },
      { name: "image", label: "Portrait photo", type: "image", shape: "portrait" },
      { name: "order", label: "Order (lowest first)", type: "number" },
      { name: "published", label: "Show on the Life at Voigue page", type: "checkbox" }
    ],
    title: (item) => text(item.name),
    subtitle: (item) => text(item.role),
    image: (item) => text(item.image),
    onLabel: "Live",
    offLabel: "Hidden",
    emptyText: "No employee voices yet. The Employee Voices section stays hidden on the site until you add one."
  },
  moments: {
    endpoint: "/api/moments",
    noun: "gallery photo",
    schema: momentSchema,
    fields: [
      { name: "title", label: "Title", type: "text" },
      { name: "category", label: "Category", type: "select", options: momentCategoryOptions },
      { name: "image", label: "Photo", type: "image" },
      { name: "order", label: "Order (lowest first)", type: "number" },
      { name: "published", label: "Show in the gallery", type: "checkbox" }
    ],
    title: (item) => text(item.title),
    subtitle: (item) => text(item.category),
    image: (item) => text(item.image),
    onLabel: "Live",
    offLabel: "Hidden",
    emptyText: "No gallery photos yet. The Life around here section stays hidden on the site until you add one."
  },
  posts: {
    endpoint: "/api/posts",
    noun: "blog post",
    schema: postSchema,
    fields: [
      { name: "title", label: "Title", type: "text" },
      { name: "slug", label: "Web address (slug)", type: "text", hint: "Leave empty to create it from the title." },
      { name: "category", label: "Category", type: "text" },
      { name: "author", label: "Author", type: "text" },
      { name: "excerpt", label: "Short summary", type: "textarea", rows: 3 },
      { name: "content", label: "Article text (leave a blank line between paragraphs)", type: "textarea", rows: 12 },
      { name: "coverImage", label: "Cover photo", type: "image" },
      { name: "published", label: "Published", type: "checkbox" }
    ],
    title: (item) => text(item.title),
    subtitle: (item) => text(item.category),
    image: (item) => text(item.coverImage),
    onLabel: "Published",
    offLabel: "Draft",
    emptyText: "No posts saved yet. The blog currently shows two placeholder articles."
  }
};

const input = "focus-ring w-full rounded-xl border border-line bg-white px-4 py-3 text-sm";
const label = "grid gap-1.5 text-sm font-semibold text-ink";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export function CollectionManager({ kind, items }: { kind: Kind; items: Item[] }) {
  const config = configs[kind];
  const router = useRouter();
  const [editing, setEditing] = useState<Item | "new" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const current = editing && editing !== "new" ? editing : null;
  const close = () => {
    setEditing(null);
    setError(null);
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const form = new FormData(event.currentTarget);

    const payload: Record<string, unknown> = {};
    for (const field of config.fields) {
      const value = form.get(field.name);
      if (field.type === "checkbox") payload[field.name] = value === "on";
      else if (field.type === "number") payload[field.name] = value === "" || value === null ? undefined : Number(value);
      else payload[field.name] = String(value ?? "");
    }
    if (kind === "posts" && !payload.slug) payload.slug = slugify(String(payload.title ?? ""));

    const parsed = config.schema.safeParse(payload);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }

    setSaving(true);
    const response = await fetch(current ? `${config.endpoint}/${current._id}` : config.endpoint, {
      method: current ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data)
    }).catch(() => null);
    setSaving(false);

    if (!response?.ok) {
      const data = await response?.json().catch(() => null);
      setError(data?.error ?? `Could not save the ${config.noun}`);
      return;
    }
    close();
    router.refresh();
  }

  async function onDelete() {
    if (!current || !window.confirm(`Delete this ${config.noun}? This cannot be undone.`)) return;
    const response = await fetch(`${config.endpoint}/${current._id}`, { method: "DELETE" }).catch(() => null);
    if (!response?.ok) {
      setError(`Could not delete the ${config.noun}`);
      return;
    }
    close();
    router.refresh();
  }

  return (
    <>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setEditing("new")}
          className="focus-ring rounded-full bg-brand-violet px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-blue"
        >
          Add {config.noun}
        </button>
      </div>

      {items.length ? (
        <ul className="mt-6 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
          {items.map((item) => {
            const image = config.image(item);
            const live = item.published === true;
            return (
              <li key={item._id}>
                <button
                  type="button"
                  onClick={() => setEditing(item)}
                  className="focus-ring flex w-full items-center gap-4 px-5 py-3 text-left transition hover:bg-paper"
                >
                  <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-lilac text-brand-violet/60">
                    {image ? <Image src={image} alt="" fill unoptimized className="object-cover" /> : <ImageIcon size={20} />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold text-ink">{config.title(item)}</span>
                    <span className="block truncate text-sm text-muted">{config.subtitle(item)}</span>
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${live ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}
                  >
                    {live ? config.onLabel : config.offLabel}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-6 rounded-2xl bg-white p-8 text-center text-muted">{config.emptyText}</p>
      )}

      {editing ? (
        <Modal open onClose={close} title={current ? `Edit ${config.noun}` : `Add ${config.noun}`}>
          <form key={current?._id ?? "new"} onSubmit={onSubmit} className="grid gap-5">
            {config.fields.map((field) => {
              const value = current?.[field.name];
              if (field.type === "checkbox") {
                return (
                  <label key={field.name} className="flex items-center gap-3 text-sm font-semibold text-ink">
                    <input
                      type="checkbox"
                      name={field.name}
                      defaultChecked={current ? value === true : true}
                      className="h-5 w-5 accent-brand-violet"
                    />
                    {field.label}
                  </label>
                );
              }
              if (field.type === "image") {
                return (
                  <div key={field.name} className="grid gap-2">
                    <span className="text-sm font-semibold text-ink">{field.label}</span>
                    <ImageUploadField name={field.name} kind={kind} defaultValue={text(value)} shape={field.shape} />
                  </div>
                );
              }
              return (
                <label key={field.name} className={label}>
                  {field.label}
                  {field.type === "textarea" ? (
                    <textarea name={field.name} defaultValue={text(value)} rows={field.rows ?? 4} className={input} />
                  ) : field.type === "select" ? (
                    <select name={field.name} defaultValue={text(value) || field.options[0]} className={input}>
                      {field.options.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      name={field.name}
                      type={field.type === "number" ? "number" : "text"}
                      defaultValue={typeof value === "number" || typeof value === "string" ? String(value) : field.type === "number" ? "0" : ""}
                      min={field.type === "number" ? 0 : undefined}
                      className={input}
                    />
                  )}
                  {"hint" in field && field.hint ? <span className="text-xs font-normal text-muted">{field.hint}</span> : null}
                </label>
              );
            })}

            {error ? (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
                {error}
              </p>
            ) : null}

            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                disabled={saving}
                className="focus-ring rounded-full bg-brand-violet px-6 py-3 text-sm font-semibold text-white hover:bg-brand-blue disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save"}
              </button>
              {current ? (
                <button
                  type="button"
                  onClick={onDelete}
                  className="focus-ring rounded-full border border-red-200 px-5 py-3 text-sm font-semibold text-red-700 hover:bg-red-50"
                >
                  Delete
                </button>
              ) : null}
            </div>
          </form>
        </Modal>
      ) : null}
    </>
  );
}
