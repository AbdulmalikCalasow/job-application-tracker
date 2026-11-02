"use client";

import { useActionState, useState } from "react";
import {
  deleteApplication,
  type DeleteApplicationState,
} from "../../lib/actions";

type DeleteApplicationFormProps = {
  applicationId: string;
};

const initialState: DeleteApplicationState = {};

export default function DeleteApplicationForm({
  applicationId,
}: DeleteApplicationFormProps) {
  // Show the confirmation only after Delete application is clicked.
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Connect the delete action to this application.
  const action = deleteApplication.bind(null, applicationId);
  const [state, formAction, pending] = useActionState(
    action,
    initialState
  );

  if (!showConfirmation) {
    return (
      <button
        type="button"
        onClick={() => setShowConfirmation(true)}
        className="rounded-md bg-red-700 px-4 py-2 font-medium text-white hover:bg-red-800"
      >
        Delete application
      </button>
    );
  }

  return (
    <form
      action={formAction}
      className="space-y-3 rounded-lg border border-red-300 p-4 dark:border-red-800"
    >
      <p className="font-medium">
        Delete this application? This cannot be undone.
      </p>

      <p
        aria-live="polite"
        className="text-sm text-red-600 dark:text-red-400"
      >
        {state.message}
      </p>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-red-700 px-4 py-2 font-medium text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Deleting..." : "Yes, delete application"}
        </button>

        <button
          type="button"
          disabled={pending}
          onClick={() => setShowConfirmation(false)}
          className="underline disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}