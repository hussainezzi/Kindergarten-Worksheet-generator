import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: "AIzaSyDcLJZ5GCBftOHtdvjNtgJ9blaCURnguE8" });

const model = 'gemini-2.5-flash';

const prompt = `
You are an expert in creating educational materials for kindergarten students. Your task is to convert the provided image of a student's activity into a printable A4 worksheet.

Here are the rules:
1.  Analyze the image to understand the activity, including any text, numbers, or drawings.
2.  Recreate the core activity from the image in a clean, structured worksheet format.
3.  Use the exact text and numbers if they are present and legible.
4.  Recreate all imagery from the photo as simple, embedded SVG graphics. The SVGs must be clean, use only black strokes (stroke="currentColor") and no fill (fill="none"), and be easily recognizable for a kindergartener. For example: <svg>...</svg>. Do not use text placeholders like "[Image of...]" for drawings.
5.  The final output must be ONLY the raw HTML code for the content that will be placed inside the main body of the worksheet. Do not include \`<html>\`, \`<head>\`, \`<body>\`, or \`<!DOCTYPE>\` tags. Do not wrap the output in markdown backticks like \`\`\`html ... \`\`\`.
6.  Use Tailwind CSS classes for all styling. Make it look like a real kindergarten worksheet: large, clear fonts (e.g., \`text-2xl\`, \`font-sans\`), ample spacing (\`space-y-6\`, \`p-4\`), and simple borders for sections (\`border\`, \`border-dashed\`). Use flexbox (\`flex\`, \`items-center\`, \`justify-between\`) for layout.
7.  The structure should be clear and easy for a 5-year-old to follow. For example, if it's a matching game, use flexbox to create two columns. If it's a tracing activity, provide lighter text or dotted borders.
`;

export async function generateWorksheetFromImage(base64Image: string, mimeType: string): Promise<string> {
  try {
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: mimeType,
      },
    };

    const textPart = {
      text: prompt,
    };

    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: [imagePart, textPart] },
    });

    const generatedText = response.text;
    if (!generatedText) {
        throw new Error("The API returned an empty response.");
    }

    // Clean up the response to ensure it's valid HTML
    // Sometimes the model might wrap the response in markdown
    const cleanedHtml = generatedText.replace(/^```html\s*|```\s*$/g, '').trim();

    return cleanedHtml;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate worksheet from image. Please try again.");
  }
}