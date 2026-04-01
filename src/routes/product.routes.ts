import { Router } from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
} from '../controllers/product.controller';

// Router für alle Produkt-Endpunkte.
const router = Router();

// GET /api/products
// Gibt alle Produkte zurück.
router.get('/', getAllProducts);

// GET /api/products/:id
router.get('/:id', getProductById);

// POST /api/products
// Erstellt ein neues Produkt.
router.post('/', createProduct);

export default router;