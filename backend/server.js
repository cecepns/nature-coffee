const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads-nature-coffee')));

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'nature_coffee'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads-nature-coffee');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// JWT middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Helper function for pagination
const getPagination = (page, size) => {
  const limit = size ? +size : 10;
  const offset = page ? (page - 1) * limit : 0;
  return { limit, offset };
};

// Helper function for paginated results
const getPagingData = (data, page, limit, total) => {
  const currentPage = page ? +page : 1;
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      currentPage,
      totalPages,
      totalItems: total,
      itemsPerPage: limit
    }
  };
};

// =================== AUTH ROUTES ===================

// Admin login
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  db.query('SELECT * FROM admins WHERE username = ?', [username], async (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const admin = results[0];
    const isValidPassword = await bcrypt.compare(password, admin.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email
      }
    });
  });
});

// =================== DASHBOARD ROUTES ===================

// Get dashboard stats
app.get('/api/dashboard/stats', authenticateToken, (req, res) => {
  const queries = [
    'SELECT COUNT(*) as count FROM menu WHERE is_available = true',
    'SELECT COUNT(*) as count FROM coffee_beans WHERE is_available = true',
    'SELECT COUNT(*) as count FROM gallery WHERE is_active = true',
    'SELECT COUNT(*) as count FROM reservations',
    'SELECT COUNT(*) as count FROM reservations WHERE date = CURDATE()',
  ];

  Promise.all(queries.map(query => {
    return new Promise((resolve, reject) => {
      db.query(query, (err, results) => {
        if (err) reject(err);
        else resolve(results[0].count);
      });
    });
  }))
  .then(results => {
    res.json({
      success: true,
      data: {
        totalMenus: results[0],
        totalCoffeeBeans: results[1],
        totalGallery: results[2],
        totalReservations: results[3],
        todayReservations: results[4],
        monthlyRevenue: 15000000 // Sample data
      }
    });
  })
  .catch(err => {
    res.status(500).json({ message: 'Database error', error: err });
  });
});

// =================== MENU ROUTES ===================

// Get all menu items (admin)
app.get('/api/menu', authenticateToken, (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const { limit: limitNum, offset } = getPagination(page, limit);

  // Get total count
  db.query('SELECT COUNT(*) as total FROM menu', (err, countResult) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }

    const total = countResult[0].total;

    // Get paginated data
    db.query(
      'SELECT * FROM menu ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [limitNum, offset],
      (err, results) => {
        if (err) {
          return res.status(500).json({ message: 'Database error', error: err });
        }

        const response = getPagingData(results, page, limitNum, total);
        res.json({ success: true, ...response });
      }
    );
  });
});

// Get menu items for public (limited)
// favorites_only=true: only return favorite menus (default for LandingPage)
// favorites_only=false: return all available menus (for MenuPage)
app.get('/api/menu/public', (req, res) => {
  const { limit = 6, favorites_only = 'true' } = req.query;
  const isFavoritesOnly = favorites_only === 'true' || favorites_only === true;
  
  let query;
  let params;
  
  if (isFavoritesOnly) {
    // Only return favorite menus
    query = 'SELECT * FROM menu WHERE is_available = true AND is_favorite = true ORDER BY created_at DESC LIMIT ?';
    params = [parseInt(limit)];
  } else {
    // Return all available menus
    query = 'SELECT * FROM menu WHERE is_available = true ORDER BY created_at DESC LIMIT ?';
    params = [parseInt(limit)];
  }
  
  db.query(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.json({ success: true, data: results });
  });
});

// Get single menu item
app.get('/api/menu/:id', (req, res) => {
  const { id } = req.params;
  
  db.query('SELECT * FROM menu WHERE id = ?', [id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    
    res.json({ success: true, data: results[0] });
  });
});

