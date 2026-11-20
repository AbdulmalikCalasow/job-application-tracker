import ApplicationForm from "../../ui/components/application-form";
import { requireUserId } from "@/app/lib/auth";

export default async function NewApplicationPage() {
  await requireUserId();

  return (
    <main className="mx-auto w-full max-w-2xl space-y-6 px-4 py-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Add application</h1>

        <p className="text-zinc-600 dark:text-zinc-400">
          Add your application details.
        </p>
      </header>

      <ApplicationForm />
    </main>
  );
}