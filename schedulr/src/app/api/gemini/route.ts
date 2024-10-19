import { NextRequest, NextResponse } from "next/server";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
export async function GET(request: NextRequest): Promise<NextResponse> {
  const apiKey = process.env.GEMINI_API!;
  const fileManager = new GoogleAIFileManager(apiKey);
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const uploadResult = await fileManager.uploadFile(
      `./src/public/event_sample.jpg`,
      {
        mimeType: "image/jpeg",
        displayName: "Event Picture",
      }
    );

    const prompt =
      "Parse this image into a .json file. Return the .json file only, do not return any other text. The .json file should be in the format of 'eventname', 'date', 'time', 'location'. If any values are not found, return null for that category in .json.";

    const getResponse = await fileManager.getFile(uploadResult.file.name);

    const response = await model.generateContent([
      prompt,
      {
        fileData: {
          fileUri: uploadResult.file.uri,
          mimeType: uploadResult.file.mimeType,
        },
      },
    ]);

    const result = response.response.text();

    return NextResponse.json({ response: result });
  } catch (error) {
    console.error("Error generating content:", error);
    return NextResponse.json({ error: error });
  }
}
