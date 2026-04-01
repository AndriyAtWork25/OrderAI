import { Request, Response } from 'express';
import Product from '../models/product.model';
import { productSchema } from '../schemas/product.schema';

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // req.body enthält die Daten,
    // die der Client an unser Backend geschickt hat.
    const requestData = req.body;

    const validatedData = productSchema.parse(requestData);

    const newProduct = await Product.create(validatedData);

    res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: newProduct,
    });
  } catch (error) {
    res.status(400).json({
        success: false,
        message: 'Failed to create product',
        error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getAllProducts = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    // Alle Produkte aus der Collection laden.
    // sort({ createdAt: -1 }) bedeutet:
    // neueste Produkte zuerst.
    const products = await Product.find().sort({ createdAt: -1 });

    // Erfolgsantwort mit allen Produkten.
    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    // Falls beim Lesen etwas schiefgeht.
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Ein einzelnes Produkt per ID abrufen
export const getProductById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Die ID kommt aus der URL, z. B. /api/products/:id
    const { id } = req.params;

    // Produkt anhand der MongoDB-ID suchen
    const product = await Product.findById(id);

    // Wenn nichts gefunden wurde, 404 zurückgeben
    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found',
      });
      return;
    }

    // Wenn gefunden, Produkt zurückgeben
    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    // Falls ID ungültig ist oder DB-Fehler auftritt
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};