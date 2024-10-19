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

/**
Example usage from a client-side component:

import axios from 'axios';

// Assume userId is obtained from your state management solution
const userId = 'example-user-id';

const saveMemory = async (documentText: string) => {
  try {
    const response = await axios.post('/api/chroma/add-memory', {
      userId: userId,
      documentText: documentText
    });
    
    if (response.data.success) {
      console.log('Memory saved successfully');
    } else {
      console.error('Failed to save memory');
    }
  } catch (error) {
    console.error('Error saving memory:', error);
  }
}

// Usage
saveMemory('This is a new memory to be added to the collection');
*/
