import { Router } from 'express';
import { parseOrderWithAI, processOrderWithAI, } from '../controllers/ai.controller';

// Router für AI-bezogene Endpunkte
const router = Router();

// POST /api/ai/parse-order
// Nimmt eine Freitext-Nachricht und gibt strukturierte Bestelldaten zurück.
router.post('/parse-order', parseOrderWithAI);

// POST /api/ai/process-order
// Analysieren + als Order speichern
router.post('/process-order', processOrderWithAI);

export default router;