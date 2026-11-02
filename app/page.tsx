import Link from "next/link";
import { getApplications } from "./lib/data";

export const dynamic = "force-dynamic";

// Display clickable application totals and status counts.
export default async function Home() {
  const applications = await getApplications();

  const statusCounts = [
    {
      label: "Applied",
      count: applications.filter(
        (application) => application.status === "Applied"
      ).length,
      color:
        "border-blue-300 bg-blue-50 dark:border-blue-800 dark:bg-blue-950",
    },
    {
      label: "Interview",
      count: applications.filter(
        (application) => application.status === "Interview"
      ).length,
      color:
        "border-yellow-300 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950",
    },
    {
      label: "Offer",
      count: applications.filter(
        (application) => application.status === "Offer"
      ).length,
      color:
        "border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-950",
    },
    {
      label: "Rejected",
      count: applications.filter(
        (application) => application.status === "Rejected"
      ).length,
      color:
        "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950",
    },
  ];

  return (
    <main className="mx-auto w-full max-w-5xl space-y-8 px-4 py-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">
          Job Application Tracker
        </h1>

        <p className="text-zinc-600 dark:text-zinc-400">
          Select a card to view your applications.
        </p>
      </header>

      <section
        aria-labelledby="overview-heading"
        className="space-y-4"
      >
        <h2 id="overview-heading" className="text-2xl font-semibold">
          Application overview
        </h2>

        {/* Open the complete list when the total card is selected. */}
        <Link
          href="/applications"
          className="block rounded-lg border border-zinc-300 p-6 transition hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 dark:border-zinc-700"
        >
          <p className="text-zinc-600 dark:text-zinc-400">
            Total applications
          </p>

          <p className="mt-2 text-4xl font-bold">
            {applications.length}
          </p>

          <p className="mt-3 text-sm underline">
            View all applications
          </p>
        </Link>

        {/* Open the list with the matching status selected. */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statusCounts.map((status) => (
            <Link
              key={status.label}
              href={`/applications?status=${encodeURIComponent(status.label)}`}
              className={`block rounded-lg border p-6 transition hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 ${status.color}`}
            >
              <h3 className="font-medium">{status.label}</h3>

              <p className="mt-2 text-3xl font-bold">
                {status.count}
              </p>

              <p className="mt-3 text-sm underline">
                View applications
              </p>
            </Link>
          ))}
        </div>
      </section>

      {applications.length === 0 && (
        <p className="rounded-lg border border-dashed border-zinc-300 p-6 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
          No applications yet. Select Add application in the navigation
          to create your first record.
        </p>
      )}
    </main>
  );
}