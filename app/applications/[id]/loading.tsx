// Display while an individual application is loading.
export default function ApplicationDetailsLoading() {
  return (
    <main
      aria-busy="true"
      className="mx-auto w-full max-w-2xl space-y-6 px-4 py-10"
    >
      <p role="status" className="text-zinc-600 dark:text-zinc-400">
        Loading application...
      </p>

      <div aria-hidden="true" className="animate-pulse space-y-6">
        <div className="h-10 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800" />

        <div className="h-6 w-1/2 rounded bg-zinc-200 dark:bg-zinc-800" />

        <div className="h-64 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
      </div>
    </main>
  );
}