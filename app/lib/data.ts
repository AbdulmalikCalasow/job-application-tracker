import { connectToDatabase } from "./db";
import type { Application } from "./definitions";
import ApplicationModel from "./models";
import { isValidObjectId } from "./utils";

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

// Get one application by its database ID.
export async function getApplicationById(
  id: string
): Promise<Application | null> {
  // Check the ID before connecting to the database.
  if (!isValidObjectId(id)) {
    return null;
  }

  await connectToDatabase();

  const application = await ApplicationModel.findById(id).lean();

  if (!application) {
    return null;
  }

  // Convert database values for pages and components.
  return {
    id: application._id.toString(),
    company: application.company,
    position: application.position,
    status: application.status,
    dateApplied: application.dateApplied.toISOString().slice(0, 10),
    notes: application.notes ?? "",
  };
}