import { z } from 'zod';

// Dieses Schema validiert den Input für unseren AI-Parse-Endpoint.
// Der Client soll uns eine Freitext-Nachricht schicken,
// die wir später vom LLM analysieren lassen.
export const parseOrderSchema = z.object({
  // Die Originalnachricht vom Kunden.
  // Beispiel:
  // "We need 30 black running socks in size M."
  message: z
    .string()
    .min(5, 'Message must be at least 5 characters long'),
});