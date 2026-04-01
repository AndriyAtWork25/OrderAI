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