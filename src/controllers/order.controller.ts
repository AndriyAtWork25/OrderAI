import { Request, Response } from 'express';
import Order from '../models/order.model';
import { orderSchema } from '../schemas/order.schema';

export const createOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Eingehende Daten aus dem Request-Body lesen.
    const requestData = req.body;

    // Request-Daten validieren.
    // Wenn etwas ungültig ist, wirft Zod automatisch einen Fehler.
    const validatedData = orderSchema.parse(requestData);

    // Neue Bestellung in MongoDB anlegen.
    const newOrder = await Order.create(validatedData);

    // Erfolgreiche Antwort zurückgeben.
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: newOrder,
    });
  } catch (error) {
    // Falls Validation oder DB-Speicherung scheitert,
    // geben wir eine Fehlerantwort zurück.
    res.status(400).json({
      success: false,
      message: 'Failed to create order',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Alle Bestellungen abrufen
export const getAllOrders = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    // Alle Orders aus MongoDB laden.
    // Neueste zuerst.
    const orders = await Order.find().sort({ createdAt: -1 });

    // Erfolgreiche Antwort mit allen Bestellungen
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    // Fehler beim Laden der Daten
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Eine einzelne Bestellung per ID abrufen
export const getOrderById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // ID aus der URL holen (z.B. /api/orders/:id)
    const { id } = req.params;

    // Bestellung anhand der ID suchen
    const order = await Order.findById(id);

    // Wenn keine Bestellung gefunden wurde
    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Order not found',
      });
      return;
    }

    // Erfolgsantwort
    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    // Fehler (z.B. ungültige ID)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
