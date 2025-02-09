import { GoogleGenerativeAI } from "@google/generative-ai";

// making the question
export const adviceGenerator = async(prompt) => {
  const genAI = new GoogleGenerativeAI("AIzaSyBbOaDf9REAzoIzpDQw_l8XRSJ4Bp6aM0s");
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  
  try{
    const result = await model.generateContent({
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
        maxOutputTokens: 600,
        temperature: 0.3,
      }
    });
    const text = result.response.text();
    return text;
  }
  catch (error) {
    console.error('Error with gemini stuff', error);
  }
};