// Create menu item
app.post('/api/menu', authenticateToken, (req, res) => {
  const { name, description, price, category, image, is_available, is_favorite } = req.body;

  if (!name || !price) {
    return res.status(400).json({ message: 'Name and price are required' });
  }

  const query = 'INSERT INTO menu (name, description, price, category, image, is_available, is_favorite) VALUES (?, ?, ?, ?, ?, ?, ?)';
  const values = [name, description || '', price, category || 'coffee', image || null, is_available !== undefined ? is_available : true, is_favorite !== undefined ? is_favorite : false];

  db.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    
    res.status(201).json({ 
      success: true, 
      message: 'Menu item created successfully',
      id: result.insertId 
    });
  });
});

// Update menu item
app.put('/api/menu/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { name, description, price, category, image, is_available, is_favorite } = req.body;

  if (!name || !price) {
    return res.status(400).json({ message: 'Name and price are required' });
  }

  const query = 'UPDATE menu SET name = ?, description = ?, price = ?, category = ?, image = ?, is_available = ?, is_favorite = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
  const values = [name, description || '', price, category || 'coffee', image || null, is_available !== undefined ? is_available : true, is_favorite !== undefined ? is_favorite : false, id];

  db.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    
    res.json({ success: true, message: 'Menu item updated successfully' });
  });
});

// Delete menu item
app.delete('/api/menu/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  // First get the item to delete image file if exists
  db.query('SELECT image FROM menu WHERE id = ?', [id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }

    const item = results[0];
    
    db.query('DELETE FROM menu WHERE id = ?', [id], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Menu item not found' });
      }

      // Delete image file if exists
      if (item && item.image) {
        const imagePath = path.join(__dirname, 'uploads-nature-coffee', item.image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
      
      res.json({ success: true, message: 'Menu item deleted successfully' });
    });
  });
});

// Upload menu image
app.post('/api/menu/upload', authenticateToken, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file provided' });
  }

  res.json({
    success: true,
    message: 'Image uploaded successfully',
    filename: req.file.filename,
    url: `/uploads/${req.file.filename}`
  });
});

// =================== COFFEE BEANS ROUTES ===================

// Get all coffee beans (admin)
app.get('/api/coffee-beans', authenticateToken, (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const { limit: limitNum, offset } = getPagination(page, limit);

  db.query('SELECT COUNT(*) as total FROM coffee_beans', (err, countResult) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }

    const total = countResult[0].total;

    db.query(
      'SELECT * FROM coffee_beans ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [limitNum, offset],
      (err, results) => {
        if (err) {
          return res.status(500).json({ message: 'Database error', error: err });
        }

        const response = getPagingData(results, page, limitNum, total);
        res.json({ success: true, ...response });
      }
    );
  });
});

// Get coffee beans for public
app.get('/api/coffee-beans/public', (req, res) => {
  const { limit = 6 } = req.query;
  
  db.query(
    'SELECT * FROM coffee_beans WHERE is_available = true ORDER BY created_at DESC LIMIT ?',
    [parseInt(limit)],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err });
      }
      res.json({ success: true, data: results });
    }
  );
});

// Get single coffee bean
app.get('/api/coffee-beans/:id', (req, res) => {
  const { id } = req.params;
  
  db.query('SELECT * FROM coffee_beans WHERE id = ?', [id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ message: 'Coffee bean not found' });
    }
    
    res.json({ success: true, data: results[0] });
  });
});

// Create coffee bean
app.post('/api/coffee-beans', authenticateToken, (req, res) => {
  const { name, description, price, origin, roast_level, weight, image, is_available } = req.body;

  if (!name || !price) {
    return res.status(400).json({ message: 'Name and price are required' });
  }

  const query = 'INSERT INTO coffee_beans (name, description, price, origin, roast_level, weight, image, is_available) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  const values = [
    name, 
    description || '', 
    price, 
    origin || '', 
    roast_level || 'Medium', 
    weight || '1 kg', 
    image || null, 
    is_available !== undefined ? is_available : true
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    
    res.status(201).json({ 
      success: true, 
      message: 'Coffee bean created successfully',
      id: result.insertId 
    });
  });
});

