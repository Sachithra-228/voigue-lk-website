"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { ContactInput, contactSchema } from "@/lib/validations/forms";
import { Button } from "@/components/ui/Button";
import { site } from "@/lib/content";

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

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  async function onSubmit(data: ContactInput) {
    setServerError(null);
    try {
      const honeypot = (document.getElementById("contact-website") as HTMLInputElement | null)?.value ?? "";
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, website: honeypot })
      });
      if (!response.ok) throw new Error("failed");
      reset();
      setSent(true);
    } catch {
      setServerError(`We couldn't send your message. Please try again or email ${site.emails.general}.`);
    }
  }

  if (sent) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-line bg-white p-10 text-center shadow-soft">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-lilac text-brand-violet">
          <CheckCircle2 size={28} />
        </span>
        <h3 className="mt-5 text-2xl font-semibold text-ink">Thanks, your message is on its way.</h3>
        <p className="mt-3 max-w-sm leading-7 text-muted">We&apos;ve received your message and will get back to you shortly.</p>
        <Button variant="outline" arrow={false} className="mt-7" onClick={() => setSent(false)}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-5 rounded-2xl border border-line bg-white p-6 shadow-soft sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="First name" error={errors.firstName?.message}>
          <input autoComplete="given-name" className={inputClass} {...register("firstName")} />
        </Field>
        <Field label="Last name" error={errors.lastName?.message}>
          <input autoComplete="family-name" className={inputClass} {...register("lastName")} />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <input type="email" autoComplete="email" className={inputClass} {...register("email")} />
        </Field>
        <Field label="Phone number" error={errors.phone?.message}>
          <input type="tel" autoComplete="tel" className={inputClass} {...register("phone")} />
        </Field>
      </div>
      <Field label="How can we help?" error={errors.message?.message}>
        <textarea rows={5} className={`${inputClass} resize-y`} {...register("message")} />
      </Field>

      {/* Honeypot: hidden from people, tempting for bots. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input id="contact-website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {serverError ? (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          {serverError}
        </p>
      ) : null}
      <Button type="submit" variant="dark" arrow={false} className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Send message"}
      </Button>
    </form>
  );
}
