import { AxiosError } from "axios";
import { ChromaClient, GoogleGenerativeAiEmbeddingFunction } from "chromadb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const params = await request.json();
    const { userId, query } = params;
    
    // Initialize embedding function with Gemini API
    const embedder = new GoogleGenerativeAiEmbeddingFunction({
      googleApiKey: process.env.GEMINI_API!
    });

    // Chroma Client connection
    const chromaClient = new ChromaClient({ path: "http://34.102.41.119:8000" });
    const collection = await chromaClient.getOrCreateCollection({
      name: userId,
      embeddingFunction: embedder,
    });

    // Query the collection for relevant events
    const result = await collection.query({
      queryTexts: [query],
      where: { type: "memory" },
      nResults: 3, 
    });

    return NextResponse.json(result.documents[0]);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: (error as AxiosError).message }, { status: 500 });
  }
}