// Update coffee bean
app.put('/api/coffee-beans/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { name, description, price, origin, roast_level, weight, image, is_available } = req.body;

  if (!name || !price) {
    return res.status(400).json({ message: 'Name and price are required' });
  }

  const query = 'UPDATE coffee_beans SET name = ?, description = ?, price = ?, origin = ?, roast_level = ?, weight = ?, image = ?, is_available = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
  const values = [
    name, 
    description || '', 
    price, 
    origin || '', 
    roast_level || 'Medium', 
    weight || '1 kg', 
    image || null, 
    is_available !== undefined ? is_available : true, 
    id
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Coffee bean not found' });
    }
    
    res.json({ success: true, message: 'Coffee bean updated successfully' });
  });
});

// Delete coffee bean
app.delete('/api/coffee-beans/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  db.query('SELECT image FROM coffee_beans WHERE id = ?', [id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }

    const item = results[0];
    
    db.query('DELETE FROM coffee_beans WHERE id = ?', [id], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Coffee bean not found' });
      }

      if (item && item.image) {
        const imagePath = path.join(__dirname, 'uploads-nature-coffee', item.image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
      
      res.json({ success: true, message: 'Coffee bean deleted successfully' });
    });
  });
});

// Upload coffee bean image
app.post('/api/coffee-beans/upload', authenticateToken, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file provided' });
  }

  res.json({
    success: true,
    message: 'Image uploaded successfully',
    filename: req.file.filename,
    url: `/uploads/${req.file.filename}`
  });
});

// =================== GALLERY ROUTES ===================

// Get all gallery items (admin)
app.get('/api/gallery', authenticateToken, (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const { limit: limitNum, offset } = getPagination(page, limit);

  db.query('SELECT COUNT(*) as total FROM gallery', (err, countResult) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }

    const total = countResult[0].total;

    db.query(
      'SELECT * FROM gallery ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [limitNum, offset],
      (err, results) => {
        if (err) {
          return res.status(500).json({ message: 'Database error', error: err });
        }

        const response = getPagingData(results, page, limitNum, total);
        res.json({ success: true, ...response });
      }
    );
  });
});

// Get gallery for public
app.get('/api/gallery/public', (req, res) => {
  db.query(
    'SELECT * FROM gallery WHERE is_active = true ORDER BY created_at DESC',
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err });
      }
      res.json({ success: true, data: results });
    }
  );
});

// Get single gallery item
app.get('/api/gallery/:id', (req, res) => {
  const { id } = req.params;
  
  db.query('SELECT * FROM gallery WHERE id = ?', [id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }
    
    res.json({ success: true, data: results[0] });
  });
});

// Create gallery item
app.post('/api/gallery', authenticateToken, (req, res) => {
  const { title, description, image, is_active } = req.body;

  if (!title || !image) {
    return res.status(400).json({ message: 'Title and image are required' });
  }

  const query = 'INSERT INTO gallery (title, description, image, is_active) VALUES (?, ?, ?, ?)';
  const values = [title, description || '', image, is_active !== undefined ? is_active : true];

  db.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    
    res.status(201).json({ 
      success: true, 
      message: 'Gallery item created successfully',
      id: result.insertId 
    });
  });
});

// Update gallery item
app.put('/api/gallery/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { title, description, image, is_active } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  const query = 'UPDATE gallery SET title = ?, description = ?, image = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
  const values = [title, description || '', image || null, is_active !== undefined ? is_active : true, id];

  db.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }
    
    res.json({ success: true, message: 'Gallery item updated successfully' });
  });
});

// Delete gallery item
app.delete('/api/gallery/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  db.query('SELECT image FROM gallery WHERE id = ?', [id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }

    const item = results[0];
    
    db.query('DELETE FROM gallery WHERE id = ?', [id], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Gallery item not found' });
      }

      if (item && item.image) {
        const imagePath = path.join(__dirname, 'uploads-nature-coffee', item.image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
      
      res.json({ success: true, message: 'Gallery item deleted successfully' });
    });
  });
});

