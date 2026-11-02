"use client";

// Import the link component for the Cancel navigation.
import Link from "next/link";

// Import the hook used to track form results and submission progress.
import { useActionState } from "react";

// Import the create and update actions, plus their returned state type.
import {
  createApplication,
  updateApplication,
  type ApplicationFormState,
} from "../../lib/actions";

// Import the available statuses and the existing application type.
import {
  APPLICATION_STATUSES,
  type Application,
} from "../../lib/definitions";

// Import the maximum field lengths used by this form.
import { APPLICATION_LIMITS } from "../../lib/validation";

// Allow this form to receive an existing application when editing.
// The question mark means the application prop is optional.
type ApplicationFormProps = {
  application?: Application;
};

// Start without returned errors, messages, or submitted values.
const initialState: ApplicationFormState = {};

export default function ApplicationForm({
  application,
}: ApplicationFormProps) {
  // If an application was provided, prepare the update action with its ID.
  // Otherwise, use the action that creates a new application.
  // bind() prepares the function; it does not submit the form here.
  const action = application
    ? updateApplication.bind(null, application.id)
    : createApplication;

  // state: contains values, errors, or a message returned by the action.
  // formAction: connects the selected action to the form submission.
  // pending: indicates whether the submission is still running.
  const [state, formAction, pending] = useActionState(
    action,
    initialState
  );

  // Prefer submitted values returned after an error.
  // Otherwise, use the existing application to populate the edit form.
  const values = state.values ?? application;

  // Choose where the Cancel link goes:
  // editing -> the application's details page;
  // creating -> the application list.
  const cancelHref = application
    ? `/applications/${application.id}`
    : "/applications";

  // Reuse the same appearance for inputs, the select, and the textarea.
  const inputClassName =
    "w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100";

  // Reuse the same appearance for validation errors and form messages.
  const errorClassName = "text-sm text-red-600 dark:text-red-400";

  return (
    // Submit the form through the action selected above.
    <form action={formAction} className="space-y-6">
      {/* Company field and its validation error. */}
      <div className="space-y-2">
        <label htmlFor="company" className="block font-medium">
          Company
        </label>

        {/* Show the submitted company or the existing application's company. */}
        {/* Mark the field invalid and connect it to its error when present. */}
        <input
          id="company"
          name="company"
          type="text"
          required
          maxLength={APPLICATION_LIMITS.company}
          defaultValue={values?.company ?? ""}
          aria-invalid={Boolean(state.errors?.company)}
          aria-describedby={
            state.errors?.company ? "company-error" : undefined
          }
          className={inputClassName}
        />

        {/* Only display this message when a company error was returned. */}
        {state.errors?.company && (
          <p id="company-error" className={errorClassName}>
            {state.errors.company}
          </p>
        )}
      </div>

      {/* Position field and its validation error. */}
      <div className="space-y-2">
        <label htmlFor="position" className="block font-medium">
          Position
        </label>

        {/* Show the submitted position or the existing application's position. */}
        <input
          id="position"
          name="position"
          type="text"
          required
          maxLength={APPLICATION_LIMITS.position}
          defaultValue={values?.position ?? ""}
          aria-invalid={Boolean(state.errors?.position)}
          aria-describedby={
            state.errors?.position ? "position-error" : undefined
          }
          className={inputClassName}
        />

        {/* Only display this message when a position error was returned. */}
        {state.errors?.position && (
          <p id="position-error" className={errorClassName}>
            {state.errors.position}
          </p>
        )}
      </div>

      {/* Status selection and its validation error. */}
      <div className="space-y-2">
        <label htmlFor="status" className="block font-medium">
          Status
        </label>

        {/* Show the available status, or Applied for a new application. */}
        <select
          id="status"
          name="status"
          required
          defaultValue={values?.status ?? "Applied"}
          aria-invalid={Boolean(state.errors?.status)}
          aria-describedby={
            state.errors?.status ? "status-error" : undefined
          }
          className={inputClassName}
        >
          {/* Create one dropdown option for each allowed status. */}
          {APPLICATION_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        {/* Only display this message when a status error was returned. */}
        {state.errors?.status && (
          <p id="status-error" className={errorClassName}>
            {state.errors.status}
          </p>
        )}
      </div>

      {/* Date applied field and its validation error. */}
      <div className="space-y-2">
        <label htmlFor="dateApplied" className="block font-medium">
          Date applied
        </label>

        {/* Show the submitted date or the existing application's date. */}
        <input
          id="dateApplied"
          name="dateApplied"
          type="date"
          required
          defaultValue={values?.dateApplied ?? ""}
          aria-invalid={Boolean(state.errors?.dateApplied)}
          aria-describedby={
            state.errors?.dateApplied ? "date-applied-error" : undefined
          }
          className={inputClassName}
        />

        {/* Only display this message when a date error was returned. */}
        {state.errors?.dateApplied && (
          <p id="date-applied-error" className={errorClassName}>
            {state.errors.dateApplied}
          </p>
        )}
      </div>

      {/* Optional notes field and its validation error. */}
      <div className="space-y-2">
        <label htmlFor="notes" className="block font-medium">
          Notes (optional)
        </label>

        {/* Show the available notes and enforce the maximum length. */}
        <textarea
          id="notes"
          name="notes"
          rows={5}
          maxLength={APPLICATION_LIMITS.notes}
          defaultValue={values?.notes ?? ""}
          aria-invalid={Boolean(state.errors?.notes)}
          aria-describedby={
            state.errors?.notes ? "notes-error" : undefined
          }
          className={inputClassName}
        />

        {/* Only display this message when a notes error was returned. */}
        {state.errors?.notes && (
          <p id="notes-error" className={errorClassName}>
            {state.errors.notes}
          </p>
        )}
      </div>

      {/* Display the overall message returned by the action. */}
      {/* aria-live lets assistive technology announce message changes. */}
      <p aria-live="polite" className={errorClassName}>
        {state.message}
      </p>

      {/* Group the submit button and Cancel link together. */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Disable submission while saving. */}
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-blue-700 px-4 py-2 font-medium text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {/* Show progress, or label the button for editing or creating. */}
          {pending
            ? "Saving..."
            : application
              ? "Save changes"
              : "Save application"}
        </button>

        {/* Return to the record when editing, or the list when creating. */}
        <Link href={cancelHref} className="underline">
          Cancel
        </Link>
      </div>
    </form>
  );
}