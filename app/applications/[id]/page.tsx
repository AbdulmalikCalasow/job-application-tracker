import Link from "next/link";
import { notFound } from "next/navigation";
import { getApplicationById } from "../../lib/data";
import DeleteApplicationForm from "../../ui/components/delete-application-form";

// Define the route parameter passed to this page.
type ApplicationDetailsPageProps = {
  params: Promise<{ id: string }>;
};

// Fetch and display one application.
export default async function ApplicationDetailsPage({
  params,
}: ApplicationDetailsPageProps) {
  // Read the application ID from the URL.
  const { id } = await params;
  const application = await getApplicationById(id);

  // Show the not-found page for an invalid or missing application.
  if (!application) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-2xl space-y-6 px-4 py-10">
      <Link href="/applications" className="inline-block underline">
        Back to applications
      </Link>

      {/* Display the position and company. */}
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">
          {application.position}
        </h1>

        <p className="text-xl text-zinc-600 dark:text-zinc-400">
          {application.company}
        </p>
      </header>

      {/* Take the user to the edit page for this application. */}
      <Link
        href={`/applications/${application.id}/edit`}
        className="inline-block rounded-md bg-blue-700 px-4 py-2 font-medium text-white hover:bg-blue-800"
      >
        Edit application
      </Link>

      {/* Display the remaining application details. */}
      <dl className="space-y-4 rounded-lg border border-zinc-300 p-6 dark:border-zinc-700">
        <div>
          <dt className="font-semibold">Status</dt>
          <dd>{application.status}</dd>
        </div>

        <div>
          <dt className="font-semibold">Date applied</dt>
          <dd>{application.dateApplied}</dd>
        </div>

        <div>
          <dt className="font-semibold">Notes</dt>
          <dd className="whitespace-pre-wrap wrap-break-word">
            {application.notes || "No notes added."}
          </dd>
        </div>
      </dl>

      {/* Require confirmation before deleting this application. */}
      <DeleteApplicationForm applicationId={application.id} />
    </main>
  );
}