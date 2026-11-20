import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AuthForm from "@/app/ui/components/auth-form";

export const metadata: Metadata = {
  title: "Register | Job Application Tracker",
};

export default async function RegisterPage() {
  const session = await auth();

  if (session?.user?.id) {
    redirect("/");
  }

  return (
    <main className="mx-auto w-full max-w-md space-y-6 px-4 py-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Create an account</h1>

        <p className="text-zinc-600 dark:text-zinc-400">
          Register to start tracking your applications.
        </p>
      </header>

      <AuthForm mode="register" />
    </main>
  );
}