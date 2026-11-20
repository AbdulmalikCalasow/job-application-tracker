import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { auth } from "@/auth";
import { logoutUser } from "@/app/lib/auth-actions";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Job Application Tracker",
  description: "Track and manage your job applications.",
};

export default async function RootLayout({
  children,
}: LayoutProps<"/">) {
  const session = await auth();
  const isLoggedIn = Boolean(session?.user?.id);

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {/* Shared navigation displayed on every page. */}
        <header className="border-b border-zinc-200 dark:border-zinc-800">
          <nav
            aria-label="Main navigation"
            className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4"
          >
            {/* Click the application name to return home. */}
            <Link
              href="/"
              aria-label="Job Application Tracker home"
              className="text-lg font-semibold tracking-tight"
            >
              Job Application Tracker
            </Link>

            <div className="flex flex-wrap items-center gap-5 text-sm font-medium">
              {isLoggedIn ? (
                <>
                  <Link
                    href="/applications"
                    className="text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
                  >
                    Applications
                  </Link>

                  <Link
                    href="/applications/new"
                    className="rounded-md bg-blue-700 px-3 py-2 text-white hover:bg-blue-800"
                  >
                    + Add application
                  </Link>

                  <span className="max-w-40 truncate text-zinc-600 dark:text-zinc-400">
                    {session?.user?.name ?? "My account"}
                  </span>

                  <form action={logoutUser}>
                    <button
                      type="submit"
                      className="rounded-md border border-zinc-300 px-3 py-2 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
                    >
                      Log out
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
                  >
                    Log in
                  </Link>

                  <Link
                    href="/register"
                    className="rounded-md bg-blue-700 px-3 py-2 text-white hover:bg-blue-800"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </nav>
        </header>

        {/* Render the current page below the navigation. */}
        {children}
      </body>
    </html>
  );
}