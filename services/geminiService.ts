
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
    console.warn("VITE_GEMINI_API_KEY environment variable not set. Using mock responses.");
}

let genAI: GoogleGenerativeAI | null = null;
if (API_KEY) {
    genAI = new GoogleGenerativeAI(API_KEY);
}

export const generateContentFromPrompt = async (prompt: string): Promise<string> => {
    if (!API_KEY || !genAI) {
        // Return mock data if API key is not available
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(`This is a mock AI response for: "${prompt}"\n\nIn a real scenario, this would be intelligent content generated based on your trusted academic sources including:\n\n• Previous year question papers\n• E-textbooks from your library\n• Reference materials\n• Verified academic resources\n\nThe response would include:\n✓ Detailed explanations\n✓ Source citations\n✓ Structured study notes\n✓ Example problems and solutions\n\nTo enable real AI responses, add your Gemini API key to the .env file.`);
            }, 1500);
        });
    }

    try {
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash",
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 2048,
            }
        });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        if (text) {
            return text;
        } else {
            return "No content generated. The response was empty.";
        }

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (error instanceof Error) {
            return `Error generating content: ${error.message}\n\nPlease check your API key configuration.`;
        }
        return "An unknown error occurred while generating content.";
    }
};
