import Link from "next/link";
import ApplicationList from "../ui/components/application-list";
import { getApplications } from "../lib/data";
import {
  APPLICATION_STATUSES,
  type ApplicationStatus,
} from "../lib/definitions";

type ApplicationsPageProps = {
  searchParams: Promise<{
    status?: string | string[];
  }>;
};

// Fetch applications and read the requested status filter.
export default async function ApplicationsPage({
  searchParams,
}: ApplicationsPageProps) {
  const { status } = await searchParams;
  const applications = await getApplications();

  // Accept only recognized statuses; otherwise show everything.
  const initialStatus: ApplicationStatus | "All" =
    APPLICATION_STATUSES.find((value) => value === status) ?? "All";

  return (
    <main className="mx-auto w-full max-w-4xl space-y-6 px-4 py-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Job Applications</h1>

        <p className="text-zinc-600 dark:text-zinc-400">
          Track your applications and their progress.
        </p>
      </header>

      <Link
        href="/applications/new"
        className="inline-block rounded-md bg-blue-700 px-4 py-2 font-medium text-white hover:bg-blue-800"
      >
        Add application
      </Link>

      {/* Reset the filter state when the requested status changes. */}
      <ApplicationList
        key={initialStatus}
        applications={applications}
        initialStatus={initialStatus}
      />
    </main>
  );
}