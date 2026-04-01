import express from 'express';
import cors from 'cors';
import productRoutes from './routes/product.routes';
import orderRoutes from './routes/order.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
    res.status(200).json({
        success: true,
        message: 'API is running',
    });
});

app.use('/api/products', productRoutes);

app.use('/api/orders', orderRoutes);

export default app;