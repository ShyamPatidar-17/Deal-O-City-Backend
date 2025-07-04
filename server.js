import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoutes.js';

const app = express();
const port = process.env.PORT || 4000;

// ✅ Connect to MongoDB and Cloudinary
connectDB();
connectCloudinary();

// ✅ CORS configuration to allow multiple frontends
const allowedOrigins = [
  'http://localhost:5173',      // Frontend 1 (e.g., Vite)
  'http://localhost:5174',      // Frontend 2 (e.g., React CRA)

];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// ✅ Middleware
app.use(express.json());

// ✅ Routes
app.get('/', (req, res) => {
  res.send('Home ROUTE');
});

app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

// ✅ Start Server
app.listen(port, () => {
  console.log(`✅ Backend running on http://localhost:${port}`);
});
