"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  loginUser,
  registerUser,
  type AuthFormState,
} from "@/app/lib/auth-actions";

type AuthFormProps = {
  mode: "login" | "register";
};

const initialState: AuthFormState = {};

export default function AuthForm({ mode }: AuthFormProps) {
  const isRegister = mode === "register";
  const action = isRegister ? registerUser : loginUser;

  const [state, formAction, pending] = useActionState(
    action,
    initialState
  );

  const inputClassName =
    "w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100";

  if (isRegister && state.success) {
    return (
      <section className="space-y-4">
        <p role="status">{state.message}</p>

        <Link
          href="/login"
          className="inline-block rounded-md bg-blue-700 px-4 py-2 font-medium text-white hover:bg-blue-800"
        >
          Log in
        </Link>
      </section>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      {isRegister && (
        <div className="space-y-2">
          <label htmlFor="name" className="block font-medium">
            Name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={100}
            className={inputClassName}
          />
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="email" className="block font-medium">
          Email
        </label>

        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          className={inputClassName}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block font-medium">
          Password
        </label>

        <input
          id="password"
          name="password"
          type="password"
          autoComplete={
            isRegister ? "new-password" : "current-password"
          }
          required
          minLength={isRegister ? 12 : undefined}
          aria-describedby={
            isRegister ? "password-help" : undefined
          }
          className={inputClassName}
        />

        {isRegister && (
          <p
            id="password-help"
            className="text-sm text-zinc-600 dark:text-zinc-400"
          >
            Use at least 12 characters.
          </p>
        )}
      </div>

      {isRegister && (
        <div className="space-y-2">
          <label
            htmlFor="confirmPassword"
            className="block font-medium"
          >
            Confirm password
          </label>

          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            minLength={12}
            className={inputClassName}
          />
        </div>
      )}

      <p
        aria-live="polite"
        className="text-sm text-red-600 dark:text-red-400"
      >
        {state.message}
      </p>

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-blue-700 px-4 py-2 font-medium text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending
          ? isRegister
            ? "Creating account..."
            : "Logging in..."
          : isRegister
            ? "Create account"
            : "Log in"}
      </button>

      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {isRegister ? (
          <>
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Log in
            </Link>
          </>
        ) : (
          <>
            New here?{" "}
            <Link href="/register" className="underline">
              Create account
            </Link>
          </>
        )}
      </p>
    </form>
  );
}