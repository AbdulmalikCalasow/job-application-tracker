// Import the navigation helper for invalid or missing applications.
import { notFound } from "next/navigation";

// Import the existing function that fetches one application.
// This page is one folder deeper than the details page,
// so the import needs one additional "../".
import { getApplicationById } from "../../../lib/data";

// Import the shared form that now supports creating and editing.
import ApplicationForm from "../../../ui/components/application-form";

// Define the route parameter passed to this page.
type EditApplicationPageProps = {
  params: Promise<{ id: string }>;
};

// Fetch the existing application and display it in the shared form.
export default async function EditApplicationPage({
  params,
}: EditApplicationPageProps) {
  // Read the application ID from the URL.
  const { id } = await params;

  // Fetch the application whose details the user wants to edit.
  const application = await getApplicationById(id);

  // Show the not-found page for an invalid or missing application.
  if (!application) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-2xl space-y-6 px-4 py-10">
      {/* Explain which application the user is editing. */}
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">
          Edit application
        </h1>

        <p className="text-zinc-600 dark:text-zinc-400">
          Update your application for {application.position} at{" "}
          {application.company}.
        </p>
      </header>

      {/* Passing the existing application puts the shared form in edit mode. */}
      {/* The form uses its saved values and selects the update action. */}
      <ApplicationForm application={application} />
    </main>
  );
}