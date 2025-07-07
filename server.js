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

// Connect DB & Cloudinary
connectDB();
connectCloudinary();

// Trust proxy for Vercel deployments
app.set('trust proxy', 1);

// Allowed frontend URLs (no trailing slash)
const allowedOrigins = [
  'https://admin-deal-o-city-17.vercel.app',
  'https://deal-o-city-frontend.vercel.app',
  'http://localhost:5174',
  'http://localhost:5173',
];

// CORS options
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

// Apply CORS middleware before JSON parsing
app.use(cors(corsOptions));

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('✅ Backend is running!');
});

app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

// Start server
app.listen(port, () => {
  console.log(`✅ Backend running on http://localhost:${port}`);
});
