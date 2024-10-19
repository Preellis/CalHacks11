import { ChromaClient } from "chromadb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const params = await request.json();
  const { 
    user,
    
  } = params;
  
  const chromaClient = new ChromaClient({ path: "http://34.102.41.119:8000" })
  const heartbeat = await chromaClient.heartbeat();
  console.log(heartbeat);
  return NextResponse.json({ heartbeat });
}
