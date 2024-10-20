import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

export async function POST(request: NextRequest): Promise<NextResponse> {
  
  const { prompt } = await request.json();
  const apiKey = process.env.PERPLEXITY_API!;
  const messages = [
    {
      role: "user",
      content: `You are supposed to provide context from the web for a user's query about an event. Try to find the time, location, and other details about the event but do not make up any information or make assumptions. Prompt: ${prompt}`
    },
  ] 
  const client = new OpenAI({
    apiKey: apiKey,
    baseURL: "https://api.perplexity.ai",
  });

  try {
    const response = await client.chat.completions.create({
      model: "llama-3.1-sonar-small-128k-online",
      messages: messages as ChatCompletionMessageParam[],
    });
    console.log(response)

    return NextResponse.json({ response: response.choices[0].message.content });
  } catch (error) {
    console.error("Error generating content:", error);
    return NextResponse.json({ error: "An error occurred when parsing text" }, { status: 500 });
  }
}
