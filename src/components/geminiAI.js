import 'dotenv/config';
import { GoogleGenerativeAI } from "@google/generative-ai";

// making the question
export const adviceGenerator = async(prompt) => {
  const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  
  try{
    result = await model.generateContent({
      contents: [
          {
            role: 'user',
            parts: [
              {
                text: prompt,
              }
            ],
          }
      ],
      generationConfig: {
        maxOutputTokens: 150,
        temperature: 0.1,
      }
    });
    return result.response.text();
  }
  catch (error) {
    console.error('Error with gemini stuff', error);
  }
};
