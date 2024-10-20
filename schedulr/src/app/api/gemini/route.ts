import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const apiKey = process.env.GEMINI_API!;
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const { base64Image } = await request.json();

    const prompt =
      "Parse this image into a .json file. Return the .json file only, do not return any other text. The .json file should be in the format of 'eventname', 'date', 'time', 'location'. If any values are not found, return null for that category in .json.";

    const response = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: "image/png",
        },
      },
    ]);

    const result = response.response.text();

    return NextResponse.json({ response: result });
  } catch (error) {
    console.error("Error generating content:", error);
    return NextResponse.json({ error: "An error occurred while processing the image" }, { status: 500 });
  }
}
