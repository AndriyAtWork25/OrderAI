import app from './app';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        
        console.log('MongoDB connected successfully');

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
      console.error('Failed to start server', error);
      process.exit(1);
    }
};

startServer();