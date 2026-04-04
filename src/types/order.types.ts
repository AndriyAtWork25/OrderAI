export interface OrderItem {
    productId?: string;

    productName: string;

    quantity: number;

    color?: string;

    size?: string;
}

export interface OrderData {

    customerName: string;

    // B2B = Händler / Verein / Firma
    // B2C = Endkunde
    customerType: 'b2b' | 'b2c' | 'unknown';

    originalMessage: string;

    items: OrderItem[];

    status: 'pending' | 'confirmed' | 'shipped';

    notes?: string;

    aiSummary?: string;
}