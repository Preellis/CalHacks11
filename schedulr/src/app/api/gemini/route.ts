import { NextRequest, NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { decode } from "base64-arraybuffer";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const apiKey = process.env.GEMINI_API!;
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const { base64Image } = await request.json();

    // // Initialize Google Cloud Storage
    // const storage = new Storage({
    //   projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    //   credentials: JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS!)
    // });

    // const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME!;
    // const bucket = storage.bucket(bucketName);

    // // Generate a unique filename
    // const filename = `event_image_${Date.now()}.jpg`;
    // const file = bucket.file(filename);

    // // Upload the base64 image to Google Cloud Storage
    // await file.save(Buffer.from(decode(base64Image)), {
    //   metadata: {
    //     contentType: 'image/jpeg',
    //   },
    // });

    // // Get the public URL of the uploaded file
    // const publicUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;

    const prompt =
      "Parse this image into a .json file. Return the .json file only, do not return any other text. The .json file should be in the format of 'eventname', 'date', 'time', 'location'. If any values are not found, return null for that category in .json.";

    const response = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: "image/jpeg",
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
