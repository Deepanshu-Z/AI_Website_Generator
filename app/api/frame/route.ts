import { db } from "@/config/db";
import { chatTable, framesTable } from "@/config/schema";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const frameId = searchParams.get("frameId");
  const projectId = searchParams.get("projectId");

  const frameResult = await db
    .select()
    .from(framesTable)
    //@ts-ignore
    .where(eq(framesTable.frameId, frameId));

  const chatResult = await db
    .select()
    .from(chatTable)
    //@ts-ignore
    .where(eq(chatTable.frameId, frameId));

  const finalResult = {
    ...frameResult[0],
    chatMessages: chatResult[0]?.chatMessage ?? [],
  };

  return NextResponse.json(finalResult);
}

export async function PUT(req: NextRequest) {
  const { frameId, designCode, projectId } = await req.json();

  const result = await db
    .update(framesTable)
    .set({
      designCode: designCode,
    })
    .where(eq(framesTable.frameId, frameId));

  return NextResponse.json({ message: "DesignCode Successfully updated" });
}
