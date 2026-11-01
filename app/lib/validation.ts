import { APPLICATION_STATUSES } from "./definitions";

// Set the text limits.
export const APPLICATION_LIMITS = {
  company: 100,
  position: 100,
  notes: 2000,
};

// Define the form fields.
export type ApplicationFormValues = {
  company: string;
  position: string;
  status: string;
  dateApplied: string;
  notes: string;
};

// Define errors for each field.
export type ApplicationFieldErrors = Partial<
  Record<keyof ApplicationFormValues, string>
>;

// Get today's date using the server or browser's local time.
export function getTodayDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// Check that the date exists.
function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
  );
}

// Clean and validate the application fields.
export function validateApplication(values: ApplicationFormValues) {
  const data: ApplicationFormValues = {
    company: values.company.trim(),
    position: values.position.trim(),
    status: values.status.trim(),
    dateApplied: values.dateApplied.trim(),
    notes: values.notes.trim(),
  };

  const errors: ApplicationFieldErrors = {};

  if (!data.company) {
    errors.company = "Company is required.";
  } else if (data.company.length > APPLICATION_LIMITS.company) {
    errors.company = "Company cannot exceed 100 characters.";
  }

  if (!data.position) {
    errors.position = "Position is required.";
  } else if (data.position.length > APPLICATION_LIMITS.position) {
    errors.position = "Position cannot exceed 100 characters.";
  }

  if (!APPLICATION_STATUSES.some((status) => status === data.status)) {
    errors.status = "Choose a valid status.";
  }

  if (!data.dateApplied) {
    errors.dateApplied = "Date applied is required.";
  } else if (!isValidDate(data.dateApplied)) {
    errors.dateApplied = "Enter a valid date.";
  } else if (data.dateApplied > getTodayDate()) {
    errors.dateApplied = "Date applied cannot be in the future.";
  }

  if (data.notes.length > APPLICATION_LIMITS.notes) {
    errors.notes = "Notes cannot exceed 2000 characters.";
  }

  return {
    data,
    errors,
    success: Object.keys(errors).length === 0,
  };
}