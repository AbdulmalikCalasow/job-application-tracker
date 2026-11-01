// List the allowed statuses.
export const APPLICATION_STATUSES = [
  "Applied",
  "Interview",
  "Offer",
  "Rejected",
] as const;

// Use the values from the status list as a type.
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

// Define application data for pages and components.
export type Application = {
  id: string;
  company: string;
  position: string;
  status: ApplicationStatus;
  dateApplied: string;
  notes?: string;
};