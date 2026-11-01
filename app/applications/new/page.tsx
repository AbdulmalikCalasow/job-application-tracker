import ApplicationForm from "../../components/application-form";

export default function NewApplicationPage() {
  return (
    <main className="mx-auto w-full max-w-2xl space-y-6 px-4 py-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Add Application</h1>

        <p className="text-zinc-600 dark:text-zinc-400">
          Enter the details of your job application.
        </p>
      </header>

      <ApplicationForm />
    </main>
  );
}