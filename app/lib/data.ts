import { connectToDatabase } from "./db";
import type { Application } from "./definitions";
import ApplicationModel from "./models";
import { isValidObjectId } from "./utils";
import { requireUserId } from "./auth";

// Get the signed-in user's applications.
export async function getApplications(): Promise<Application[]> {
  const userId = await requireUserId();

  await connectToDatabase();

  const applications = await ApplicationModel.find({ userId })
    .sort({ createdAt: -1, _id: -1 })
    .lean();

  return applications.map((application) => ({
    id: application._id.toString(),
    company: application.company,
    position: application.position,
    status: application.status,
    dateApplied: application.dateApplied.toISOString().slice(0, 10),
    notes: application.notes ?? "",
  }));
}

// Get one application belonging to the signed-in user.
export async function getApplicationById(
  id: string
): Promise<Application | null> {
  const userId = await requireUserId();

  if (!isValidObjectId(id)) {
    return null;
  }

  await connectToDatabase();

  const application = await ApplicationModel.findOne({
    _id: id,
    userId,
  }).lean();

  if (!application) {
    return null;
  }

  return {
    id: application._id.toString(),
    company: application.company,
    position: application.position,
    status: application.status,
    dateApplied: application.dateApplied.toISOString().slice(0, 10),
    notes: application.notes ?? "",
  };
}