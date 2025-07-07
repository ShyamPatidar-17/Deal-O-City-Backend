// server.js or index.js

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

// ✅ Connect to DB and Cloudinary
connectDB();
connectCloudinary();

// ✅ Allow both frontend and admin panel
const allowedOrigins = [
  'https://admin-deal-o-city-17.vercel.app',
  'https://deal-o-city-frontend.vercel.app',
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Needed for cookies/session/csrf/auth headers
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// ✅ Enable CORS
app.use(cors(corsOptions));

// ✅ Handle preflight OPTIONS requests for all routes
app.options('*', cors(corsOptions));

// ✅ Body parser
app.use(express.json());

// ✅ Optional: log requests to debug CORS
app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.url} from origin: ${req.headers.origin}`);
  next();
});

// ✅ Base route
app.get('/', (req, res) => {
  res.send('Home ROUTE');
});

// ✅ API Routes
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

// ✅ Start server
app.listen(port, () => {
  console.log(`✅ Backend running on http://localhost:${port}`);
});
