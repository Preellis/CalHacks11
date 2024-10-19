import { ChromaClient, IncludeEnum } from "chromadb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const params = await request.json();
  const { userId, query } = params;
  const chromaClient = new ChromaClient({ path: "http://34.102.41.119:8000" })
  const collection = await chromaClient.getOrCreateCollection({
    name: userId,
  });
  const result = await collection.query({
    queryTexts: [query],
    where: {
      type: "memory",
    },
    nResults: 3,
    include: [IncludeEnum.Documents],
  });
  return NextResponse.json(result.documents);
}
