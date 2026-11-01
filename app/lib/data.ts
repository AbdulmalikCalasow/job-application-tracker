import { connectToDatabase } from "./db";
import type { Application } from "./definitions";
import ApplicationModel from "./models";

// Get all applications, newest first.
export async function getApplications(): Promise<Application[]> {
  await connectToDatabase();

  const applications = await ApplicationModel.find({})
    .sort({ createdAt: -1, _id: -1 })
    .lean();

  // Convert database values for pages and components.
  return applications.map((application) => ({
    id: application._id.toString(),
    company: application.company,
    position: application.position,
    status: application.status,
    dateApplied: application.dateApplied.toISOString().slice(0, 10),
    notes: application.notes ?? "",
  }));
}