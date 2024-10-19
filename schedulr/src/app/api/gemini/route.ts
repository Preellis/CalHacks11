import { NextRequest, NextResponse } from "next/server";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const apikey = process.env.GEMINI_API_KEY!;
  const fileManager = new GoogleAIFileManager(apikey);
  const genAI = new GoogleGenerativeAI(apikey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    console.log("Before IMG Upload");
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

    // View the response.
    console.log(
      `Retrieved file ${getResponse.displayName} as ${getResponse.uri}`
    );

    const response = await model.generateContent([
      prompt,
      {
        fileData: {
          fileUri: uploadResult.file.uri,
          mimeType: uploadResult.file.mimeType,
        },
      },
    ]);

    const result = await response.response.text();

    return NextResponse.json({ response: result });
  } catch (error) {
    console.error("Error generating content:", error);
    return NextResponse.json({ error: error });
  }
}
