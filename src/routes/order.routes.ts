import { Router } from 'express';
import { createOrder, getAllOrders, getOrderById } from '../controllers/order.controller';

// Router für alle Order-Endpunkte
const router = Router();


// GET /api/orders
// Gibt alle Bestellungen zurück
router.get('/', getAllOrders);

// GET /api/orders/:id
// Gibt eine Bestellung anhand der ID zurück
router.get('/:id', getOrderById);

// POST /api/orders
// Erstellt eine neue Bestellung.
router.post('/', createOrder);

export default router;