import mongoose, { Schema, type Model } from "mongoose";
import {
  APPLICATION_STATUSES,
  type ApplicationStatus,
} from "./definitions";
import { APPLICATION_LIMITS, getTodayDate } from "./validation";

// Define the database fields.
interface ApplicationRecord {
  company: string;
  position: string;
  status: ApplicationStatus;
  dateApplied: Date;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the application schema.
const applicationSchema = new Schema<ApplicationRecord>(
  {
    company: {
      type: String,
      trim: true,
      required: [true, "Company is required."],
      maxlength: [
        APPLICATION_LIMITS.company,
        "Company cannot exceed 100 characters.",
      ],
    },
    position: {
      type: String,
      trim: true,
      required: [true, "Position is required."],
      maxlength: [
        APPLICATION_LIMITS.position,
        "Position cannot exceed 100 characters.",
      ],
    },
    status: {
      type: String,
      required: [true, "Status is required."],
      enum: {
        values: [...APPLICATION_STATUSES],
        message: "Choose a valid status.",
      },
    },
    dateApplied: {
      type: Date,
      required: [true, "Date applied is required."],
      validate: {
        // Compare the stored date with today's date.
        validator: (value: Date): boolean =>
          value.toISOString().slice(0, 10) <= getTodayDate(),
        message: "Date applied cannot be in the future.",
      },
    },
    notes: {
      type: String,
      trim: true,
      default: "",
      maxlength: [
        APPLICATION_LIMITS.notes,
        "Notes cannot exceed 2000 characters.",
      ],
    },
  },
  {
    timestamps: true,
  }
);

// Reuse the model during hot reload.
const ApplicationModel: Model<ApplicationRecord> =
  (mongoose.models.Application as Model<ApplicationRecord> | undefined) ??
  mongoose.model<ApplicationRecord>("Application", applicationSchema);

export default ApplicationModel;