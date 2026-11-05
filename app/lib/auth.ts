import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { isValidObjectId } from "./utils";

export async function requireUserId(): Promise<string> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId || !isValidObjectId(userId)) {
    redirect("/login");
  }

  return userId;
}