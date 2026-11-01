import ApplicationList from "../components/application-list";
import { getApplications } from "../lib/data";

// Fetch applications on the server and pass them to the list.
export default async function ApplicationsPage() {
  const applications = await getApplications();

  return (
    <main className="mx-auto w-full max-w-4xl space-y-6 px-4 py-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Job Applications</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Track your applications and their progress.
        </p>
      </header>

      <ApplicationList applications={applications} />
    </main>
  );
}