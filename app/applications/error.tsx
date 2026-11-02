"use client";

import Link from "next/link";

type ApplicationsErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

// Display safe feedback without exposing database error details.
export default function ApplicationsError({
  reset,
}: ApplicationsErrorProps) {
  return (
    <main className="mx-auto w-full max-w-4xl space-y-6 px-4 py-10">
      <div role="alert" className="space-y-2">
        <h1 className="text-3xl font-bold">
          Something went wrong
        </h1>

        <p className="text-zinc-600 dark:text-zinc-400">
          We could not load this page. Please try again.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-md bg-blue-700 px-4 py-2 font-medium text-white hover:bg-blue-800"
        >
          Try again
        </button>

        <Link href="/" className="underline">
          Return home
        </Link>
      </div>
    </main>
  );
}