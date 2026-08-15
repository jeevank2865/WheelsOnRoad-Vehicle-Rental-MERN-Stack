require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./src/config/db');

connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3001', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'auth-token'],
  credentials: true
}));
app.use(express.json());

// Inject Socket.io into request handlers
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Socket.io Real-Time Reservation Event Stream
io.on('connection', (socket) => {
  console.log(`⚡ ApexLease Socket Connected: ${socket.id}`);

  socket.on('selectDateRange', (data) => {
    socket.broadcast.emit('temporaryLock', data);
  });

  socket.on('disconnect', () => {
    console.log(`🔌 ApexLease Socket Disconnected: ${socket.id}`);
  });
});

const path = require('path');
const multer = require('multer');

// Image Storage Engine for Uploaded Files
const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage: storage });

// Serve static uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Image Upload API endpoint
app.post('/upload', upload.single('vehicleImage'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: 0, message: 'No file uploaded' });
  }
  res.json({
    success: 1,
    image_url: `http://localhost:5000/uploads/${req.file.filename}`
  });
});

// API Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/vehicles', require('./src/routes/vehicleRoutes'));
app.use('/api/bookings', require('./src/routes/bookingRoutes'));
app.use('/api/payment-settings', require('./src/routes/paymentSettingsRoutes'));
app.use('/api/payments', require('./src/routes/paymentRoutes'));

app.get('/', (req, res) => {
  res.send('ApexLease Superbike & Car Rental API Backend Server Active');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 ApexLease Backend running on port ${PORT}`);
});
