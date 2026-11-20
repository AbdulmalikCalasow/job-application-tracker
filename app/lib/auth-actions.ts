"use server";

import bcrypt from "bcrypt";
import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";
import { connectToDatabase } from "./db";
import UserModel from "./user-model";

export type AuthFormState = {
  message?: string;
  success?: boolean;
  values?: {
    name?: string;
    email: string;
  };
};

function getText(formData: FormData, field: string): string {
  const value = formData.get(field);
  return typeof value === "string" ? value : "";
}

export async function registerUser(
  previousState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  void previousState;

  const name = getText(formData, "name").trim();
  const email = getText(formData, "email").trim().toLowerCase();
  const password = getText(formData, "password");
  const confirmPassword = getText(formData, "confirmPassword");

  const values = { name, email };

  if (!name) {
    return {
      message: "Enter your name.",
      values,
    };
  }

  if (name.length > 100) {
    return {
      message: "Use 100 characters or fewer for your name.",
      values,
    };
  }

  if (
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return {
      message: "Enter a valid email address.",
      values,
    };
  }

  if (password.length < 12) {
    return {
      message: "Use at least 12 characters.",
      values,
    };
  }

  if (Buffer.byteLength(password, "utf8") > 72) {
    return {
      message: "Password is too long. Try a shorter one.",
      values,
    };
  }

  if (password !== confirmPassword) {
    return {
      message: "Passwords don't match.",
      values,
    };
  }

  try {
    await connectToDatabase();
    await UserModel.init();

    const passwordHash = await bcrypt.hash(password, 12);

    await UserModel.create({
      name,
      email,
      passwordHash,
    });
  } catch (error) {
    const isDuplicateEmail =
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000;

    if (isDuplicateEmail) {
      return {
        message: "Email already registered. Log in or use another email.",
        values,
      };
    }

    console.error("Registration failed.");

    return {
      message: "Couldn't create your account. Please try again.",
      values,
    };
  }

  return {
    success: true,
    message: "Account created. Log in to continue.",
  };
}

export async function loginUser(
  previousState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  void previousState;

  const email = getText(formData, "email").trim().toLowerCase();
  const password = getText(formData, "password");

  const values = { email };

  if (
    !email ||
    email.length > 254 ||
    !password ||
    Buffer.byteLength(password, "utf8") > 72
  ) {
    return {
      message: "Incorrect email or password.",
      values,
    };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        return {
          message: "Incorrect email or password.",
          values,
        };
      }

      console.error("Authentication failed.");

      return {
        message: "Couldn't log in. Please try again.",
        values,
      };
    }

    // Let Next.js complete the successful login redirect.
    throw error;
  }

  return {};
}

export async function logoutUser(): Promise<void> {
  await signOut({
    redirectTo: "/login",
  });
}