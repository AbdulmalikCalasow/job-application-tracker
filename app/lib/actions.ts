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
import { requireUserId } from "./auth";

export type ApplicationFormState = {
  errors?: ApplicationFieldErrors;
  message?: string;
  values?: ApplicationFormValues;
};

function getFormValues(formData: FormData): ApplicationFormValues {
  const getText = (name: string): string => {
    const value = formData.get(name);
    return typeof value === "string" ? value : "";
  };

  return {
    company: getText("company"),
    position: getText("position"),
    status: getText("status"),
    dateApplied: getText("dateApplied"),
    notes: getText("notes"),
  };
}

function refreshApplicationPages(id?: string): void {
  revalidatePath("/");
  revalidatePath("/applications");

  if (id) {
    revalidatePath(`/applications/${id}`);
    revalidatePath(`/applications/${id}/edit`);
  }
}

export async function createApplication(
  previousState: ApplicationFormState,
  formData: FormData
): Promise<ApplicationFormState> {
  void previousState;

  const userId = await requireUserId();
  const result = validateApplication(getFormValues(formData));

  if (!result.success) {
    return {
      errors: result.errors,
      message: "Check the highlighted fields.",
      values: result.data,
    };
  }

  try {
    await connectToDatabase();

    await ApplicationModel.create({
      userId,
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
      message: "Couldn't save. Please try again.",
      values: result.data,
    };
  }

  refreshApplicationPages();
  redirect("/applications");
}

export async function updateApplication(
  id: string,
  previousState: ApplicationFormState,
  formData: FormData
): Promise<ApplicationFormState> {
  void previousState;

  const userId = await requireUserId();

  if (!isValidObjectId(id)) {
    return {
      message: "Application not found.",
    };
  }

  const result = validateApplication(getFormValues(formData));

  if (!result.success) {
    return {
      errors: result.errors,
      message: "Check the highlighted fields.",
      values: result.data,
    };
  }

  try {
    await connectToDatabase();

    const application = await ApplicationModel.findOneAndUpdate(
      { _id: id, userId },
      {
        $set: {
          company: result.data.company,
          position: result.data.position,
          status: result.data.status as ApplicationStatus,
          dateApplied: new Date(
            `${result.data.dateApplied}T00:00:00.000Z`
          ),
          notes: result.data.notes,
        },
      },
      { runValidators: true }
    );

    if (!application) {
      return {
        message: "Application not found.",
        values: result.data,
      };
    }
  } catch (error) {
    console.error("Failed to update application:", error);

    return {
      message: "Couldn't save changes. Please try again.",
      values: result.data,
    };
  }

  refreshApplicationPages(id);
  redirect(`/applications/${id}`);
}

export type DeleteApplicationState = {
  message?: string;
};

export async function deleteApplication(
  id: string,
  previousState: DeleteApplicationState,
  formData: FormData
): Promise<DeleteApplicationState> {
  void previousState;
  void formData;

  const userId = await requireUserId();

  if (!isValidObjectId(id)) {
    return {
      message: "Application not found.",
    };
  }

  try {
    await connectToDatabase();

    const application = await ApplicationModel.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!application) {
      return {
        message: "Application not found.",
      };
    }
  } catch (error) {
    console.error("Failed to delete application:", error);

    return {
      message: "Couldn't delete. Please try again.",
    };
  }

  refreshApplicationPages(id);
  redirect("/applications");
}