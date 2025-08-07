import { streamText } from "ai";
import { google } from "@ai-sdk/google";
export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return new Response("Prompt is required", { status: 400 });
    }
    const result = streamText({
      model: google("models/gemini-2.0-flash-exp"),
      prompt,
    });
		
		// Log usage information
		// AI sdk automatically adds some tokens for formatting and context
    result.usage.then((usage) => {
      console.log({
				inputTokens: usage.inputTokens,
				outputTokens: usage.outputTokens,
				totalTokens: usage.totalTokens,
			});
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.log("Error in completion route:", error);
    return Response.json(
      {
        error: "Failed to generate text",
      },
      { status: 500 },
    );
  }
}
