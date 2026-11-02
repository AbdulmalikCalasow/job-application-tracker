import Link from "next/link";

// Display when the requested application cannot be found.
export default function ApplicationNotFound() {
  return (
    <main className="mx-auto w-full max-w-2xl space-y-6 px-4 py-10">
      <h1 className="text-3xl font-bold">
        Application not found
      </h1>

      <p className="text-zinc-600 dark:text-zinc-400">
        This application does not exist or has been deleted.
      </p>

      <Link
        href="/applications"
        className="inline-block rounded-md bg-blue-700 px-4 py-2 font-medium text-white hover:bg-blue-800"
      >
        Back to applications
      </Link>
    </main>
  );
}