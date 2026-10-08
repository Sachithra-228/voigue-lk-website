"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImageIcon, Trash2, UploadCloud } from "lucide-react";

type Props = {
  name: string;
  kind: "voices" | "moments" | "posts";
  defaultValue?: string;
  shape?: "portrait" | "landscape";
};

/** Photo picker for admin forms: uploads to the private Blob store and keeps the result in a hidden input. */
export function ImageUploadField({ name, kind, defaultValue = "", shape = "landscape" }: Props) {
  const [src, setSrc] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const input = useRef<HTMLInputElement | null>(null);

  async function upload(file: File | undefined) {
    if (!file) return;
    setError(null);
    setUploading(true);
    const body = new FormData();
    body.set("file", file);
    body.set("kind", kind);
    try {
      const response = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error ?? "Upload failed");
      setSrc(data.src);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Upload failed");
    } finally {
      setUploading(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div className="grid gap-3">
      <input type="hidden" name={name} value={src} />
      <div className="flex items-center gap-4">
        <div
          className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-lilac text-brand-violet/60 ${
            shape === "portrait" ? "h-28 w-24" : "h-24 w-36"
          }`}
        >
          {src ? <Image src={src} alt="" fill unoptimized className="object-cover" /> : <ImageIcon size={28} />}
        </div>
        <div className="grid gap-2">
          <input
            ref={input}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            tabIndex={-1}
            onChange={(event) => upload(event.target.files?.[0])}
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => input.current?.click()}
            className="focus-ring inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold hover:bg-paper disabled:opacity-60"
          >
            <UploadCloud size={16} /> {uploading ? "Uploading..." : src ? "Replace photo" : "Upload photo"}
          </button>
          {src ? (
            <button type="button" onClick={() => setSrc("")} className="focus-ring inline-flex items-center gap-2 text-sm text-muted hover:text-red-700">
              <Trash2 size={14} /> Remove photo
            </button>
          ) : null}
          <p className="text-xs text-muted">JPG, PNG or WebP, up to 4 MB.</p>
        </div>
      </div>
      {error ? (
        <p className="text-xs text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
