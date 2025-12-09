const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
  console.error('NEXT_PUBLIC_GEMINI_API_KEY is missing!');
  throw new Error('Gemini API key not configured');
}

const MODEL_NAMES = [
  'gemini-2.0-flash',
  'gemini-2.0-pro',
  'gemini-2.5-flash',
];

async function generateContent(prompt) {
  const errors = [];

  for (const modelName of MODEL_NAMES) {
    try {
      console.log(`Trying model: ${modelName} with v1 API...`);

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey,
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: prompt }],
            }],
            generationConfig: {
              temperature: 1,
              topP: 0.95,
              topK: 64,
              maxOutputTokens: 8192,
            },
            safetySettings: [
              {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE",
              },
              {
                category: "HARM_CATEGORY_HATE_SPEECH",
                threshold: "BLOCK_MEDIUM_AND_ABOVE",
              },
              {
                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE",
              },
              {
                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE",
              },
            ],
          }),
        },
      );

      const data = await response.json();

      if (response.ok &&
          data.candidates &&
          data.candidates[0] &&
          data.candidates[0].content) {
        console.log(`✅ Success with model: ${modelName}`);
        const text = data.candidates[0].content.parts[0].text;
        generateContent.workingModel = modelName;
        return text;
      }

      errors.push(`${modelName}: ${data.error?.message || 'Unknown error'}`);
    } catch (error) {
      errors.push(`${modelName}: ${error.message}`);
      continue;
    }
  }

  console.error('All models failed:', errors);
  throw new Error(`All Gemini models failed. Errors: ${errors.join('; ')}`);
}

export const chatSession = {
  sendMessage: async (prompt) => {
    const text = await generateContent(prompt);
    return {
      response: {
        text: () => text,
      },
    };
  },
};

console.log('✅ Gemini AI initialized with model fallback system');
