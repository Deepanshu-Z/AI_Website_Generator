import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { currentUser, EmailAddress } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const user = await currentUser();

  const existingUser = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, user?.emailAddresses?.[0]?.emailAddress ?? ""));

  const email = user?.emailAddresses?.[0]?.emailAddress ?? "";
  if (existingUser.length == 0) {
    await db.insert(usersTable).values({
      name: user?.fullName ?? "",
      email,
    });
  }

  // bcs credits hum manually add nhi krre...
  const [userRecord] = await db
    .select({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
      credits: usersTable.credits,
    })
    .from(usersTable)
    .where(eq(usersTable.email, email));

  return NextResponse.json({ user: userRecord });
}
