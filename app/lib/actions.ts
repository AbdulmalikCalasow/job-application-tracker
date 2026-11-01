"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { connectToDatabase } from "./db";
import ApplicationModel from "./models";
import type { ApplicationStatus } from "./definitions";
import {
  validateApplication,
  type ApplicationFieldErrors,
  type ApplicationFormValues,
} from "./validation";

// Define the information returned when submission fails.
export type ApplicationFormState = {
  errors?: ApplicationFieldErrors;
  message?: string;
  values?: ApplicationFormValues;
};

// Validate and save a new application.
export async function createApplication(
  _previousState: ApplicationFormState,
  formData: FormData
): Promise<ApplicationFormState> {
  // Accept text fields only.
  const getText = (name: string): string => {
    const value = formData.get(name);
    return typeof value === "string" ? value : "";
  };

  const values: ApplicationFormValues = {
    company: getText("company"),
    position: getText("position"),
    status: getText("status"),
    dateApplied: getText("dateApplied"),
    notes: getText("notes"),
  };

  const result = validateApplication(values);

  if (!result.success) {
    return {
      errors: result.errors,
      message: "Please correct the highlighted fields.",
      values: result.data,
    };
  }

  try {
    await connectToDatabase();

    await ApplicationModel.create({
      company: result.data.company,
      position: result.data.position,
      status: result.data.status as ApplicationStatus,
      dateApplied: new Date(
        `${result.data.dateApplied}T00:00:00.000Z`
      ),
      notes: result.data.notes,
    });
  } catch (error) {
    console.error("Failed to create application:", error);

    return {
      message: "Unable to save the application. Please try again.",
      values: result.data,
    };
  }

  revalidatePath("/applications");
  redirect("/applications");
}