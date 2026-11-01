import mongoose from "mongoose";

// Connect to MongoDB.
export async function connectToDatabase(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;

  // Check the connection string.
  if (!uri) {
    throw new Error("MONGODB_URI is missing from .env.local");
  }

  // Reuse the open connection.
  if (mongoose.connection.readyState === 1) {
    console.log("Using existing database connection");
    return mongoose;
  }

  // Wait if a connection is already starting.
  if (mongoose.connection.readyState === 2) {
    await mongoose.connection.asPromise();
    return mongoose;
  }

  // Open the database connection.
  await mongoose.connect(uri, {
    bufferCommands: false,
  });

  console.log("New database connection established");

  return mongoose;
}