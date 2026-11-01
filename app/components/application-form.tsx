"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  createApplication,
  type ApplicationFormState,
} from "../lib/actions";
import { APPLICATION_STATUSES } from "../lib/definitions";
import { APPLICATION_LIMITS } from "../lib/validation";

const initialState: ApplicationFormState = {};

export default function ApplicationForm() {
  const [state, formAction, pending] = useActionState(
    createApplication,
    initialState
  );

  const inputClassName =
    "w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100";

  const errorClassName = "text-sm text-red-600 dark:text-red-400";

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="company" className="block font-medium">
          Company
        </label>

        <input
          id="company"
          name="company"
          type="text"
          required
          maxLength={APPLICATION_LIMITS.company}
          defaultValue={state.values?.company ?? ""}
          aria-invalid={Boolean(state.errors?.company)}
          aria-describedby={
            state.errors?.company ? "company-error" : undefined
          }
          className={inputClassName}
        />

        {state.errors?.company && (
          <p id="company-error" className={errorClassName}>
            {state.errors.company}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="position" className="block font-medium">
          Position
        </label>

        <input
          id="position"
          name="position"
          type="text"
          required
          maxLength={APPLICATION_LIMITS.position}
          defaultValue={state.values?.position ?? ""}
          aria-invalid={Boolean(state.errors?.position)}
          aria-describedby={
            state.errors?.position ? "position-error" : undefined
          }
          className={inputClassName}
        />

        {state.errors?.position && (
          <p id="position-error" className={errorClassName}>
            {state.errors.position}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="status" className="block font-medium">
          Status
        </label>

        <select
          id="status"
          name="status"
          required
          defaultValue={state.values?.status ?? "Applied"}
          aria-invalid={Boolean(state.errors?.status)}
          aria-describedby={
            state.errors?.status ? "status-error" : undefined
          }
          className={inputClassName}
        >
          {APPLICATION_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        {state.errors?.status && (
          <p id="status-error" className={errorClassName}>
            {state.errors.status}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="dateApplied" className="block font-medium">
          Date applied
        </label>

        <input
          id="dateApplied"
          name="dateApplied"
          type="date"
          required
          defaultValue={state.values?.dateApplied ?? ""}
          aria-invalid={Boolean(state.errors?.dateApplied)}
          aria-describedby={
            state.errors?.dateApplied ? "date-applied-error" : undefined
          }
          className={inputClassName}
        />

        {state.errors?.dateApplied && (
          <p id="date-applied-error" className={errorClassName}>
            {state.errors.dateApplied}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="notes" className="block font-medium">
          Notes (optional)
        </label>

        <textarea
          id="notes"
          name="notes"
          rows={5}
          maxLength={APPLICATION_LIMITS.notes}
          defaultValue={state.values?.notes ?? ""}
          aria-invalid={Boolean(state.errors?.notes)}
          aria-describedby={
            state.errors?.notes ? "notes-error" : undefined
          }
          className={inputClassName}
        />

        {state.errors?.notes && (
          <p id="notes-error" className={errorClassName}>
            {state.errors.notes}
          </p>
        )}
      </div>

      <p aria-live="polite" className={errorClassName}>
        {state.message}
      </p>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-blue-700 px-4 py-2 font-medium text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Saving..." : "Save application"}
        </button>

        <Link href="/applications" className="underline">
          Cancel
        </Link>
      </div>
    </form>
  );
}