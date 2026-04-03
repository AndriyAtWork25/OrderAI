import dotenv from 'dotenv';
dotenv.config();

import OpenAI from 'openai';

// OpenAI Client erstellen.
// Der API Key wird aus der .env geladen.
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Diese Funktion schickt eine Kunden-Nachricht an das LLM
// und erwartet strukturierte Bestelldaten als JSON zurück.
//
// Wichtig:
// Wir wollen hier noch NICHT direkt in die DB speichern.
// Erstmal nur sauber parsen.
export const parseOrderMessage = async (message: string) => {
  // Der Prompt sagt dem Modell ganz klar,
  // welche Aufgabe es hat und welches JSON-Format es liefern soll.
  const prompt = `
You are an AI assistant for a sportswear company.

Your task is to extract structured order information from a customer message.

Return ONLY valid JSON.
Do not include markdown.
Do not include explanations.

Use this exact structure:
{
  "customerName": "string or unknown",
  "customerType": "b2b or b2c or unknown",
  "originalMessage": "string",
  "items": [
    {
      "productName": "string",
      "quantity": number,
      "color": "string or empty",
      "size": "string or empty"
    }
  ],
  "notes": "string or empty",
  "aiSummary": "short summary"
}

Rules:
- Keep originalMessage equal to the user message
- If customer name is unknown, use "unknown"
- If customer type is unclear, use "unknown"
- If there are no clear notes, use empty string
- Extract as accurately as possible

Customer message:
"${message}"
`;

  // Anfrage an das Modell senden.
  const response = await openai.chat.completions.create({
    model: 'gpt-4.1-mini',
    temperature: 0,
    messages: [
      {
        role: 'system',
        content:
          'You extract structured order data from customer messages and return strict JSON only.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  // Textantwort des Modells auslesen.
  const content = response.choices[0]?.message?.content;

  // Falls das Modell nichts Sinnvolles zurückgibt,
  // werfen wir bewusst einen Fehler.
  if (!content) {
    throw new Error('No response content received from LLM');
  }

  // Das Modell soll JSON liefern.
  // Deshalb parsen wir den String hier zu einem JS-Objekt.
  const parsedResult = JSON.parse(content);

  return parsedResult;
};