"use client";

import { useState } from "react";
import { applicationStatuses } from "@/lib/validations/forms";

export function ApplicationStatus({ id, status }: { id: string; status: string }) {
  const [value, setValue] = useState(status);
  const [failed, setFailed] = useState(false);

  async function change(next: string) {
    const previous = value;
    setValue(next);
    setFailed(false);
    const response = await fetch(`/api/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next })
    }).catch(() => null);
    if (!response?.ok) {
      setValue(previous);
      setFailed(true);
    }
  }

  return (
    <span className="inline-flex items-center gap-2">
      <select
        aria-label="Application status"
        value={value}
        onChange={(event) => change(event.target.value)}
        className="focus-ring rounded-lg border border-line bg-white px-2 py-1.5 text-sm"
      >
        {applicationStatuses.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      {failed ? <span className="text-xs text-red-700">Not saved</span> : null}
    </span>
  );
}
