import { ChromaClient } from "chromadb";
import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const params = await request.json();
  const { userId, documentText } = params;
  const chromaClient = new ChromaClient({ path: "http://34.102.41.119:8000" })
  const collection = await chromaClient.getOrCreateCollection({
    name: userId,
  });
  await collection.add({
    ids: [randomUUID()],
    documents: [documentText],
    metadatas: [{
      createdAt: new Date().toISOString(),
      type: "memory",
    }],
  });
  return NextResponse.json({ success: true });
}
