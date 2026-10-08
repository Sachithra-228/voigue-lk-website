"use client";

import { useRef, useState } from "react";
import { CheckCircle2, FileText, UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { applicationSchema, cvLimits, setupOptions } from "@/lib/validations/forms";
import { clsx } from "@/lib/utils";

export type CvMode = { type: "role"; jobId: string; jobTitle: string } | { type: "general" };

type Props = {
  mode: CvMode;
  onClose: () => void;
};

const inputClass =
  "focus-ring w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-muted/70 transition focus:border-brand-violet";

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5 text-sm font-semibold text-ink">
      {label}
      {children}
      {error ? (
        <span className="text-xs font-normal text-red-700" role="alert">
          {error}
        </span>
      ) : null}
    </label>
  );
}

function cvProblem(file: File | null) {
  if (!file) return "Please attach your CV";
  const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
  if (!cvLimits.extensions.includes(extension)) return "Please upload a PDF, DOC or DOCX file";
  if (file.size > cvLimits.maxBytes) return "Your CV is larger than 4 MB";
  return undefined;
}

/** Listed-role application and general CV submission, shown as a modal over the Careers page. */
export function CvModal({ mode, onClose }: Props) {
  const general = mode.type === "general";
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement | null>(null);

  function chooseFile(next: File | null) {
    setFile(next);
    setErrors((current) => ({ ...current, cv: "" }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerError(null);
    const form = new FormData(event.currentTarget);

    const payload: Record<string, string> = {
      type: mode.type,
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      message: String(form.get("message") ?? "")
    };
    if (mode.type === "role") {
      payload.jobId = mode.jobId;
      payload.jobTitle = mode.jobTitle;
    } else {
      payload.roleInterest = String(form.get("roleInterest") ?? "");
      payload.preferredSetup = String(form.get("preferredSetup") ?? "");
    }

    const found: Record<string, string> = {};
    const parsed = applicationSchema.safeParse(payload);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) found[String(issue.path[0])] ??= issue.message;
    }
    const cvError = cvProblem(file);
    if (cvError) found.cv = cvError;
    setErrors(found);
    if (Object.keys(found).length || !file) return;

    const body = new FormData();
    for (const [key, value] of Object.entries(payload)) body.set(key, value);
    body.set("cv", file);
    body.set("website", String(form.get("website") ?? ""));

    setSubmitting(true);
    try {
      const response = await fetch("/api/applications", { method: "POST", body });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setServerError(data?.error ?? "Something went wrong. Please try again or email careers@voigue.com.");
        return;
      }
      setDone(true);
    } catch {
      setServerError("We couldn't reach the server. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <Modal open onClose={onClose} title="Thanks, we've got your CV." hideHeader>
        <div className="py-4 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-lilac text-brand-violet">
            <CheckCircle2 size={28} />
          </span>
          <h3 className="mt-5 text-2xl font-semibold text-ink">Thanks, we&apos;ve got your CV.</h3>
          <p className="mx-auto mt-3 max-w-sm leading-7 text-muted">
            {general
              ? "Your CV has been received. If a role feels like the right fit, our team will be in touch."
              : "Your application has been received. A TA agent will be in touch with you soon if you're shortlisted."}
          </p>
          <div className="mt-8 grid justify-center gap-3">
            <Button variant="dark" arrow={false} onClick={onClose}>
              Back to Careers
            </Button>
            <button type="button" onClick={onClose} className="focus-ring text-sm font-medium text-muted underline-offset-4 hover:text-ink hover:underline">
              Close
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={general ? "Send us your CV" : "Apply for this role"}
      description={
        general
          ? "Tell us a bit about yourself and the kind of role you're looking for."
          : "Tell us a bit about yourself and why you'd be a great fit."
      }
    >
      <form onSubmit={onSubmit} noValidate className="grid gap-5">
        {mode.type === "role" ? (
          <p className="-mt-2 rounded-xl bg-lilac px-4 py-2.5 text-sm font-medium text-brand-violet">{mode.jobTitle}</p>
        ) : null}

        <Field label="Full name" error={errors.name}>
          <input name="name" autoComplete="name" placeholder="Your full name" className={inputClass} />
        </Field>
        <Field label="Email address" error={errors.email}>
          <input name="email" type="email" autoComplete="email" placeholder="you@example.com" className={inputClass} />
        </Field>

        {general ? (
          <>
            <Field label="Type of role / interests" error={errors.roleInterest}>
              <input name="roleInterest" placeholder="e.g. Graphic design, customer success, software" className={inputClass} />
            </Field>
            <fieldset className="grid gap-2">
              <legend className="text-sm font-semibold text-ink">Preferred setup</legend>
              <div className="flex flex-wrap gap-2">
                {setupOptions.map((option) => (
                  <label key={option} className="cursor-pointer">
                    <input type="radio" name="preferredSetup" value={option} className="peer sr-only" />
                    <span className="inline-flex min-h-10 items-center rounded-full border border-line px-5 text-sm font-medium text-ink transition peer-checked:border-brand-violet peer-checked:bg-brand-violet peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-teal">
                      {option}
                    </span>
                  </label>
                ))}
              </div>
              {errors.preferredSetup ? (
                <span className="text-xs text-red-700" role="alert">
                  {errors.preferredSetup}
                </span>
              ) : null}
            </fieldset>
          </>
        ) : null}

        <Field
          label={
            general
              ? "Anything else you'd like us to know? (optional)"
              : "Tell us a bit about yourself and how your skills and mindset can add to our culture"
          }
          error={errors.message}
        >
          <textarea name="message" rows={4} placeholder="Write your message here..." className={clsx(inputClass, "resize-y")} />
        </Field>

        <div className="grid gap-1.5">
          <span className="text-sm font-semibold text-ink">Upload your CV</span>
          <input
            ref={fileInput}
            type="file"
            name="cvFile"
            accept={cvLimits.extensions.join(",")}
            className="sr-only"
            tabIndex={-1}
            onChange={(event) => chooseFile(event.target.files?.[0] ?? null)}
          />
          {file ? (
            <div className="flex items-center gap-3 rounded-xl border border-line bg-paper px-4 py-3 text-sm">
              <FileText size={20} className="shrink-0 text-brand-violet" />
              <span className="min-w-0 flex-1 truncate font-medium text-ink">{file.name}</span>
              <button
                type="button"
                aria-label="Remove file"
                onClick={() => {
                  chooseFile(null);
                  if (fileInput.current) fileInput.current.value = "";
                }}
                className="focus-ring rounded-full p-1 text-muted hover:bg-white hover:text-ink"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              onDragOver={(event) => {
                event.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(event) => {
                event.preventDefault();
                setDragging(false);
                chooseFile(event.dataTransfer.files?.[0] ?? null);
              }}
              className={clsx(
                "focus-ring flex flex-col items-center gap-1 rounded-xl border border-dashed px-4 py-6 text-center text-sm transition",
                dragging ? "border-brand-violet bg-lilac" : "border-line hover:border-brand-violet hover:bg-lilac/50"
              )}
            >
              <UploadCloud size={22} className="text-brand-violet" />
              <span className="font-semibold text-ink">
                Choose a file <span className="font-normal text-muted">or drag and drop</span>
              </span>
              <span className="text-xs text-muted">PDF, DOC or DOCX (max 4 MB)</span>
            </button>
          )}
          {errors.cv ? (
            <span className="text-xs text-red-700" role="alert">
              {errors.cv}
            </span>
          ) : null}
        </div>

        {/* Honeypot: hidden from people, tempting for bots. */}
        <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>
            Website
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        {serverError ? (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
            {serverError}
          </p>
        ) : null}

        <Button type="submit" variant="dark" arrow={false} className="w-full" disabled={submitting}>
          {submitting ? "Sending..." : general ? "Submit CV" : "Submit application"}
        </Button>
      </form>
    </Modal>
  );
}
