import { Request, Response } from 'express';
import { parseOrderSchema } from '../schemas/ai.schema';
import { parseOrderMessage } from '../services/llm.service';
import { orderSchema } from '../schemas/order.schema';
import Order from '../models/order.model';


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

// Diese Funktion geht einen Schritt weiter:
// 1. Nachricht an AI schicken
// 2. AI-Output gegen unser Order-Schema validieren
// 3. Bestell-Datensatz in MongoDB speichern
export const processOrderWithAI = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Request-Body lesen
    const requestData = req.body;

    // Nur die eingehende Nachricht validieren
    const validatedInput = parseOrderSchema.parse(requestData);

    // Nachricht durch das LLM parsen lassen
    const parsedOrder = await parseOrderMessage(validatedInput.message);

    // Sehr wichtig:
    // Jetzt prüfen wir, ob das AI-Ergebnis wirklich
    // zu unserem Order-Datenmodell passt.
    const validatedOrderData = orderSchema.parse(parsedOrder);

    // Wenn alles passt, speichern wir die Order in MongoDB.
    const newOrder = await Order.create(validatedOrderData);

    // Erfolgsantwort mit der gespeicherten Order
    res.status(201).json({
      success: true,
      message: 'Order processed and saved successfully',
      data: newOrder,
    });
  } catch (error) {
    // Fehler kann kommen von:
    // - parseOrderSchema
    // - OpenAI Request
    // - orderSchema
    // - MongoDB save
    res.status(400).json({
      success: false,
      message: 'Failed to process order with AI',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};