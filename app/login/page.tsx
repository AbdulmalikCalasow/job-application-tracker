import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AuthForm from "@/app/ui/components/auth-form";

export const metadata: Metadata = {
  title: "Login | Job Application Tracker",
};

export default async function LoginPage() {
  const session = await auth();

  if (session?.user?.id) {
    redirect("/");
  }

  return (
    <main className="mx-auto w-full max-w-md space-y-6 px-4 py-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Log in</h1>

        <p className="text-zinc-600 dark:text-zinc-400">
          Sign in to manage your job applications.
        </p>
      </header>

      <AuthForm mode="login" />
    </main>
  );
}