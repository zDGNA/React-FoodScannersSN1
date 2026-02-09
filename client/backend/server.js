// client/backend/server.js

const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const FormData = require('form-data');
const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:5000';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'foodscan_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Create uploads directory if not exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() +
        '-' +
        Math.round(Math.random() * 1e9) +
        path.extname(file.originalname),
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
  },
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({ success: false, message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// ==================== AUTH ROUTES ====================

// Register new user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, full_name } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'All fields are required' });
    }

    // Check if user exists
    const [existingUsers] = await pool.query(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username],
    );

    if (existingUsers.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password, full_name) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, full_name || username],
    );

    // Create default user goals
    await pool.query('INSERT INTO user_goals (user_id) VALUES (?)', [
      result.insertId,
    ]);

    // Create default preferences
    await pool.query('INSERT INTO user_preferences (user_id) VALUES (?)', [
      result.insertId,
    ]);

    // Generate token
    const token = jwt.sign({ id: result.insertId, email }, JWT_SECRET, {
      expiresIn: '30d',
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: result.insertId,
        username,
        email,
        full_name: full_name || username,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Login user
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'Email and password required' });
    }

    // Get user
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [
      email,
    ]);

    if (users.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid credentials' });
    }

    const user = users[0];

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '30d',
    });

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        profile_picture: user.profile_picture,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get current user profile
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, username, email, full_name, profile_picture, created_at FROM users WHERE id = ?',
      [req.user.id],
    );

    if (users.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user: users[0] });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ==================== USER GOALS ROUTES ====================

