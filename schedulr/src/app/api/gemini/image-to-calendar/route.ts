import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const apiKey = process.env.GEMINI_API!;
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const { base64Image } = await request.json();

    const prompt =
      "Parse this image into a .json file representing a calendar event. Return the .json file only, do not return any other text. The .json file should be in the format of 'eventname', 'description', 'start', 'end', 'location', 'context'. The 'start' and 'end' should be in ISO string timestamp format. 'context' should contain anything that may help you figure out more about the event in searches. If any values are not found, return null for that category in .json.";

    const response = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image.split(',')[1],
          mimeType: base64Image.split(';')[0].split(':')[1],
        },
      },
    ]);

    const result = response.response.text();

    return NextResponse.json({ response: result });
  } catch (error) {
    console.error("Error generating content:", error);
    return NextResponse.json({ error: "An error occurred while processing the image" + error }, { status: 500 });
  }
}
