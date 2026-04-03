import { Request, Response } from 'express';
import { parseOrderSchema } from '../schemas/ai.schema';
import { parseOrderMessage } from '../services/llm.service';

// Controller für den AI Parse Endpoint.
//
// Ablauf:
// 1. Request lesen
// 2. Input validieren
// 3. LLM-Service aufrufen
// 4. Strukturierte Antwort zurückgeben
export const parseOrderWithAI = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Request-Body lesen
    const requestData = req.body;

    // Eingehende Daten validieren
    const validatedData = parseOrderSchema.parse(requestData);

    // LLM-Service aufrufen
    const parsedOrder = await parseOrderMessage(validatedData.message);

    // Erfolgreiche Antwort zurückgeben
    res.status(200).json({
      success: true,
      message: 'Order message parsed successfully',
      data: parsedOrder,
    });
  } catch (error) {
    // Fehlerantwort
    res.status(400).json({
      success: false,
      message: 'Failed to parse order message',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};