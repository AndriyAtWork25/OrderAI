import { Request, Response } from 'express';
import { parseOrderSchema } from '../schemas/ai.schema';
import { parseOrderMessage } from '../services/llm.service';
import { orderSchema } from '../schemas/order.schema';
import Order from '../models/order.model';
import { matchProductVariantAndCheckStock } from '../services/product-matching.service';

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

export const processOrderWithAI = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Input validieren
    const validatedInput = parseOrderSchema.parse(req.body);

    // AI Parsing
    const parsedOrder = await parseOrderMessage(validatedInput.message);

    // Alle Items prüfen
    const checkResults = [];

    for (const item of parsedOrder.items) {
      const result = await matchProductVariantAndCheckStock(item);
      checkResults.push({ item, result });
    }

    // Prüfen ob alle Items gültig sind
    const hasError = checkResults.some(
      (r) => !r.result.matched || r.result.inStock === false
    );

    // Wenn Fehler → KEIN speichern
    if (hasError) {
       res.status(400).json({
        success: false,
        message: 'Order cannot be processed',
        data: {
          parsedOrder,
          checks: checkResults,
        },
      });
      return;
    }

    // Wenn alles passt → validieren
    const validatedOrderData = orderSchema.parse(parsedOrder);

    // Order speichern
    const newOrder = await Order.create(validatedOrderData);

    // Erfolgsantwort
    res.status(201).json({
      success: true,
      message: 'Order processed and saved successfully',
      data: {
        order: newOrder,
        checks: checkResults,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to process order with AI',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Diese Funktion:
// 1. parst die Nachricht mit AI
// 2. prüft jedes Item gegen die Produkt-Datenbank
// 3. gibt Matching + Stock Info zurück (ohne speichern)
export const checkOrderWithAI = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Input validieren
    const validatedInput = parseOrderSchema.parse(req.body);

    // AI Parsing
    const parsedOrder = await parseOrderMessage(validatedInput.message);

    // Für jedes Item Matching durchführen
    const results = [];

    for (const item of parsedOrder.items) {
      const matchResult = await matchProductVariantAndCheckStock(item);

      results.push({
        item,
        matchResult,
      });
    }

    // Ergebnis zurückgeben
    res.status(200).json({
      success: true,
      message: 'Order checked successfully',
      data: {
        parsedOrder,
        checks: results,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to check order',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};