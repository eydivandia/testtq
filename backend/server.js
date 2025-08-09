const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// Enable CORS for all origins (برای تست)
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  if (req.method === 'POST') {
    console.log('Body:', req.body);
  }
  next();
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:mongopass123@mongodb:27017/construction_management?authSource=admin';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB connected successfully');
  initAdmin();
})
.catch(err => {
  console.error('❌ MongoDB connection failed:', err.message);
});

// User Model
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  fullName: String,
  role: String,
  isActive: Boolean
});

const User = mongoose.model('User', userSchema);

// Create admin user
async function initAdmin() {
  try {
    const admin = await User.findOne({ username: 'admin' });
    if (!admin) {
      const hashedPass = await bcrypt.hash('admin123', 10);
      await User.create({
        username: 'admin',
        password: hashedPass,
        fullName: 'مدیر سیستم',
        role: 'admin',
        isActive: true
      });
      console.log('✅ Admin user created');
    }
  } catch (err) {
    console.error('Error creating admin:', err);
  }
}

// Test endpoint
app.get('/', (req, res) => {
  res.json({ status: 'Backend is running', time: new Date() });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

app.get('/api', (req, res) => {
  res.json({ message: 'API root endpoint' });
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'API test successful' });
});

// Login endpoint - این مهم است
app.post('/api/auth/login', async (req, res) => {
  console.log('Login request received:', req.body);
  
  try {
    const { username, password } = req.body;
    
    // برای تست، حتی بدون دیتابیس کار کند
    if (username === 'admin' && password === 'admin123') {
      const token = jwt.sign(
        { userId: '1', role: 'admin' },
        'secret-key',
        { expiresIn: '24h' }
      );
      
      return res.json({
        success: true,
        token: token,
        user: {
          id: '1',
          username: 'admin',
          fullName: 'مدیر سیستم',
          role: 'admin'
        }
      });
    }
    
    // اگر دیتابیس متصل است، از دیتابیس چک کن
    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ username });
      if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign(
          { userId: user._id, role: user.role },
          'secret-key',
          { expiresIn: '24h' }
        );
        
        return res.json({
          success: true,
          token: token,
          user: {
            id: user._id,
            username: user.username,
            fullName: user.fullName,
            role: user.role
          }
        });
      }
    }
    
    res.status(401).json({ 
      success: false, 
      error: 'نام کاربری یا رمز عبور اشتباه است' 
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'خطا در سرور' 
    });
  }
});

// Dashboard stats
app.get('/api/dashboard/stats', (req, res) => {
  res.json({
    totalProjects: 5,
    activeProjects: 3,
    totalMaterials: 150,
    pendingStatements: 8
  });
});

// Projects
app.get('/api/projects', (req, res) => {
  res.json([
    {
      _id: '1',
      projectCode: 'P001',
      projectName: 'پروژه برج مسکونی',
      clientName: 'شرکت عمران',
      status: 'active',
      overallProgress: 45
    },
    {
      _id: '2',
      projectCode: 'P002',
      projectName: 'مجتمع تجاری',
      clientName: 'گروه سرمایه‌گذاری',
      status: 'active',
      overallProgress: 70
    }
  ]);
});

// Handle 404
app.use((req, res) => {
  console.log('404 Not Found:', req.url);
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server is running on http://0.0.0.0:${PORT}`);
  console.log(`   Access via: http://localhost:${PORT}`);
});
