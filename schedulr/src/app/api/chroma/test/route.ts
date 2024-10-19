import { ChromaClient } from "chromadb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const chromaClient = new ChromaClient({ path: "http://34.102.41.119:8000" })
  const heartbeat = await chromaClient.heartbeat();
  console.log(heartbeat);
  return NextResponse.json({ heartbeat });
}
