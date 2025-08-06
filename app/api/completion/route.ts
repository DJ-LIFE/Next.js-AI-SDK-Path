import { generateText } from 'ai'
import { google } from '@ai-sdk/google'

export async function POST(req: Request) {
    try {
        console.log('API route called');
        
        const body = await req.json();
        console.log('Request body:', body);
        
        const { prompt } = body;
        
        if (!prompt) {
            return Response.json(
                { error: "Prompt is required" }, 
                { status: 400 }
            );
        }

        const { text } = await generateText({
            model: google("models/gemini-2.0-flash-exp"),
            prompt,
        });

        console.log('Generated text:', text);
        return Response.json({ text });
        
    } catch (error) {
        console.error("Error in completion route:", error);
        return Response.json(
            { error: "Failed to generate text" }, 
            { status: 500 }
        );
    }
}