import { Router } from 'express';
import { parseOrderWithAI } from '../controllers/ai.controller';

// Router für AI-bezogene Endpunkte
const router = Router();

// POST /api/ai/parse-order
// Nimmt eine Freitext-Nachricht und gibt strukturierte Bestelldaten zurück.
router.post('/parse-order', parseOrderWithAI);

export default router;