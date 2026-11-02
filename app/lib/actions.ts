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
import { isValidObjectId } from "./utils";

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

// Validate and update an existing application.
export async function updateApplication(
  id: string,
  _previousState: ApplicationFormState,
  formData: FormData
): Promise<ApplicationFormState> {
  // Reject an invalid ID before querying the database.
  if (!isValidObjectId(id)) {
    return {
      message: "Invalid application ID.",
    };
  }

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

  // Return field errors without changing the database.
  if (!result.success) {
    return {
      errors: result.errors,
      message: "Please correct the highlighted fields.",
      values: result.data,
    };
  }

  try {
    await connectToDatabase();

    // Update only the editable fields and run schema validation.
    const application = await ApplicationModel.findByIdAndUpdate(
      id,
      {
        company: result.data.company,
        position: result.data.position,
        status: result.data.status as ApplicationStatus,
        dateApplied: new Date(
          `${result.data.dateApplied}T00:00:00.000Z`
        ),
        notes: result.data.notes,
      },
      { runValidators: true }
    );

    if (!application) {
      return {
        message: "This application no longer exists.",
        values: result.data,
      };
    }
  } catch (error) {
    console.error("Failed to update application:", error);

    return {
      message: "Unable to update the application. Please try again.",
      values: result.data,
    };
  }

  // Refresh the list and details before returning to the record.
  revalidatePath("/applications");
  revalidatePath(`/applications/${id}`);
  redirect(`/applications/${id}`);
}

// Define the message returned when deletion cannot be completed.
export type DeleteApplicationState = {
  message?: string;
};

// Delete an existing application after the user confirms in the interface.
export async function deleteApplication(
  id: string,
  _previousState: DeleteApplicationState,
  _formData: FormData
): Promise<DeleteApplicationState> {
  // Reject invalid IDs before querying the database.
  if (!isValidObjectId(id)) {
    return {
      message: "Invalid application ID.",
    };
  }

  try {
    // Reuse the existing database connection.
    await connectToDatabase();

    // Remove the application matching this ID.
    const application = await ApplicationModel.findByIdAndDelete(id);

    // Explain when the application has already been removed.
    if (!application) {
      return {
        message: "This application no longer exists.",
      };
    }
  } catch (error) {
    // Log the technical error on the server, not in the interface.
    console.error("Failed to delete application:", error);

    return {
      message: "Unable to delete the application. Please try again.",
    };
  }

  // Refresh the list and invalidate the deleted record's details.
  revalidatePath("/applications");
  revalidatePath(`/applications/${id}`);

  // Return to the list after successful deletion.
  // Keep redirect outside try/catch, just like the other actions.
  redirect("/applications");
}

