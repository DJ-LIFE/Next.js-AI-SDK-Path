import { UIMessage, streamText, convertToModelMessages } from "ai";
import { google } from "@ai-sdk/google";

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();
    if (!messages) {
      return new Response("Invalid request", { status: 400 });
    }
    const result = streamText({
      model: google("models/gemini-2.0-flash-exp"),
      // messages: convertToModelMessages(messages), // This helper function strips away any unnecessary metadata like timestamps etc
      // messages: [    // This is an example of system prompt.
      //   {
      //     role: "system",
      //     content:
      //       "You are a Electronic Music Genius, Keep the conversation under 10 sentences.",
      //   },
      //   ...convertToModelMessages(messages),
      // ],

      messages: [
        {
          role: "system",
          content: "Convert user questions about react into single best code possible.",
        },
        {
          role: "user",
          content: "How to toggle a boolean value in React?",
        },
        {
          role: "assistant",
          content:
            "<code>const [isToggled, setIsToggled] = useState(false);\n\nconst toggle = () => {\n  setIsToggled((prev) => !prev);\n};</code>",
        },
        ...convertToModelMessages(messages),
      ],
    });

    result.usage.then((usage) => {
      console.log({
        messageCount: messages.length,
        inputTokens: usage.inputTokens,
        outputTokens: usage.outputTokens,
        totalTokens: usage.totalTokens,
        // Add any other relevant usage information here
      });
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error in chat route:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
