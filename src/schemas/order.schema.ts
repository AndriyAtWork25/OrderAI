import { z } from 'zod';

// Validierung für eine einzelne Bestellposition
export const orderItemSchema = z.object({
    productId: z.string().optional(),
    productName: z
    .string()
    .min(2, 'Product name must be at least 2 characters long'),

    // Menge muss ganze Zahl > 0 sein.
    quantity: z
    .number()
    .int('Quantity must be a whole number')
    .positive('Quantity must be greater than 0'),

    // Farbe optional
    color: z.string().optional(),

    // Größe optional
    size: z.string().optional(),
});

// Validierung für die gesamte Bestellung
export const orderSchema = z.object({
    customerName: z
    .string()
    .min(2, 'Customer name must be at least 2 characters long'),
     
    // Kundentyp muss entweder 'b2b' oder 'b2c' sein.
    customerType: z.enum(['b2b', 'b2c', 'unknown']),
        originalMessage: z
        .string()
        .min(5, 'Original message must be at least 5 characters long'),

        // Es muss mindestens eine Position geben.
        items: z
        .array(orderItemSchema)
        .min(1, 'At least one order item is required'),

        // Status mit Default
        status: z
        .enum(['pending', 'confirmed', 'shipped'])
        .default('pending'),

        // Notizen optional
        notes: z.string().optional(),

        // KI-Zusammenfassung optional
        aiSummary: z.string().optional(),
    });