import mongoose, { Schema, type Model } from "mongoose";

interface UserRecord {
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserRecord>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ email: 1 }, { unique: true });

const UserModel: Model<UserRecord> =
  (mongoose.models.User as Model<UserRecord> | undefined) ??
  mongoose.model<UserRecord>("User", userSchema);

export default UserModel;