// Get user goals
app.get('/api/user/goals', authenticateToken, async (req, res) => {
  try {
    const [goals] = await pool.query(
      'SELECT * FROM user_goals WHERE user_id = ?',
      [req.user.id],
    );

    if (goals.length === 0) {
      await pool.query('INSERT INTO user_goals (user_id) VALUES (?)', [
        req.user.id,
      ]);
      const [newGoals] = await pool.query(
        'SELECT * FROM user_goals WHERE user_id = ?',
        [req.user.id],
      );
      return res.json({ success: true, goals: newGoals[0] });
    }

    res.json({ success: true, goals: goals[0] });
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update user goals
app.put('/api/user/goals', authenticateToken, async (req, res) => {
  try {
    const {
      daily_calorie_goal,
      target_weight,
      current_weight,
      height,
      unit_system,
    } = req.body;

    await pool.query(
      `UPDATE user_goals SET 
            daily_calorie_goal = COALESCE(?, daily_calorie_goal),
            target_weight = COALESCE(?, target_weight),
            current_weight = COALESCE(?, current_weight),
            height = COALESCE(?, height),
            unit_system = COALESCE(?, unit_system)
            WHERE user_id = ?`,
      [
        daily_calorie_goal,
        target_weight,
        current_weight,
        height,
        unit_system,
        req.user.id,
      ],
    );

    const [goals] = await pool.query(
      'SELECT * FROM user_goals WHERE user_id = ?',
      [req.user.id],
    );
    res.json({
      success: true,
      message: 'Goals updated successfully',
      goals: goals[0],
    });
  } catch (error) {
    console.error('Update goals error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ==================== FOOD ROUTES ====================

// Search foods
app.get('/api/foods/search', async (req, res) => {
  try {
    const { query, limit = 20 } = req.query;

    if (!query) {
      return res
        .status(400)
        .json({ success: false, message: 'Search query required' });
    }

    const [foods] = await pool.query(
      'SELECT * FROM foods WHERE name LIKE ? LIMIT ?',
      [`%${query}%`, parseInt(limit)],
    );

    res.json({ success: true, foods });
  } catch (error) {
    console.error('Search foods error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get food by ID
app.get('/api/foods/:id', async (req, res) => {
  try {
    const [foods] = await pool.query('SELECT * FROM foods WHERE id = ?', [
      req.params.id,
    ]);

    if (foods.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: 'Food not found' });
    }

    res.json({ success: true, food: foods[0] });
  } catch (error) {
    console.error('Get food error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ==================== AI DETECTION ROUTES ====================

// AI Food Detection
app.post('/api/ai/detect', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: 'No image provided' });
    }

    const imagePath = req.file.path;

    // Create form data to send to AI service
    const formData = new FormData();
    formData.append('image', fs.createReadStream(imagePath));

    // Call AI service
    const aiResponse = await axios.post(`${AI_SERVICE_URL}/detect`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
      timeout: 30000, // 30 seconds timeout
    });

    if (!aiResponse.data.success) {
      return res.json({
        success: false,
        message: 'No food detected in image',
        image_url: `/uploads/${req.file.filename}`,
      });
    }

    const detection = aiResponse.data.detection;

    // Try to find food in database
    const [dbFoods] = await pool.query(
      'SELECT * FROM foods WHERE LOWER(name) LIKE ?',
      [`%${detection.food_name.toLowerCase()}%`],
    );

    let foodData;
    if (dbFoods.length > 0) {
      // Use data from database
      foodData = dbFoods[0];
    } else {
      // Use data from AI detection
      foodData = {
        name: detection.food_name,
        calories: detection.nutrition.calories,
        protein: detection.nutrition.protein,
        carbs: detection.nutrition.carbs,
        fat: detection.nutrition.fat,
        portion: detection.portion,
      };
    }

    // Return detection result
    res.json({
      success: true,
      detection: {
        food_name: detection.food_name,
        confidence: detection.confidence,
        nutrition: {
          calories: foodData.calories,
          protein: foodData.protein,
          carbs: foodData.carbs,
          fat: foodData.fat,
        },
        portion: detection.portion,
        image_url: `/uploads/${req.file.filename}`,
        food_id: dbFoods.length > 0 ? dbFoods[0].id : null,
      },
    });
  } catch (error) {
    console.error('AI detection error:', error);

    // Return friendly error message
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        success: false,
        message: 'AI service is currently unavailable',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error processing image',
      error: error.message,
    });
  }
});

// AI Multiple Food Detection
app.post(
  '/api/ai/detect-multiple',
  upload.single('image'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: 'No image provided' });
      }

      const imagePath = req.file.path;

      const formData = new FormData();
      formData.append('image', fs.createReadStream(imagePath));

      const aiResponse = await axios.post(
        `${AI_SERVICE_URL}/detect-multiple`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
          timeout: 30000,
        },
      );

      const detections = aiResponse.data.detections || [];

      // Enrich detections with database info
      const enrichedDetections = await Promise.all(
        detections.map(async detection => {
          const [dbFoods] = await pool.query(
            'SELECT * FROM foods WHERE LOWER(name) LIKE ?',
            [`%${detection.food_name.toLowerCase()}%`],
          );

          if (dbFoods.length > 0) {
            return {
              ...detection,
              food_id: dbFoods[0].id,
              nutrition: {
                calories: dbFoods[0].calories,
                protein: dbFoods[0].protein,
                carbs: dbFoods[0].carbs,
                fat: dbFoods[0].fat,
              },
            };
          }

          return detection;
        }),
      );

      res.json({
        success: true,
        count: enrichedDetections.length,
        detections: enrichedDetections,
        image_url: `/uploads/${req.file.filename}`,
      });
    } catch (error) {
      console.error('AI multiple detection error:', error);

      if (error.code === 'ECONNREFUSED') {
        return res.status(503).json({
          success: false,
          message: 'AI service is currently unavailable',
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error processing image',
        error: error.message,
      });
    }
  },
);

// ==================== SCAN HISTORY ROUTES ====================

// Add scan to history
app.post(
  '/api/scans',
  authenticateToken,
  upload.single('image'),
  async (req, res) => {
    try {
      const {
        food_id,
        food_name,
        meal_type,
        portion,
        portion_unit,
        calories,
        protein,
        carbs,
        fat,
        fiber,
        ai_confidence,
      } = req.body;

      const scan_date = new Date().toISOString().split('T')[0];
      const scan_time = new Date().toTimeString().split(' ')[0];
      const image_url = req.file ? `/uploads/${req.file.filename}` : null;

      // Insert scan
      const [result] = await pool.query(
        `INSERT INTO scan_history 
            (user_id, food_id, food_name, meal_type, portion, portion_unit, calories, protein, carbs, fat, fiber, image_url, scan_date, scan_time, ai_confidence)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          req.user.id,
          food_id,
          food_name,
          meal_type,
          portion,
          portion_unit || 'g',
          calories,
          protein,
          carbs,
          fat,
          fiber,
          image_url,
          scan_date,
          scan_time,
          ai_confidence,
        ],
      );

      // Update daily summary
      await pool.query(
        `INSERT INTO daily_summary (user_id, date, total_calories, total_protein, total_carbs, total_fat, total_fiber, meal_count)
            VALUES (?, ?, ?, ?, ?, ?, ?, 1)
            ON DUPLICATE KEY UPDATE
            total_calories = total_calories + ?,
            total_protein = total_protein + ?,
            total_carbs = total_carbs + ?,
            total_fat = total_fat + ?,
            total_fiber = total_fiber + ?,
            meal_count = meal_count + 1`,
        [
          req.user.id,
          scan_date,
          calories,
          protein,
          carbs,
          fat,
          fiber,
          calories,
          protein,
          carbs,
          fat,
          fiber,
        ],
      );

      res.status(201).json({
        success: true,
        message: 'Scan added successfully',
        scan_id: result.insertId,
      });
    } catch (error) {
      console.error('Add scan error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  },
);

// Get scan history
app.get('/api/scans', authenticateToken, async (req, res) => {
  try {
    const { date, meal_type, limit = 50, offset = 0 } = req.query;

    let query = 'SELECT * FROM scan_history WHERE user_id = ?';
    let params = [req.user.id];

    if (date) {
      query += ' AND scan_date = ?';
      params.push(date);
    }

    if (meal_type && meal_type !== 'All') {
      query += ' AND meal_type = ?';
      params.push(meal_type);
    }

    query += ' ORDER BY scan_date DESC, scan_time DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [scans] = await pool.query(query, params);

    res.json({ success: true, scans, count: scans.length });
  } catch (error) {
    console.error('Get scans error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get daily summary
app.get('/api/summary/daily', authenticateToken, async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date || new Date().toISOString().split('T')[0];

    const [summary] = await pool.query(
      'SELECT * FROM daily_summary WHERE user_id = ? AND date = ?',
      [req.user.id, targetDate],
    );

    if (summary.length === 0) {
      return res.json({
        success: true,
        summary: {
          total_calories: 0,
          total_protein: 0,
          total_carbs: 0,
          total_fat: 0,
          total_fiber: 0,
          meal_count: 0,
        },
      });
    }

    res.json({ success: true, summary: summary[0] });
  } catch (error) {
    console.error('Get summary error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete scan
app.delete('/api/scans/:id', authenticateToken, async (req, res) => {
  try {
    const [scans] = await pool.query(
      'SELECT * FROM scan_history WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id],
    );

    if (scans.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: 'Scan not found' });
    }

    const scan = scans[0];

    await pool.query('DELETE FROM scan_history WHERE id = ?', [req.params.id]);

    await pool.query(
      `UPDATE daily_summary SET
            total_calories = total_calories - ?,
            total_protein = total_protein - ?,
            total_carbs = total_carbs - ?,
            total_fat = total_fat - ?,
            total_fiber = total_fiber - ?,
            meal_count = meal_count - 1
            WHERE user_id = ? AND date = ?`,
      [
        scan.calories,
        scan.protein,
        scan.carbs,
        scan.fat,
        scan.fiber,
        req.user.id,
        scan.scan_date,
      ],
    );

    res.json({ success: true, message: 'Scan deleted successfully' });
  } catch (error) {
    console.error('Delete scan error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ==================== HEALTH CHECK ====================

app.get('/api/health', async (req, res) => {
  try {
    // Check database connection
    await pool.query('SELECT 1');

    // Check AI service
    let aiServiceStatus = 'unknown';
    try {
      const aiHealth = await axios.get(`${AI_SERVICE_URL}/health`, {
        timeout: 5000,
      });
      aiServiceStatus = aiHealth.data.status;
    } catch (error) {
      aiServiceStatus = 'unavailable';
    }

    res.json({
      success: true,
      message: 'Server is running',
      timestamp: new Date(),
      services: {
        database: 'connected',
        ai_service: aiServiceStatus,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Health check failed',
      error: error.message,
    });
  }
});

// ==================== START SERVER ====================

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🤖 AI Service URL: ${AI_SERVICE_URL}`);
});

// Handle uncaught errors
process.on('uncaughtException', error => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', error => {
  console.error('Unhandled Rejection:', error);
});
