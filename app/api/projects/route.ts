import { db } from "@/config/db";
import {
  chatTable,
  framesTable,
  projectsTable,
  usersTable,
} from "@/config/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { projectId, frameId, messages, credits } = await req.json();
  const user = await currentUser();
  const { has } = await auth();
  const hasUnlimitedAccess = has && has({ plan: "unlimited" });

  //project
  const projectResult = await db.insert(projectsTable).values({
    projectId,
    createdBy: user?.emailAddresses?.[0]?.emailAddress ?? "",
  });
  //frame
  const frameResult = await db.insert(framesTable).values({
    frameId,
    projectId,
  });
  //chats
  const chatResult = await db.insert(chatTable).values({
    chatMessage: messages,
    frameId,
    createdBy: user?.emailAddresses?.[0]?.emailAddress ?? "",
  });

  //update user credits
  if (!hasUnlimitedAccess) {
    const userResult = await db
      .update(usersTable)
      .set({
        credits: Number(credits) - 1,
      })
      .where(eq(usersTable.email, user?.primaryEmailAddress?.emailAddress!));
  }
  return NextResponse.json({
    project: projectResult,
    frame: frameResult,
    chat: chatResult,
  });
}
