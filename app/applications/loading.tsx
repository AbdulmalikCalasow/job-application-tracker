// Display while the applications page is loading.
export default function ApplicationsLoading() {
  return (
    <main
      aria-busy="true"
      className="mx-auto w-full max-w-4xl space-y-6 px-4 py-10"
    >
      <h1 className="text-3xl font-bold">Job Applications</h1>

      <p role="status" className="text-zinc-600 dark:text-zinc-400">
        Loading applications...
      </p>

      <div aria-hidden="true" className="animate-pulse space-y-4">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-40 rounded-lg bg-zinc-200 dark:bg-zinc-800"
          />
        ))}
      </div>
    </main>
  );
}