// Upload gallery image
app.post('/api/gallery/upload', authenticateToken, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file provided' });
  }

  res.json({
    success: true,
    message: 'Image uploaded successfully',
    filename: req.file.filename,
    url: `/uploads/${req.file.filename}`
  });
});

// =================== RESERVATIONS ROUTES ===================

// Get all reservations (admin)
app.get('/api/reservations', authenticateToken, (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const { limit: limitNum, offset } = getPagination(page, limit);

  db.query('SELECT COUNT(*) as total FROM reservations', (err, countResult) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }

    const total = countResult[0].total;

    db.query(
      'SELECT * FROM reservations ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [limitNum, offset],
      (err, results) => {
        if (err) {
          return res.status(500).json({ message: 'Database error', error: err });
        }

        const response = getPagingData(results, page, limitNum, total);
        res.json({ success: true, ...response });
      }
    );
  });
});

// Get single reservation
app.get('/api/reservations/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  
  db.query('SELECT * FROM reservations WHERE id = ?', [id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    
    res.json({ success: true, data: results[0] });
  });
});

// Create reservation
app.post('/api/reservations', (req, res) => {
  const { name, email, phone, date, time, guests, notes } = req.body;

  if (!name || !email || !phone || !date || !time || !guests) {
    return res.status(400).json({ message: 'All required fields must be provided' });
  }

  const query = 'INSERT INTO reservations (name, email, phone, date, time, guests, notes, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  const values = [name, email, phone, date, time, guests, notes || '', 'pending'];

  db.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    
    res.status(201).json({ 
      success: true, 
      message: 'Reservation created successfully',
      id: result.insertId 
    });
  });
});

// Update reservation
app.put('/api/reservations/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { name, email, phone, date, time, guests, notes, status } = req.body;

  if (!name || !email || !phone || !date || !time || !guests) {
    return res.status(400).json({ message: 'All required fields must be provided' });
  }

  const query = 'UPDATE reservations SET name = ?, email = ?, phone = ?, date = ?, time = ?, guests = ?, notes = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
  const values = [name, email, phone, date, time, guests, notes || '', status || 'pending', id];

  db.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    
    res.json({ success: true, message: 'Reservation updated successfully' });
  });
});

// Delete reservation
app.delete('/api/reservations/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  
  db.query('DELETE FROM reservations WHERE id = ?', [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    
    res.json({ success: true, message: 'Reservation deleted successfully' });
  });
});

// =================== SETTINGS ROUTES ===================

// Get settings
app.get('/api/settings', (req, res) => {
  db.query('SELECT * FROM settings ORDER BY id DESC LIMIT 1', (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    
    const settings = results.length > 0 ? results[0] : {
      about_us: '',
      address: '',
      phone: '',
      instagram: '',
      tiktok: '',
      maps_url: ''
    };
    
    res.json({ success: true, data: settings });
  });
});

// Update settings
app.put('/api/settings', authenticateToken, (req, res) => {
  const { about_us, address, phone, instagram, tiktok, maps_url } = req.body;

  // Check if settings exist
  db.query('SELECT id FROM settings LIMIT 1', (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }

    let query, values;

    if (results.length > 0) {
      // Update existing settings
      query = 'UPDATE settings SET about_us = ?, address = ?, phone = ?, instagram = ?, tiktok = ?, maps_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
      values = [about_us || '', address || '', phone || '', instagram || '', tiktok || '', maps_url || '', results[0].id];
    } else {
      // Insert new settings
      query = 'INSERT INTO settings (about_us, address, phone, instagram, tiktok, maps_url) VALUES (?, ?, ?, ?, ?, ?)';
      values = [about_us || '', address || '', phone || '', instagram || '', tiktok || '', maps_url || ''];
    }

    db.query(query, values, (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err });
      }
      
      res.json({ success: true, message: 'Settings updated successfully' });
    });
  });
});

// =================== ERROR HANDLING ===================

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// =================== SERVER START ===================

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Upload directory: ${path.join(__dirname, 'uploads-nature-coffee')}`);
});